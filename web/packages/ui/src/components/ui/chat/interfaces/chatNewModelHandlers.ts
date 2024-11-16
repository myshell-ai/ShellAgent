import { SlashCommandInput } from 'myshell-bundled-chat';

export interface ChatNewModelHandlers {
  sendTextMessagePost: (text: string) => void | Promise<void>;
  clearMemoryPost: () => void | Promise<void>;
  sendButtonInteractionMessagePost: (
    buttonInteractionParams: {
      actionType: string;
      buttonId?: string;
      componentInputMessage?: string;
      text?: string;
      imSlashCommandInput?: SlashCommandInput;
    },
    requestParams?: any,
  ) => void;
  overrideUploadFileToS3WithProgress: (file: File) => Promise<{
    success: boolean;
    objectAccessUrl?: string;
  }>;
}
