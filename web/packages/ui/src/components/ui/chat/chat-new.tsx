/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import {
  ChatModule,
  MenuFunctionEnum,
  MessageContext,
  MessageContextProps,
  MessageToDisplayParser,
  StaticContext,
  StaticContextProps,
  useMessageParams,
} from '@shellagent/chat-engine';
import '@shellagent/chat-engine/styles.css';
import { useCallback, useEffect, useMemo } from 'react';

import { ChatNewProps } from './interfaces/chatNewProps';
import useRoomLayout from './useRoomLayout';
import { observer } from 'mobx-react-lite';

export const ChatNew = observer<ChatNewProps>(
  ({ model, messageToDisplayParserPost, customMenuIconSlot }) => {
    const {
      scrollContainerRef,
      editorAnchorRef,
      editorContainerRef,
      textareaRef,
      detailContainerRef,
      scrollLayoutToTop,
      manuallyScrollDetailToTop,
      isEditorSticky,
    } = useRoomLayout();

    // todo: 先用了一个最小可用配置 后续涉及 menu/disabled 再扩展
    const staticContextProps: StaticContextProps = useMemo(() => {
      return {
        type: 'room',
        entityInfo: model.testEntity,
        chatSettingDisabled: true,
        interactionDisabled: false,
        imAudioDisabled: model.imAudioDisabled,
        imTextDisabled: model.imTextDisabled,
        disabledReason: undefined,
        showInteractionCostEnergy: false,
        menuDisabled: false,
        menuFunctions: [{ menuFunction: MenuFunctionEnum.CLEAR_MEMORY }],
        customMenuFunction: [],
        getList: async function () {
          return [];
        },
      };
    }, [model.imAudioDisabled, model.imTextDisabled]);

    const {
      messageIdList,
      messageMap,
      autoPlayIdQueue,
      lastUserInteractionMsgId,
      draftMessage,
      sending,
      interacting,
      scrollToBottom,
      setDraftMessage,
      sendTextMessage,
      sendAudioMessage,
      replaceDraftMessage,
      addMessage,
      clearMessageList,
    } = useMessageParams(model.testType, model.testEntity.id, undefined, false);

    useEffect(() => {
      if (model) {
        model.isReadyPromiseResolve!('');
        model.innerMethods.addMessage = addMessage;
        model.innerMethods.sendTextMessage = sendTextMessage;
        model.innerMethods.clearMessageList = clearMessageList;
      }
    }, [model]);

    const userId = model.testUserId;

    const visitorNameParser = useCallback((nameTag: string) => {
      return `${'visitor'}${nameTag}`;
    }, []);

    const displayMessageMap = useMemo(
      () =>
        new Map(
          // @ts-ignore
          [...messageMap].map(([key, value]) => [
            key,
            (() => {
              const displayMessage = MessageToDisplayParser(
                value,
                userId ?? '0',
                new Map(),
                true,
                visitorNameParser,
              );
              if (typeof messageToDisplayParserPost === 'function') {
                messageToDisplayParserPost(displayMessage);
              }
              return displayMessage;
            })(),
          ]),
        ),
      [messageMap, userId, visitorNameParser],
    );

    const messageContextParams: MessageContextProps = useMemo(
      () => ({
        messageIdList,
        messageMap: displayMessageMap,
        autoPlayIdQueue,
        lastUserInteractionMsgId,
        draftMessage,
        sending,
        interacting,
        scrollToBottom,
        setDraftMessage,
        sendTextMessage: text => {
          sendTextMessage(text);
          if (typeof model?.handlers.sendTextMessagePost === 'function') {
            model.handlers.sendTextMessagePost(text);
          }
        },
        sendAudioMessage: async () => {},
        hasMore: false,
        gettingHistory: false,
        getHistoryMessage: async () => {
          return [];
        },
        clearMessageList,
      }),
      [
        autoPlayIdQueue,
        lastUserInteractionMsgId,
        draftMessage,
        sending,
        interacting,
        scrollToBottom,
        setDraftMessage,
        messageIdList,
        clearMessageList,
      ],
    );

    return (
      <StaticContext.Provider value={staticContextProps}>
        <div className="w-full h-full overflow-hidden relative">
          <div
            className="w-full h-full overflow-auto no-scrollbar scroll-smooth"
            ref={scrollContainerRef}>
            <div className="chat-module-container h-full md:rounded-3xl overflow-hidden">
              <MessageContext.Provider value={messageContextParams}>
                <div
                  style={{ height: '100%' }}
                  css={css`
                    a {
                      color: -webkit-link !important;
                    }
                  `}>
                  <ChatModule
                    editorContainerRef={editorContainerRef}
                    editorAnchorRef={editorAnchorRef}
                    textareaRef={textareaRef}
                    topActionsSlot={<span></span>}
                    scrollLayoutToTop={scrollLayoutToTop}
                    customMenuIconSlot={customMenuIconSlot}
                  />
                </div>
              </MessageContext.Provider>
            </div>
          </div>
        </div>
      </StaticContext.Provider>
    );
  },
);
