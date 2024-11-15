import { SlashCommandInput } from 'myshell-bundled-chat';

export interface ChatNewModelHandlers {
  sendTextMessagePost: (text: string) => void | Promise<void>;
  clearMemoryPost: () => void | Promise<void>;
  sendButtonInteractionMessagePost: (
    buttonInteractionParams: {
      text?: string;
      componentInputMessage?: string;
      imSlashCommandInput?: SlashCommandInput;
    },
    requestParams?: any,
  ) => void;
}
