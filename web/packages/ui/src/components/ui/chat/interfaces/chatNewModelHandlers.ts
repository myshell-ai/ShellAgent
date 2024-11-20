import {
  ButtonFnParams,
  IMLocalFile,
  SlashCommandInput,
} from 'myshell-bundled-chat';

export interface ChatNewModelHandlers {
  sendTextMessagePost: (
    text: string,
    files?: IMLocalFile[],
    requestParams?: any,
  ) => void | Promise<void>;
  clearMemoryPost: () => void | Promise<void>;
  sendButtonInteractionMessagePost: (
    buttonInteractionParams: ButtonFnParams,
    requestParams?: any,
  ) => void;
  overrideUploadFileToS3WithProgress: (file: File) => Promise<{
    success: boolean;
    objectAccessUrl?: string;
  }>;
}
