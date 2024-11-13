import 'myshell-bundled-chat/styles.css';

import type { Meta, StoryObj } from '@storybook/react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo } from 'react';

import {
  MessageContext,
  MessageContextProps,
  useMessageParams,
  useChatLayout,
  MessageToDisplayParser,
  ChatModule,
  StaticContext,
  useAtBottom,
  useEditorMode,
  useVirtuosoMessageListApi,
  Message,
  GlobalStoreProvider,
  UserStoreProvider,
  User,
  FollowStatus,
  LoginType,
  UserSourceEnum,
  ChatStoreProvider,
  StaticContextProps,
} from 'myshell-bundled-chat';
import messages from '../messages/en.json';
import historyMessage from './__stories_data__/historyMessage.json';
import clearMemoryMessage from './__stories_data__/clearMemoryMessage.json';
import greetingMessage from './__stories_data__/greetingMessage.json';
import replaceMessage from './__stories_data__/replaceMessage.json';
import updateReplyMessage from './__stories_data__/updateReplyMessage.json';
import updateReplyMessageError from './__stories_data__/updateReplyMessageError.json';
import updateReplyMessageLUIForm from './__stories_data__/updateReplyMessageLUIForm.json';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
const theme = extendTheme({});

const user = {
  avatar: 'default_avatars/Group10.png',
  email: 'shane.hsi.rocks@gmail.com',
  id: '3524834',
  isGenesisPasscard: false,
  isNftAvatar: false,
  isPasscard: false,
  level: 1,
  name: 'Shane Hsi',
  nameTag: '#8636',
  createdDate: '2024-08-14T15:06:59+08:00',
  createdTime: '2024-08-14 15:06:59.008',
  publicAddress: '0x4265e151bB25E7Af9237286eD286c8f39565B410',
  source: 'privy' as UserSourceEnum,
  hasParticleAccount: false,
  privateBotLimit: 30,
  publicBotLimit: 0,
  premiumInfo: {
    level: 0,
    totalExp: 0,
    nextLevelNeedExp: 5,
    currentLevelExp: 0,
  },
  canPublishNewBot: false,
  connectInfo: null as any,
  followedCount: 0 as any,
  fansCount: 0 as any,
  followStatus: 'NOT_AVAILABLE' as FollowStatus,
  description: '',
  backgroundUrl: '',
  loginCredential: 'shane.hsi.rocks@gmail.com',
  loginType: 'LOGIN_TYPE_EMAIL' as LoginType,
} as User;

const meta = {
  title: 'Components/Chat/ChatModule',
  component: ChatModule,
  decorators: [
    Story => (
      <ChakraProvider theme={theme}>
        <NextIntlClientProvider
          locale="zh"
          messages={messages as unknown as AbstractIntlMessages}>
          <GlobalStoreProvider
            nonce="ZmEyZjU3NzktNTQ0NS00Y2YxLTgxMjctODMyM2JlNTVjZDEx"
            isMobile={false}>
            <UserStoreProvider user={user} isLogin={true} language={'en'}>
              <ChatStoreProvider>
                <Story />
              </ChatStoreProvider>
            </UserStoreProvider>
          </GlobalStoreProvider>
        </NextIntlClientProvider>
      </ChakraProvider>
    ),
  ],
} satisfies Meta<typeof ChatModule>;

export default meta;
type Story = StoryObj<typeof meta>;

const botId = '1719284610';

