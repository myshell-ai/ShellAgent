import {
  ChevronDownIcon,
  ArrowUpRightIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { IFlow, ReactFlowInstance } from '@shellagent/flow-engine';
import {
  Button,
  Heading,
  Input,
  Text,
  Popover,
  Separator,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ScrollArea,
} from '@shellagent/ui';
import { useRequest, useBoolean } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash-es';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { AppState } from '@/stores/app/app-store';
import { saveApp, releaseApp, fetchAppVersionList } from '@/services/app';
import { genAutomata } from '@/stores/app/utils/data-transformer';
import { cn } from '@/utils/cn';

import VersionSkeleton from '../skeleton';

interface PublishProps {
  app_id: string;
  version: string;
  loading: boolean;
  config: AppState['config'];
  nodeData: AppState['nodeData'];
  flowInstance: AppState['flowInstance'];
}

export default function Publish({
  app_id,
  version,
  loading,
  config,
  nodeData,
  flowInstance,
}: PublishProps) {
  const router = useRouter();
  const [autoSavedTime, setAutoSavedTime] = useState('');
  const [versionName, setVersionName] = useState('');
  const [showPublishPopover, publishPopoverActions] = useBoolean(false);
  const hiddenOperation = !!version;

  const {
    run: getVersionList,
    data: versionData,
    loading: getVersionLoading,
  } = useRequest(fetchAppVersionList, {
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

  const { run: release, loading: releaseLoading } = useRequest(releaseApp, {
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
        getVersionList({ app_id });
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
  });

  const { run: restoreApp, loading: restoreLoading } = useRequest(saveApp, {
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
        router.push(`/app/detail?id=${app_id}`);
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
  });

  const handleRelease = useCallback(async () => {
    const reactflow = flowInstance?.toObject() as IFlow;
    if (!isEmpty(reactflow)) {
      release({
        app_id,
        reactflow,
        automata: genAutomata(reactflow, nodeData),
        config,
        version_name: versionName,
      });
    }
    publishPopoverActions.setFalse();
  }, [flowInstance, nodeData, config, app_id, versionName]);

  const handleRestore = () => {
    const reactflow = flowInstance?.toObject() as IFlow;
    if (!isEmpty(reactflow) && app_id) {
      restoreApp({
        app_id,
        reactflow,
        automata: genAutomata(reactflow, nodeData),
        config,
      });
    }
  };

  const onOpenChange = (open: boolean) => {
    if (open && app_id && !versionData?.data) {
      getVersionList({
        app_id,
      });
    }
  };

  return (
    <div>
      {hiddenOperation ? (
        <Button
          disabled={loading}
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
                        className="flex justify-between items-center p-1.5 rounded-md hover:bg-surface-hovered group/menu"
                        href={`${window.location.pathname}?id=${app_id}&version=${item.version_name}`}
                        prefetch={false}>
                        <div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Text
                                  color="subtle"
                                  className="block w-64 truncate">
                                  {item.version_name}
                                </Text>
                              </TooltipTrigger>
                              <TooltipContent>
                                {item.version_name}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Text size="sm" color="subtlest">
                            Published {dayjs(item.create_time * 1000).fromNow()}
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
            disabled={loading}
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
  );
}
