import {
  PencilSquareIcon,
  ArrowLeftIcon,
  PlayIcon,
  ChevronDownIcon,
  ArrowUpRightIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { IFlow } from '@shellagent/flow-engine';
import { Workflow } from '@shellagent/pro-config';
import {
  Button,
  Heading,
  IconButton,
  Text,
  Input,
  ImportIcon,
  Popover,
  Separator,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ScrollArea,
} from '@shellagent/ui';
import { useBoolean, useDebounce, useRequest, useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash-es';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { editItem } from '@/services/home';
import {
  saveWorkflow,
  runWorkflow,
  releaseWorkflow,
  fetchWorkflowVersionList,
} from '@/services/workflow';
import { useWorkflowState } from '@/stores/workflow/use-workflow-state';
import { genWorkflow } from '@/stores/workflow/utils/data-transformer';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { cn } from '@/utils/cn';
import { deleteKey } from '@/utils/common-helper';

import VersionSkeleton from './skeleton';

const RunSheet = dynamic(() => import('@/components/workflow/run-sheet'), {
  ssr: false,
});

const ImportModal = dynamic(
  () => import('@/components/workflow/import-modal'),
  {
    ssr: false,
  },
);

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export const Header: React.FC<{ container: HTMLElement | null }> = ({
  container,
}) => {
  const params = useSearchParams();
  const router = useRouter();
  const flowId = params.get('id');
  const version = params.get('version');
  const [autoSavedTime, setAutoSavedTime] = useState('');
  const [versionName, setVersionName] = useState('');
  const [showPublishPopover, publishPopoverActions] = useBoolean(false);
  const hiddenOperation = !!version;

  const {
    config,
    metadata,
    userInputs,
    nodeData,
    onWorkflowMessage,
    clearRuntimeData,
    importWorkflow,
    setRunLoading,
    flowInstance,
    loading,
    updateMetadata,
    widgetSchema,
  } = useWorkflowStore(
    useShallow(state => ({
      config: state.config,
      metadata: state.metadata,
      userInputs: state.userInputs,
      nodeData: state.nodeData,
      onWorkflowMessage: state.onWorkflowMessage,
      clearRuntimeData: state.clearRuntimeData,
      importWorkflow: state.importWorkflow,
      setRunLoading: state.setRunLoading,
      flowInstance: state.flowInstance,
      loading: state.loading,
      updateMetadata: state.updateMetadata,
      widgetSchema: state.widgetSchema,
    })),
  );

  const {
    editing,
    setEditing,
    runSheetOpen,
    setRunSheetOpen,
    importDialogOpen,
    setImportDialogOpen,
  } = useWorkflowState(state => state);

  const values = useMemo(() => {
    return {
      flowId,
      config,
      nodeData,
      widgetSchema,
      flowInstance,
    };
  }, [flowId, nodeData, widgetSchema, config, flowInstance]);

  const debouncedValues = useDebounce(values, {
    wait: 3000,
  });

  const {
    run: getVersionList,
    data: versionData,
    loading: getVersionLoading,
  } = useRequest(fetchWorkflowVersionList, {
    manual: true,
    onError: error => {
      toast.error(error.message, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    },
  });

  const { run: saveData } = useRequest(saveWorkflow, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        setAutoSavedTime(dayjs().valueOf());
      }
    },
    onError: () => {
      toast.error('AutoSave Error', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    },
  });

  const { run: release, loading: releaseLoading } = useRequest(
    releaseWorkflow,
    {
      manual: true,
      onSuccess: result => {
        if (result.success) {
          toast.success('publish success', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
          getVersionList({ flow_id: flowId! });
          setVersionName('');
        } else {
          toast.error('publish error', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        }
      },
      onError: () => {
        toast.error('publish error', {
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
          toast.success('restore success', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
          router.push(`/workflow/detail?id=${flowId}`);
        } else {
          toast.error('restore error', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        }
      },
      onError: () => {
        toast.error('restore error', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      },
    },
  );

  // 保存
  const handleAutoSave = useCallback(async () => {
    // 删除运行时状态
    const reactflow = deleteKey(
      flowInstance?.toObject() as IFlow,
      'runtime_data',
    );
    const workflow = genWorkflow(
      reactflow,
      nodeData,
      widgetSchema,
      config?.schemaModeMap,
    );

    if (!isEmpty(reactflow) && flowId) {
      saveData({
        flow_id: flowId,
        reactflow,
        workflow,
        config,
      });
    }
  }, [flowId, flowInstance, nodeData, widgetSchema, config]);

  const handleRelease = useCallback(async () => {
    const reactflow = deleteKey(
      flowInstance?.toObject() as IFlow,
      'runtime_data',
    );
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

  const handleWorkflowRun = useCallback(() => {
    const reactflow = flowInstance?.toObject() as IFlow;
    const workflow = genWorkflow(
      reactflow,
      nodeData,
      widgetSchema,
      config?.schemaModeMap,
    );

    clearRuntimeData();
    setRunSheetOpen(false);
    setRunLoading(true);
    runWorkflow(
      { workflow, user_input: userInputs },
      {
        onMessage: onWorkflowMessage,
      },
    );
  }, [userInputs, flowInstance, nodeData, config?.schemaModeMap, widgetSchema]);

  const handleImportWorkflow = useCallback<(workflow: Workflow) => void>(
    workflow => {
      importWorkflow({ workflow });
      setImportDialogOpen(false);
    },
    [importWorkflow],
  );

  useUpdateEffect(() => {
    if (!version && !loading.getProConfig && !loading.getReactFlow) {
      handleAutoSave();
    }
  }, [debouncedValues]);

  const { run: runEditWorkflow } = useRequest(editItem, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success('Name saved', {
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
    const reactflow = deleteKey(
      flowInstance?.toObject() as IFlow,
      'runtime_data',
    );
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
    <>
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
                <Text size="lg" weight="medium">
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
          {hiddenOperation ? null : (
            <Button
              onClick={() => setImportDialogOpen(true)}
              disabled={loading.workflowRunning}
              className="w-28 px-8 border border-default shadow-button-basic"
              size="md"
              icon={ImportIcon}
              variant="outline">
              Import
            </Button>
          )}
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
            <Popover
              openChangeCallback={onOpenChange}
              className="w-96"
              open={showPublishPopover}
              asChild
              content={
                <div>
                  <div className="flex flex-col gap-3">
                    <Heading size="h4">Publish Version</Heading>
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
                              {autoSavedTime && !version ? (
                                <Text size="sm" color="subtlest">
                                  Updated {dayjs(autoSavedTime).fromNow()}
                                </Text>
                              ) : null}
                            </div>
                          );
                        }
                        return (
                          <Link
                            className="flex justify-between items-center w-full p-1.5 rounded-md hover:bg-surface-hovered group/menu"
                            href={`${window.location.pathname}?id=${flowId}&version=${item.version_name}`}
                            prefetch={false}>
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Text
                                      color="subtle"
                                      className="line-clamp-1">
                                      {item.version_name}
                                    </Text>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {item.version_name}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Text size="sm" color="subtlest">
                                Published{' '}
                                {dayjs(item.create_time * 1000).fromNow()}
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
                className="w-28 px-8 ml-3"
                onClick={() => publishPopoverActions.setTrue()}>
                Publish
              </Button>
            </Popover>
          )}
        </div>
      </div>
      <RunSheet
        open={runSheetOpen}
        onOpenChange={setRunSheetOpen}
        container={container}
        onRun={handleWorkflowRun}
      />
      <ImportModal
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onConfirm={handleImportWorkflow}
      />
    </>
  );
};
