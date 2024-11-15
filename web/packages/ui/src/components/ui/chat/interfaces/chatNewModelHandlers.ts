export interface ChatNewModelHandlers {
  sendTextMessagePost: (text: string) => void | Promise<void>;
  clearMemoryPost: () => void | Promise<void>;
}