export const Primary: Story = {
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    editorAnchorRef: { current: null },
    editorContainerRef: { current: null },
    textareaRef: { current: null },
    virtuosoRef: { current: null },
  },
  render: args => {
    const {
      scrollContainerRef,
      editorAnchorRef,
      editorContainerRef,
      textareaRef,
      detailContainerRef,
      scrollLayoutToTop,
      manuallyScrollDetailToTop,
      isEditorSticky,
    } = useChatLayout();

    // virtuoso api 相关
    const {
      virtuosoRef,
      onSendMessage,
      onAppendMessages,
      onUpdateMessage,
      onPartialUpdateMessage,
      onTextStream,
      onAudioStream,
      onTranslationStream,
      onPrependMessages,
      onDeleteMessage,
      onRemoveDraftReplyIfExist,
      onVirtuosoRegen,
      onPartialUpdateRegenMessage,
      onMixMessages,
    } = useVirtuosoMessageListApi();

    const { atBottom, setAtBottom } = useAtBottom();

    const staticContextProps: StaticContextProps = {
      type: 'bot',
      entityInfo: {
        id: '1719284610',
        name: '',
      },
      entitySetting: {},
      chatSettingDisabled: false,
      chatSettingLoading: false,
      interactionDisabled: false,
      showInteractionCostEnergy: false,
      menuDisabled: false,
      menuFunctions: [
        // {
        //   menuFunction: 0
        // },
        // {
        //   menuFunction: 1
        // },
        {
          menuFunction: 2,
        },
        // {
        //   menuFunction: 3
        // }
      ],
      customMenuFunction: [],
      getList: async () => {
        return [];
      },
      atBottom,
      setAtBottom,
      globalContextMenuDisabled: true,
    };
    // 通用的 message 参数 & actions
    const {
      messageList,
      lastUserInteractionMsgId,
      draftMessage,
      lastMessageInfo,
      sending,
      interacting,
      scrollToBottom,
      exceptionsForTextDisplay,
      addTextDisplayException,
      setDraftMessage,
      sendTextMessage,
      sendAudioMessage,
      replaceDraftMessage,
      onMessageReply,
      mixMessages,
      appendMessages,
      updateMessage,
      addTextStream,
      addAudioStream,
      addTranslationStream,
      deleteSpecifiedMessageId,
      partialUpdateMsg,
      audioQueue,
      sendButtonInteractionMessage,
    } = useMessageParams({
      type: 'bot',
      id: botId,
      entityId: botId,
      showMockReply: true,
      virtuosoMessageApi: {
        onSendMessage,
        onAppendMessages,
        onUpdateMessage,
        onPartialUpdateMessage,
        onTextStream,
        onAudioStream,
        onTranslationStream,
        onPrependMessages,
        onDeleteMessage,
        onRemoveDraftReplyIfExist,
        onVirtuosoRegen,
        onPartialUpdateRegenMessage,
        onMixMessages,
      },
    });
    const userId = '3524834';
    const memberInfoMap = new Map();
    memberInfoMap.set('entity-undefined', {
      isEntity: false,
    });
    memberInfoMap.set('entity-1719284610', {
      id: '1719284610',
      isEntity: true,
    });

    useEffect(() => {
      // appendMessages(historyMessage.map(message => anyTypeMessageParser(message as any, 'bot')));
    }, []);

    const messageToDisplay = useCallback(
      (message: Message) => {
        return MessageToDisplayParser(message, userId, memberInfoMap);
      },
      [memberInfoMap, userId],
    );

    const { editorMode, setEditorMode, inputMode, setInputMode } =
      useEditorMode();

    const getInputProps: () => any = () => {
      return {
        accept:
          'application/rtf,.rtf,text/markdown,.md,.markdown,application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,application/msword,.doc,text/plain,.txt,text/csv,.csv',
        multiple: true,
        style: {
          display: 'none',
        },
        tabIndex: -1,
        type: 'file',
      };
    };

    const messageContextParams: MessageContextProps = useMemo(
      () => ({
        playingAudio: audioQueue.playingAudio,
        playNext: audioQueue.playNext,
        enQueue: audioQueue.enQueue,
        clearQueue: audioQueue.clearQueue,
        messageList,
        messageToDisplay,
        exceptionsForTextDisplay,
        addTextDisplayException,
        lastUserInteractionMsgId,
        draftMessage,
        sending,
        interacting,
        scrollToBottom,
        setDraftMessage,
        sendTextMessage,
        sendAudioMessage: (audioBlob: Blob, mimeType?: string | undefined) => {
          return Promise.resolve();
        },
        terminate: () => {},
        hasMore: false,
        gettingHistory: false,
        initializingHistory: false,
        messageInited: true,
        getHistoryMessage: async () => {
          return [];
        },
        mixMessages,
        appendMessages,
        updateMessage,
        deleteSpecifiedMessageId,
        partialUpdateMessage: partialUpdateMsg,
        translationStatus: 'TRANSLATING',
        translate: async () => {},
        dragMaskVisible: false,
        editorMode,
        setEditorMode,
        inputMode,
        setInputMode,
        getInputProps,
        clearMemory: async () => {
          console.log('Memory cleared!');
          appendMessages(clearMemoryMessage as unknown as Message, true);
          appendMessages(greetingMessage as unknown as Message, true);
        },
        sendButtonInteractionMessage: async (...args) => {
          sendButtonInteractionMessage(...args);
          setTimeout(() => {
            onMessageReply(updateReplyMessageError as any);
            // onMessageReply(updateReplyMessageLUIForm as any);
            // onMessageReply(updateReplyMessage as any);
          }, 1500);
        },
      }),
      [
        audioQueue.playingAudio,
        audioQueue.playNext,
        audioQueue.enQueue,
        audioQueue.clearQueue,
        messageList,
        messageToDisplay,
        exceptionsForTextDisplay,
        addTextDisplayException,
        lastUserInteractionMsgId,
        draftMessage,
        sending,
        interacting,
        scrollToBottom,
        setDraftMessage,
        sendTextMessage,
        mixMessages,
        appendMessages,
        updateMessage,
        deleteSpecifiedMessageId,
        partialUpdateMsg,
        editorMode,
        setEditorMode,
        inputMode,
        setInputMode,
      ],
    );

    return (
      <StaticContext.Provider value={staticContextProps}>
        <div className="w-full h-full overflow-hidden relative">
          <div
            className="w-full h-full overflow-auto bg-surface-container-default no-scrollbar scroll-smooth"
            ref={scrollContainerRef}>
            <div className="chat-module-container h-[calc(100%)]">
              <MessageContext.Provider value={messageContextParams}>
                <ChatModule
                  editorContainerRef={editorContainerRef}
                  editorAnchorRef={editorAnchorRef}
                  textareaRef={textareaRef}
                  virtuosoRef={virtuosoRef}
                  scrollLayoutToTop={scrollLayoutToTop}
                  topActionsSlot={undefined}
                  bgUrl={undefined}
                />
              </MessageContext.Provider>
            </div>
          </div>
        </div>
      </StaticContext.Provider>
    );
  },
};
