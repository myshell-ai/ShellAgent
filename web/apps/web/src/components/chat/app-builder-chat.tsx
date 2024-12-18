import { ChakraProvider } from '@chakra-ui/react';
import { ChatNew, en } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import {
  ChatStoreProvider,
  GlobalStoreProvider,
  UserStoreProvider,
} from 'myshell-bundled-chat';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { AppBuilderChatModel } from './app-builder-chat.model';

export const AppBuilderChat = () => {
  const model = useInjection(AppBuilderChatModel);
  const traceId = uuidv4();
  return (
    <ChakraProvider>
      <NextIntlClientProvider locale="zh" messages={en}>
        <GlobalStoreProvider
          nonce="ZmEyZjU3NzktNTQ0NS00Y2YxLTgxMjctODMyM2JlNTVjZDEx"
          isMobile={false}
          traceId={traceId}>
          <UserStoreProvider user={model.chatNew.user} isLogin language="en">
            <ChatStoreProvider>
              <ChatNew model={model.chatNew} />
            </ChatStoreProvider>
          </UserStoreProvider>
        </GlobalStoreProvider>
      </NextIntlClientProvider>
    </ChakraProvider>
  );
};
