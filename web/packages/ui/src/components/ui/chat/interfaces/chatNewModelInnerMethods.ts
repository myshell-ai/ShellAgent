import { DraftMessage, LocalErrorMessage, Message } from 'myshell-bundled-chat';

/**
 * 内部方法 对接 hooks 方法
 */
export interface ChatNewModelInnerMethods {
  addMessage: (
    messages:
      | (Message | DraftMessage | LocalErrorMessage)
      | Array<Message | DraftMessage | LocalErrorMessage>,
  ) => void;
  sendTextMessage: (text: string) => void;
  clearMessageList: () => void;
}
