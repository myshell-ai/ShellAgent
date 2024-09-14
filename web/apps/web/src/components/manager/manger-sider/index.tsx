'use client';

import { Heading, Tabs, TabsList, TabsTrigger } from '@shellagent/ui';

import {
  useGlobalStore,
  ManagerTypeEnum,
} from '@/stores/global/global-provider';

export const ManagerSideBar = () => {
  const { managerType, setManagerType } = useGlobalStore(state => ({
    managerType: state.managerType,
    setManagerType: state.setManagerType,
  }));

  return (
    <div className="flex flex-col px-3 py-4 w-40 border-r">
      <Heading size="h3" className="mb-3">
        Manager
      </Heading>
      <Tabs
        orientation="vertical"
        defaultValue="widgets"
        value={managerType}
        onValueChange={value => setManagerType(value as ManagerTypeEnum)}
        className="w-full h-full p-0">
        <TabsList className="flex flex-col h-full items-start justify-start p-0 gap-y-1.5">
          <TabsTrigger
            value="widget"
            className="w-full justify-start text-subtler rounded-md border-b-0 mx-0 px-2 py-1 data-[state=active]:bg-surface-accent-blue-subtler">
            Widgets
          </TabsTrigger>
          <TabsTrigger
            value="model"
            className="w-full justify-start text-subtler rounded-md border-b-0 mx-0 px-2 py-1 data-[state=active]:bg-surface-accent-blue-subtler">
            Models
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
