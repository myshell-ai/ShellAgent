import {
  PencilSquareIcon,
  ArrowLeftIcon,
  PlayIcon,
  ChevronDownIcon,
  ArrowUpRightIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { IFlow } from '@shellagent/flow-engine';
import {
  Button,
  Heading,
  IconButton,
  Text,
  Input,
  Popover,
  Separator,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ScrollArea,
} from '@shellagent/ui';
import { useBoolean, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash-es';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { ExtraActions } from '@/components/workflow/extra-action';
import { editItem } from '@/services/home';
import {
  saveWorkflow,
  releaseWorkflow,
  fetchWorkflowVersionList,
} from '@/services/workflow';
import { useWorkflowState } from '@/stores/workflow/use-workflow-state';
import { genWorkflow } from '@/stores/workflow/utils/data-transformer';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { cn } from '@/utils/cn';

import VersionSkeleton from './skeleton';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export const Header: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const flowId = params.get('id');
  const version = params.get('version');
  const [versionName, setVersionName] = useState('');
  const [showPublishPopover, publishPopoverActions] = useBoolean(false);
  const hiddenOperation = !!version;

  const {
    config,
    metadata,
    nodeData,
    flowInstance,
    loading,
    updateMetadata,
    widgetSchema,
  } = useWorkflowStore(
    useShallow(state => ({
      config: state.config,
      metadata: state.metadata,
      nodeData: state.nodeData,
      flowInstance: state.flowInstance,
      loading: state.loading,
      updateMetadata: state.updateMetadata,
      widgetSchema: state.widgetSchema,
    })),
  );

  const { editing, setEditing, setRunSheetOpen } = useWorkflowState(
    state => state,
  );

  const {
    run: getVersionList,
    data: versionData,
    loading: getVersionLoading,
  } = useRequest(fetchWorkflowVersionList, {
    manual: true,
    onError: error => {
      toast.error(error.message);
    },
  });

  const { run: release, loading: releaseLoading } = useRequest(
    releaseWorkflow,
    {
      manual: true,
      onSuccess: result => {
        if (result.success) {
          toast.success('Publish Success!', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
          getVersionList({ flow_id: flowId! });
          setVersionName('');
        } else {
          toast.error('Publish Error!', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        }
      },
      onError: () => {
        toast.error('Publish Error!', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      },
    },
  );

  const { run: restoreWorkflow, loading: restoreLoading } = useRequest(
    saveWorkflow,
    {
      manual: true,
      onSuccess: result => {
        if (result.success) {
          toast.success('Restore Success!', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
          router.push(`/workflow/detail?id=${flowId}`);
        } else {
          toast.error('Restore Error!', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        }
      },
      onError: () => {
        toast.error('Restore Error!', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      },
    },
  );

  const handleRelease = useCallback(async () => {
    const reactflow = flowInstance?.toObject() as IFlow;
    const workflow = genWorkflow(
      reactflow,
      nodeData,
      widgetSchema,
      config?.schemaModeMap,
    );
    // dayjs().format("YYYYMMDDHHmmss")
    if (!isEmpty(reactflow) && flowId) {
      release({
        flow_id: flowId,
        reactflow,
        workflow,
        config,
        version_name: versionName,
        metadata,
      });
      publishPopoverActions.setFalse();
    }
  }, [
    flowId,
    flowInstance,
    nodeData,
    widgetSchema,
    config,
    versionName,
    metadata,
  ]);

  const { run: runEditWorkflow } = useRequest(editItem, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success('Name Saved', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onOpenChange = (open: boolean) => {
    if (open && flowId && !versionData?.data) {
      getVersionList({
        flow_id: flowId,
      });
    }
  };

  const handleRestore = () => {
    const reactflow = flowInstance?.toObject() as IFlow;
    const workflow = genWorkflow(
      reactflow,
      nodeData,
      widgetSchema,
      config?.schemaModeMap,
    );
    if (!isEmpty(reactflow) && flowId) {
      restoreWorkflow({
        flow_id: flowId,
        reactflow,
        workflow,
        config,
      });
    }
  };

  return (
    <div className="w-full h-full relative flex items-center justify-between p-3 border-b border-default font-medium">
      <div className="flex items-center gap-x-1">
        <Link href="/workflow">
          <IconButton
            icon={ArrowLeftIcon}
            color="brand"
            variant="ghost"
            size="md"
          />
        </Link>
        <Heading size="h4" className="flex items-center gap-1">
          {editing ? (
            <Input
              size="xs"
              value={metadata?.name}
              rounded="lg"
              onChange={e => {
                updateMetadata({
                  metadata: {
                    name: e.target.value,
                  },
                });
              }}
              onBlur={() => {
                setEditing(false);
                runEditWorkflow({
                  id: params.get('id') as string,
                  type: 'workflow',
                  ...metadata,
                });
              }}
            />
          ) : (
            <>
              <Text size="lg" weight="medium" className="max-w-64 truncate">
                {metadata?.name}
              </Text>
              {hiddenOperation ? null : (
                <IconButton
                  onClick={() => setEditing(true)}
                  icon={PencilSquareIcon}
                  color="gray"
                  variant="ghost"
                  size="sm"
                />
              )}
            </>
          )}
        </Heading>
      </div>
      <div className="inline-flex items-center justify-center flex-[0_0_auto]">
        <Button
          disabled={loading.getProConfig || loading.getReactFlow}
          loading={loading.workflowRunning}
          onClick={() => setRunSheetOpen(true)}
          className="w-28 px-8 border border-default shadow-button-primary1 ml-3"
          size="md"
          icon={PlayIcon}
          variant="outline">
          Run
        </Button>
        {hiddenOperation ? (
          <Button
            disabled={loading.getProConfig || loading.getReactFlow}
            loading={restoreLoading}
            onClick={handleRestore}
            className="w-28 px-8 ml-3"
            size="md"
            icon={ArrowUturnLeftIcon}>
            Restore
          </Button>
        ) : (
          <>
            <Popover
              openChangeCallback={onOpenChange}
              className="w-96"
              open={showPublishPopover}
              asChild
              content={
                <div>
                  <div className="flex flex-col gap-3">
                    <Heading size="h4">Save As</Heading>
                    <Input
                      placeholder="please enter version name"
                      value={versionName}
                      size="xs"
                      className="col-span-3"
                      onChange={e => setVersionName(e.target.value)}
                    />
                    <Button
                      onClick={handleRelease}
                      size="md"
                      className="w-full"
                      loading={releaseLoading}>
                      Submit
                    </Button>
                  </div>
                  <Separator className="my-3" />
                  <Heading size="h4">History Versions</Heading>
                  <ScrollArea
                    className={cn(
                      'w-full',
                      Array.isArray(versionData?.data) &&
                        versionData?.data?.length > 3
                        ? 'h-80'
                        : 'h-52',
                    )}>
                    {getVersionLoading ? (
                      <VersionSkeleton />
                    ) : (
                      versionData?.data?.map(item => {
                        if (item.version_name === 'latest') {
                          return (
                            <div className="p-1.5 rounded-md hover:bg-surface-hovered cursor-not-allowed">
                              <Text color="subtle" className="block w-full">
                                {`${item.version_name}(current)`}
                              </Text>
                            </div>
                          );
                        }
                        return (
                          <Link
                            className="flex justify-between items-center w-full p-1.5 rounded-md hover:bg-surface-hovered group/menu"
                            href={`${window.location.pathname}?id=${flowId}&version=${item.version_name}`}
                            prefetch={false}>
                            <div className="flex flex-col">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Text
                                      color="subtle"
                                      className="w-60 truncate">
                                      {item.version_name}
                                    </Text>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {item.version_name}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Text size="sm" color="subtlest">
                                Saved {dayjs(item.create_time * 1000).fromNow()}
                              </Text>
                            </div>
                            <ArrowUpRightIcon className="w-4.5 h-4.5 hidden group-hover/menu:flex" />
                          </Link>
                        );
                      })
                    )}
                    {!getVersionLoading && isEmpty(versionData?.data) ? (
                      <Text>No Data</Text>
                    ) : null}
                  </ScrollArea>
                </div>
              }>
              <Button
                disabled={loading.getProConfig || loading.getReactFlow}
                size="md"
                loading={releaseLoading}
                icon={ChevronDownIcon}
                className="w-28 px-8 mx-3"
                onClick={() => publishPopoverActions.setTrue()}>
                Save
              </Button>
            </Popover>
            <ExtraActions />
          </>
        )}
      </div>
      <div className="absolute right-3 top-16 z-10 w-full text-right">
        {version ? (
          <Text size="sm" color="subtlest">
            Current preview version: {version}
          </Text>
        ) : null}
      </div>
    </div>
  );
};
