import { Message } from 'myshell-bundled-chat';

/**
 * re-aggregate some methods of bundle chat here.
 */
export interface ChatNewModelInnerMethods {
  appendMessages: (
    messages: Message | Message[],
    needScrollToBottom?: boolean,
  ) => void;
  sendTextMessage: (text: string) => void;
}
