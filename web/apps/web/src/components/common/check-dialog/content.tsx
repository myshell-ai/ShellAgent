/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shellagent/ui';

import {
  BaseTypeEnum,
  ManagerTypeEnum,
  useGlobalStore,
} from '@/stores/global/global-provider';

export const CheckerContent = () => {
  const { setBaseType, managerType } = useGlobalStore(state => ({
    setBaseType: state.setBaseType,
    managerType: state.managerType,
  }));

  return (
    <Tabs
      css={css`
        overflow: hidden;
        .css_tabslist {
          border-top-right-radius: 24px;
        }
      `}
      defaultValue="marketplace"
      className="w-full"
      onValueChange={value => setBaseType(value as BaseTypeEnum)}>
      <TabsList className="css_tabslist bg-surface-container-default h-12 px-4 pt-4 !pb-0 border-b flex w-full justify-start items-end rounded-none">
        <TabsTrigger
          value={BaseTypeEnum.marketplace}
          className="w-fit text-subtler rounded-none text-base">
          Custom Node
        </TabsTrigger>
        <TabsTrigger
          value={BaseTypeEnum.installed}
          className="w-fit text-subtler rounded-none text-base">
          Models
        </TabsTrigger>
      </TabsList>
      <TabsContent value={BaseTypeEnum.marketplace}></TabsContent>
      <TabsContent value={BaseTypeEnum.installed}></TabsContent>
    </Tabs>
  );
};
