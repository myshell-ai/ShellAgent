export interface ChatNewModelHandlers {
  /**
   * 内部方法 sendTextMessage Post hook
   * e.g. 用来对接后端
   */
  sendTextMessagePost: (text: string) => void | Promise<void>;
}
