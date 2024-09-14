import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Drawer,
  IconButton,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { DownloadModel } from '@/components/download/download.model';

import { Completed } from './completed';
import { Downloading } from './downloading';

export const Download = observer(() => {
  const model = useInjection(DownloadModel);
  return (
    <div className="fixed right-6 bottom-8">
      <IconButton
        icon={ArrowDownTrayIcon}
        variant="outline"
        className="w-9 h-9 text-brand bg-white"
        style={{
          boxShadow: '0px 1px 0px 0px rgba(0, 0, 0, 0.05)',
        }}
        color="default"
        size="md"
        onClick={model.drawer.open}
        autoFocus={false}
      />
      <Drawer
        // placement="top"
        width={380}
        style={{
          width: '380px',
          height: '90vh',
        }}
        className="rounded-lg fixed right-6 bottom-[72px]"
        headerClassName="!p-0 bg-surface-container-default"
        contentClassName="!p-0"
        onClose={model.drawer.close}
        getContainer="body"
        maskClosable
        open={model.drawer.isOpen}>
        <Tabs
          defaultValue={model.tab}
          className="w-full bg-surface-container-default px-1 pt-2 relative"
          onValueChange={val => model.setTab(val as any)}>
          <TabsList className="rounded-none border-b">
            <TabsTrigger
              value="downloading"
              className="w-fit text-subtler rounded-none text-base">
              Downloading
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="w-fit text-subtler rounded-none text-base">
              Completed
            </TabsTrigger>
          </TabsList>
          <XMarkIcon
            className="w-4.5 h-4.5 absolute right-4 top-4 cursor-pointer"
            onClick={model.drawer.close}
          />
        </Tabs>
        <div className="p-3">
          {model.tab === 'downloading' ? <Downloading /> : <Completed />}
        </div>
      </Drawer>
    </div>
  );
});
