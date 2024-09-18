import { MaterialListType, IFlow, WidgetNode } from '@shellagent/flow-engine';
import { Workflow, Task } from '@shellagent/pro-config';
import { JsonSchema7 } from 'node_modules/@shellagent/form-engine/src/types/jsonSchema7';

import { Metadata } from '../home/type';
// import { CommonResponse } from "../base";

export { type JsonSchema7 };

// 获取widget列表（静态）
// /api/workflow/get_widget_list
export type GetWidgetListRequest = {};

export type GetWidgetListResponse = {
  widget_list: MaterialListType;
};

// 获取widget form schema
// /api/workflow/get_widget_schema
export type GetWidgetSchemaRequest = {
  widget_name: string; // 后续需要考虑版本
};

export type GetWidgetSchemaResponse = {
  input_schema: JsonSchema7 | Record<string, JsonSchema7>;
  output_schema: JsonSchema7;
  multi_input_schema: boolean;
};

// 获取proconfig
// /api/workflow/get_proconfig
export type GetProconfigRequest = {
  flow_id: string;
  version_name?: string; // 不传默认获取latest
};

export type GetProconfigResponse = {
  data: Workflow;
};

// 获取flow数据
// /api/workflow/get_flow
export type GetFlowRequest = {
  flow_id: string;
  version_name?: string; // 不传默认获取latest
};

export type GetFlowResponse = {
  // workflow
  config?: Record<string, any>;
  // 纯前端
  reactflow: IFlow;
  metadata: Metadata;
};

// 获取workflow version列表
// /api/workflow/get_version_list
export type GetWorkflowVersionListRequest = {
  flow_id: string;
};

export type GetWorkflowVersionListResponse = {
  data: Array<{
    version_name: string; // 用户写入 + 时间戳拼接
    create_time: number;
  }>;
};

// 发版
// /api/workflow/release
export type ReleaseWorkflowRequest = {
  // workflow
  config?: Record<string, any>;
  // 纯前端
  reactflow: IFlow;
  workflow: Workflow;
  flow_id: string;
  version_name: string;
  metadata: Metadata;
};

export type ReleaseWorkflowResponse = {
  success: boolean;
};

// 保存草稿
// /api/workflow/save
export type SaveWorkflowRequest = {
  // workflow
  config?: Record<string, any>;
  // 纯前端
  reactflow: IFlow;
  workflow: Workflow;
  flow_id: string;
};

export type SaveWorkflowResponse = {
  success: boolean;
};

// flow运行 SSE 入参：flow-id
// /api/workflow/run

// SSE运行状态
export type EventStatus =
  | 'workflow_start'
  | 'workflow_end'
  | 'node_start'
  | 'node_end'
  | 'node_running';

export enum EventStatusEnum {
  workflow_start = 'workflow_start',
  workflow_end = 'workflow_end',
  node_start = 'node_start',
  node_end = 'node_end',
  node_running = 'node_running',
}

// 节点
export type NodeName = Task['name'];
export type RunWorkflowRequest = {
  user_input: Record<string, any>;
  workflow: Workflow;
};

export type RunWorkflowResponse = {
  event_type: EventStatus;
  data: WidgetNode['runtime_data'];
};

// reload
export type ReloadWorkflowRequest = {
  widget_name?: string;
};

export type ReloadWorkflowResponse = {
  success: boolean;
};

export type ComfyUIRequest = {
  data: object;
};

export type ExistedInfo =  {
  undefined_widgets?: Array<string>;
  non_existed_models?: Array<string>;
}

export type ComfyuiResponse = {
  success?: boolean;
  data?: Workflow;
  error_message?: string;
  error_message_detail?: string;
} & ExistedInfo;
