import { DisplayMessage } from 'myshell-bundled-chat';
import { ChatNewModel } from '../chat-new.model';
import { ReactNode } from 'react';

export interface ChatNewProps {
  model: ChatNewModel;
  /**
   * 在 Chat 中会将 Message 处理成 DisplayMessage
   * 开放 Post 接口, 允许用户自定义处理 DisplayMessage
   *
   * 注: 由于 DisplayMessage 包含 React 类型, 为了让 unit test 不依赖 DOM,
   * 涉及 React 操作都不放在 models 里
   */
  messageToDisplayParserPost?: (displayMessage: DisplayMessage) => void;
  customMenuIconSlot?: ReactNode;
}
