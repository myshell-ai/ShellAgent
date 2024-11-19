import {
  ArrowUpRightIcon,
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
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
import { Dropdown } from 'antd';
import dayjs from 'dayjs';
import { useInjection } from 'inversify-react';
import { isEmpty } from 'lodash-es';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

import { GetAppVersionListResponse } from '@/services/app/type';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { cn } from '@/utils/cn';

import VersionSkeleton from '../skeleton';

interface PublishProps {
  app_id: string;
  version_name: string;
  loading: boolean;
}

// 抽取 DropdownRender 的 props 类型定义
interface DropdownRenderProps {
  versionData?: GetAppVersionListResponse;
  getVersionLoading: boolean;
  app_id: string;
  versionName: string;
  setVersionName: React.Dispatch<React.SetStateAction<string>>;
  handleRelease: () => Promise<void>;
  releaseLoading: boolean;
  handleSave: () => void;
  saveLoading: boolean;
}

// 抽取版本项组件
const VersionItem = ({ item, app_id }: { item: any; app_id: string }) => {
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
};

// 优 DropdownRender 组件
const DropdownRender: React.FC<DropdownRenderProps> = ({
  versionData,
  getVersionLoading,
  app_id,
  versionName,
  setVersionName,
  handleRelease,
  releaseLoading,
  handleSave,
  saveLoading,
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
          versionData?.data?.map(item => (
            <VersionItem key={item.version_name} item={item} app_id={app_id} />
          ))
        )}
        {!getVersionLoading && isEmpty(versionData?.data) && (
          <Text>No Data</Text>
        )}
      </ScrollArea>
    </div>
  );
};

// 新增按钮组件
const SaveButton = ({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) => (
  <Button
    size="md"
    className="w-20 !rounded-r-none ml-3"
    loading={loading}
    onClick={onClick}
    icon={SaveIcon}>
    Save
  </Button>
);

const DropdownButton = () => (
  <Button
    size="md"
    className="w-8 border-l border-surface-primary-hovered !rounded-l-none"
    icon={ChevronDownIcon}
  />
);

// 主组件使用 React.memo 优化性能
const Publish = React.memo(
  ({ app_id, version_name, loading }: PublishProps) => {
    const [versionName, setVersionName] = useState('');
    const hiddenOperation = !!version_name;
    const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

    const handleSave = useCallback(() => {
      appBuilder.saveApp(app_id);
    }, [app_id]);

    const handleRelease = useCallback(async () => {
      appBuilder.releaseApp(app_id);
    }, [app_id]);

    const handleRestore = useCallback(() => {
      appBuilder.restoreApp(app_id);
    }, [app_id]);

    const onOpenChange = useCallback(
      (open: boolean) => {
        if (open && app_id && !appBuilder.versionData?.data) {
          appBuilder.getVersionList(app_id);
        }
      },
      [app_id, appBuilder.versionData?.data],
    );

    const dropdownRender = useCallback(
      () => (
        <DropdownRender
          versionData={appBuilder.versionData}
          getVersionLoading={appBuilder.getVersionLoading}
          app_id={app_id}
          versionName={versionName}
          setVersionName={setVersionName}
          handleRelease={handleRelease}
          releaseLoading={appBuilder.releaseLoading}
          handleSave={handleSave}
          saveLoading={appBuilder.saveLoading}
        />
      ),
      [
        appBuilder.versionData,
        appBuilder.getVersionLoading,
        app_id,
        versionName,
        setVersionName,
        handleRelease,
        appBuilder.releaseLoading,
        handleSave,
        appBuilder.saveLoading,
      ],
    );

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
              loading={appBuilder.restoreLoading}
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
            dropdownRender={dropdownRender}
            buttonsRender={() => [
              <SaveButton
                key="save"
                loading={appBuilder.saveLoading}
                onClick={handleSave}
              />,
              <DropdownButton key="dropdown" />,
            ]}
          />
        )}
      </div>
    );
  },
);

export default Publish;
