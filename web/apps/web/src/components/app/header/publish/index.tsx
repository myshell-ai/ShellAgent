import {
  ArrowUpRightIcon,
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { IFlow } from '@shellagent/flow-engine';
import {
  Button,
  Heading,
  Input,
  Text,
  Separator,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ScrollArea,
  SaveIcon,
} from '@shellagent/ui';
import { useRequest, useBoolean } from 'ahooks';
import { Dropdown } from 'antd';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash-es';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { saveApp, releaseApp, fetchAppVersionList } from '@/services/app';
import { GetAppVersionListResponse } from '@/services/app/type';
import { Metadata } from '@/services/home/type';
import { AppState } from '@/stores/app/app-store';
import { genAutomata } from '@/stores/app/utils/data-transformer';
import { cn } from '@/utils/cn';

import VersionSkeleton from '../skeleton';

interface PublishProps {
  app_id: string;
  version_name: string;
  loading: boolean;
  config: AppState['config'];
  nodeData: AppState['nodeData'];
  flowInstance: AppState['flowInstance'];
  metadata: Metadata;
}

const DropdownRender = ({
  versionData,
  getVersionLoading,
  app_id,
  versionName,
  setVersionName,
  handleRelease,
  releaseLoading,
  handleSave,
  saveLoading,
}: {
  versionData?: GetAppVersionListResponse;
  getVersionLoading: boolean;
  app_id: string;
  versionName: string;
  setVersionName: React.Dispatch<React.SetStateAction<string>>;
  handleRelease: () => Promise<void>;
  releaseLoading: boolean;
  handleSave: () => void;
  saveLoading: boolean;
}) => {
  return (
    <div className="w-80 text-xs mx-4 p-3 text-left rounded-lg border border-opaque shadow-modal-default outline-none data-[state=open]:animate-in [&[data-state=open]>span]:animate-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-surface-search-field text-subtle">
      <div className="flex flex-col gap-3">
        <Heading size="h4">Version</Heading>
        <Input
          placeholder="please enter version name"
          value={versionName}
          size="xs"
          className="col-span-3"
          onChange={e => setVersionName(e.target.value)}
        />
        {versionName ? (
          <Button
            onClick={handleRelease}
            size="md"
            className="w-full"
            loading={releaseLoading}>
            Save As
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            size="md"
            className="w-full"
            loading={saveLoading}>
            Save
          </Button>
        )}
      </div>
      <Separator className="my-3" />
      <Heading size="h4">History Versions</Heading>
      <ScrollArea
        className={cn(
          'w-full',
          Array.isArray(versionData?.data) && versionData?.data?.length > 3
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
                  {/* {autoSavedTime && !version_name ? (
                  <Text size="sm" color="subtlest">
                    Updated {dayjs(autoSavedTime).fromNow()}
                  </Text>
                ) : null} */}
                </div>
              );
            }
            return (
              <Link
                className="flex justify-between items-center p-1.5 rounded-md hover:bg-surface-hovered group/menu"
                href={`${window.location.pathname}?id=${app_id}&version_name=${item.version_name}`}
                prefetch={false}>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Text color="subtle" className="block w-64 truncate">
                          {item.version_name}
                        </Text>
                      </TooltipTrigger>
                      <TooltipContent>{item.version_name}</TooltipContent>
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
  );
};

export default function Publish({
  app_id,
  version_name,
  loading,
  config,
  nodeData,
  metadata,
  flowInstance,
}: PublishProps) {
  const router = useRouter();
  // const [autoSavedTime, setAutoSavedTime] = useState('');
  const [versionName, setVersionName] = useState('');
  const [showPublishPopover, publishPopoverActions] = useBoolean(false);
  const hiddenOperation = !!version_name;

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

  const { run: saveData, loading: saveLoading } = useRequest(saveApp, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success('App Saved', {
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

  const handleSave = useCallback(() => {
    const reactflow = flowInstance?.toObject() as IFlow;
    if (!isEmpty(reactflow)) {
      saveData({
        app_id,
        reactflow,
        automata: genAutomata(reactflow, nodeData),
        config,
      });
    }
  }, [flowInstance, nodeData, app_id, saveData, config]);

  const handleRelease = useCallback(async () => {
    const reactflow = flowInstance?.toObject() as IFlow;
    if (!isEmpty(reactflow)) {
      release({
        app_id,
        reactflow,
        automata: genAutomata(reactflow, nodeData),
        config,
        version_name: versionName,
        metadata,
      });
    }
    publishPopoverActions.setFalse();
  }, [flowInstance, nodeData, config, app_id, versionName, metadata]);

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
        <>
          <Link href={`${window.location.pathname}?id=${app_id}`}>
            <Button
              className="w-28 px-8 ml-3"
              size="md"
              color="default"
              icon={XMarkIcon}>
              Cancel
            </Button>
          </Link>
          <Button
            disabled={loading}
            loading={restoreLoading}
            onClick={handleRestore}
            className="w-28 px-8 ml-3"
            size="md"
            icon={ArrowUturnLeftIcon}>
            Restore
          </Button>
        </>
      ) : (
        <Dropdown.Button
          onOpenChange={onOpenChange}
          // eslint-disable-next-line react/no-unstable-nested-components
          dropdownRender={() => (
            <DropdownRender
              versionData={versionData}
              getVersionLoading={getVersionLoading}
              app_id={app_id}
              versionName={versionName}
              setVersionName={setVersionName}
              handleRelease={handleRelease}
              releaseLoading={releaseLoading}
              handleSave={handleSave}
              saveLoading={saveLoading}
            />
          )}
          buttonsRender={() => {
            return [
              <Button
                size="md"
                className="w-20 !rounded-r-none ml-3"
                loading={saveLoading}
                onClick={handleSave}
                icon={SaveIcon}>
                Save
              </Button>,
              <Button
                size="md"
                className="w-8 border-l border-surface-primary-hovered !rounded-l-none"
                icon={ChevronDownIcon}
              />,
            ];
          }}
        />
      )}
    </div>
  );
}
