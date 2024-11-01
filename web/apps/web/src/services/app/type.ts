import { IFlow } from '@shellagent/flow-engine';
import { Automata } from '@shellagent/pro-config';

import { ServerMessage } from './message-type';
import { Metadata } from '../home/type';
import { AppState } from '@/stores/app/app-store';

export interface AppMetadata {
  name: string;
  description: string;
  avatar?: string; // 默认logo，save自动截图
}

// 获取automata
// /api/app/get_automata
export type GetAutomataRequest = {
  app_id: string;
  version_name?: string;
};

export type GetAutomatagResponse = {
  data: Automata;
};

// 获取flow数据
// /api/app/get_flow
export type GetAppFlowRequest = {
  app_id: string;
  version_name?: string;
};

export type GetAppFlowResponse = {
  config?: Record<string, any>;
  // 纯前端
  reactflow: IFlow;
  metadata: AppMetadata;
};

// 保存
// /api/app/save
export type SaveAppRequest = {
  config?: Record<string, any>;
  // 纯前端
  reactflow: IFlow;
  automata: Automata;
  app_id: string;
};

export type SaveAppResponse = {
  success: boolean;
};

export enum EventStatusEnum {
  app_start = 'app_start',
  app_end = 'app_end',
  state_start = 'state_start',
  state_end = 'state_end',
  state_exit = 'state_exit', // 等待用户交互, 结果放在这里
  task_start = 'task_start',
  task_end = 'task_end',
  workflow_start = 'workflow_start',
  workflow_end = 'workflow_end',
  heartbeat = 'heartbeat',
  queuing = 'queuing',
}

// SSE运行状态
export type EventStatus = keyof typeof EventStatusEnum;

/**
 * 初始化 bot
 * 注:
 * 1. 响应也是 ServerMessage, 用来支持打招呼、inputSetting 等
 * 2. 非 SSE
 */
export interface InitBotRequest {
  /**
   * 初始化 bot 用
   */
  automata: Automata;
}

export interface InitBotResponse {
  data: ServerMessage;
}

/**
 * 聊天信息, 一般是传给后端处理
 */
export interface RunAppRequest {
  /**
   * lui buttons 带弹出表单的提交数据
   */
  form_data?: Record<string, any>;
  /**
   * 后端用来区分 session
   */
  session_id: string;
  /**
   * 用户点击的 button 的 id
   */
  buttonId?: string;
  /**
   * 目前支持3种类型 1: TEXT 2: VOICE 15: BUTTON_INTERACTION
   */
  messageType: number;
  /**
   * 文本消息
   */
  text: string;
  /**
   * 同 text 保留兼容主站协议
   */
  message: string;
}

export type RunAppResponse = {
  event_type: EventStatus;
  data: ServerMessage;
};

export interface ExportBotRequest {
  app_id: string;
  version_name: string;
}

export interface ExportBotResponse {
  success: boolean;
  message: string;
  data: {
    workflows: {
      [key: string]: any;
    };
    dependency: {
      models: {
        [key: string]: {
          filename: string;
          save_path: string;
          urls: Array<string>;
        };
      };
      widgets: {
        [key: string]: {
          git: string;
          commit: string;
        };
      };
    };
    automata: Automata;
    metadata: Metadata;
  };
}

export type ReleaseAppRequest = SaveAppRequest & {
  metadata: Metadata;
  version_name: string;
};

export type ReleaseAppResponse = {
  success: boolean;
};

export type GetAppVersionListRequest = {
  app_id: string;
};

export type GetAppVersionListResponse = {
  data: Array<{
    version_name: string; // 用户写入 + 时间戳拼接
    create_time: number;
  }>;
};

export type GetShellAgentResponse = {
  data: {
    reactflow: {
      reactflow: IFlow;
      config: AppState['config'];
    };
    metadata: AppState['metadata'];
    automata: Automata;
  };
  success: boolean;
};
