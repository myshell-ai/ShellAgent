'use client';

import { sharedTheme } from '@shellagent/ui';
import { ConfigProvider } from 'antd';
import { Provider } from 'inversify-react';
import React, { PropsWithChildren, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

import { container } from '@/app/container';
import { SWRWrapper } from '@/components/common/swr';
import { GlobalStoreProvider } from '@/stores/global/global-provider';

import SideBar from './side-bar';
import { Download } from '../download';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <ToastContainer />
      <Provider container={container}>
        <ConfigProvider theme={sharedTheme}>
          <SWRWrapper>
            <GlobalStoreProvider>
              <div className="h-screen flex bg-surface-default">
                <SideBar />
                <main className="h-full w-full">{children}</main>
                <Download />
              </div>
            </GlobalStoreProvider>
          </SWRWrapper>
        </ConfigProvider>
      </Provider>
    </Suspense>
  );
}
