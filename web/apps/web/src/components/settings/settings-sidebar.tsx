/** @jsxImportSource @emotion/react */

'use client';

import { css } from '@emotion/react';
import { Heading, Tabs, TabsList, TabsTrigger } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';

import { SettingsModel, SidebarValue } from './settings.model';
import { Badge } from 'antd';

export const SettingsSideBar = observer(() => {
  const model = useInjection(SettingsModel);
  const isDisableUpdate =
    process.env.NEXT_PUBLIC_DISABLE_SOFTWARE_UPDATE === 'yes';

  return (
    <div
      className="flex flex-col px-3 py-4 w-40 border-r bg-surface-container-default"
      css={css`
        border-top-left-radius: 24px;
        border-bottom-left-radius: 24px;
      `}>
      <Heading size="h3" className="mb-3">
        Settings
      </Heading>
      <Tabs
        orientation="vertical"
        defaultValue="widgets"
        value={model.sidebar}
        onValueChange={value => model.setSidebar(value as SidebarValue)}
        className="w-full h-full p-0">
        <TabsList className="flex flex-col h-full items-start justify-start p-0 gap-y-1.5">
          {isDisableUpdate ? null : (
            <Badge dot={model.checkRet.has_new_stable}>
              <TabsTrigger
                value="SoftwareUpdate"
                className="w-full justify-start text-subtler rounded-md border-b-0 mx-0 px-2 py-1 data-[state=active]:bg-surface-accent-blue-subtler">
                {model.checkRet.has_new_stable
                  ? 'Software Update'
                  : 'Software Update'}
              </TabsTrigger>
            </Badge>
          )}
          <TabsTrigger
            value="Environment"
            className="w-full justify-start text-subtler rounded-md border-b-0 mx-0 px-2 py-1 data-[state=active]:bg-surface-accent-blue-subtler">
            Environment
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
});
