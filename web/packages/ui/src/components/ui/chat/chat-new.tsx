import {
  ChatModule,
  Message,
  MessageContext,
  MessageContextProps,
  MessageToDisplayParser,
  ServerFileTypes,
  StaticContext,
  StaticContextProps,
  useAtBottom,
  useChatLayout,
  useEditorMode,
  useMessageParams,
  useUploadFiles,
  useVirtuosoMessageListApi,
  IMLocalFile,
} from 'myshell-bundled-chat';
import 'myshell-bundled-chat/styles.css';
import { useCallback, useEffect, useMemo } from 'react';

import { ChatNewProps } from './interfaces/chatNewProps';
import { observer } from 'mobx-react-lite';

export const ChatNew = observer<ChatNewProps>(({ model }) => {
  const {
    scrollContainerRef,
    editorAnchorRef,
    editorContainerRef,
    textareaRef,
    scrollLayoutToTop,
    isEditorSticky,
  } = useChatLayout();

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

  const {
    messageList,
    lastUserInteractionMsgId,
    draftMessage,
    sending,
    interacting,
    scrollToBottom,
    exceptionsForTextDisplay,
    addTextDisplayException,
    setDraftMessage,
    sendTextMessage,
    mixMessages,
    appendMessages,
    updateMessage,
    deleteSpecifiedMessageId,
    partialUpdateMsg,
    audioQueue,
    sendButtonInteractionMessage,
    file: { uploadedFiles },
    onMessageReply,
    lastValidReplyMessage,
  } = useMessageParams({
    type: 'bot',
    id: model.entity.id,
    entityId: model.entity.id,
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

  const {
    dragMaskVisible,
    noValidLimitations,
    handleUpload,
    handleDelete,
    getClickRootProps,
    getDragRootProps,
    getInputProps,
    handlePastedFiles,
    isChoosingFile,
  } = useUploadFiles({
    messageSettings: lastValidReplyMessage?.uploadSetting,
    panelSettings: {
      supportedFileInfos: [
        {
          type: 'MESSAGE_METADATA_TYPE_ALL_FILE' as ServerFileTypes,
          fileExtensions: [],
          minUploadNum: 0,
          maxUploadNum: 1,
          maxSingleBytes: 10485760,
          maxTotalBytes: 10485760,
        },
      ],
    },
    id: model.entity.id,
    type: 'bot',
    name: 'test',
    uploadedFiles,
    disabled: !(lastValidReplyMessage?.inputSetting?.canUploadFile ?? true),
    dragDisabled: isEditorSticky,
    scrollLayoutToTop,
    textareaRef,
  });

  const staticContextProps: StaticContextProps = useMemo(() => {
    return {
      type: 'bot',
      entityInfo: model.entity,
      entitySetting: {},
      chatSettingDisabled: false,
      chatSettingLoading: false,
      interactionDisabled: false,
      showInteractionCostEnergy: false,
      menuDisabled: false,
      menuFunctions: [
        {
          menuFunction: 2,
        },
        {
          menuFunction: 3,
        },
      ],
      customMenuFunction: [],
      getList: async () => {
        return [];
      },
      atBottom,
      setAtBottom,
      globalContextMenuDisabled: true,

      textDisabled: !(
        lastValidReplyMessage?.inputSetting?.canInputText ?? true
      ),
      audioDisabled: !(
        lastValidReplyMessage?.inputSetting?.canInputAudio ?? true
      ),
      uploadDisabled:
        !(lastValidReplyMessage?.inputSetting?.canUploadFile ?? true) ||
        noValidLimitations,
    };
  }, [
    lastValidReplyMessage?.inputSetting?.canInputAudio,
    lastValidReplyMessage?.inputSetting?.canInputText,
    lastValidReplyMessage?.inputSetting?.canUploadFile,
  ]);

  const memberInfoMap = new Map();
  memberInfoMap.set('entity-undefined', {
    isEntity: false,
  });
  memberInfoMap.set(`entity-${model.entity.id}`, {
    id: model.entity.id,
    isEntity: true,
  });

  const messageToDisplay = useCallback((message: Message) => {
    return MessageToDisplayParser(message, model.user.id, memberInfoMap);
  }, []);

  const { editorMode, setEditorMode, inputMode, setInputMode } =
    useEditorMode();

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
      sendTextMessage: async (
        text: string,
        files?: IMLocalFile[],
        requestParams?: any,
      ) => {
        sendTextMessage(text, files, requestParams);
        model.handlers.sendTextMessagePost?.(text);
      },
      clearMemory: async () => {
        model.clearMemory();
      },
      clearHistory: async () => {
        deleteSpecifiedMessageId();
      },
      sendButtonInteractionMessage: async (...args) => {
        sendButtonInteractionMessage(...args);
        model.handlers.sendButtonInteractionMessagePost?.(...args);
      },
      file: {
        isChoosingFile,
        uploadedFiles,
        uploadFiles: handleUpload,
        deleteFile: handleDelete,
        overrideUploadFileToS3WithProgress:
          model.handlers.overrideUploadFileToS3WithProgress,
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
      mixMessages,
      appendMessages,
      updateMessage,
      deleteSpecifiedMessageId,
      partialUpdateMsg,
      getClickRootProps,
      getDragRootProps,
      getInputProps,
      dragMaskVisible,
      editorMode,
      setEditorMode,
      inputMode,
      setInputMode,
      isChoosingFile,
      uploadedFiles,
      handleUpload,
      handleDelete,
      handlePastedFiles,
    ],
  );

  useEffect(() => {
    if (model) {
      model.isReadyPromiseResolve!('');
      model.innerMethods.appendMessages = appendMessages;
      model.innerMethods.sendTextMessage = sendTextMessage;
      model.innerMethods.onMessageReply = onMessageReply;
    }
  }, [model]);

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
});
