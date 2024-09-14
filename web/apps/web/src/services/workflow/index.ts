import {
  fetchEventSource,
  FetchEventSourceInit,
} from '@microsoft/fetch-event-source';
import type { Fetcher } from 'swr';

import {
  GetWidgetListRequest,
  GetWidgetListResponse,
  GetWidgetSchemaRequest,
  GetWidgetSchemaResponse,
  GetProconfigRequest,
  GetProconfigResponse,
  GetFlowRequest,
  GetFlowResponse,
  SaveWorkflowRequest,
  SaveWorkflowResponse,
  RunWorkflowRequest,
  GetWorkflowVersionListRequest,
  GetWorkflowVersionListResponse,
  ReleaseWorkflowRequest,
  ReleaseWorkflowResponse,
  ReloadWorkflowRequest,
  ReloadWorkflowResponse,
  ComfyUIRequest,
  ComfyuiResponse,
} from './type';
import { APIFetch } from '../base';

// 获取widget列表
export const fetchWidgetList: Fetcher<
  GetWidgetListResponse,
  GetWidgetListRequest
> = params => {
  return APIFetch.get<GetWidgetListResponse>(
    '/api/workflow/get_widget_category_list',
    params,
  );
};

// 获取widget form schema
export const fetchWidgetSchema: Fetcher<
  GetWidgetSchemaResponse,
  GetWidgetSchemaRequest
> = params => {
  return APIFetch.post<GetWidgetSchemaResponse>(
    '/api/workflow/get_widget_schema',
    {
      body: params,
    },
  );
};

// 保存
export const saveWorkflow = (params: SaveWorkflowRequest) => {
  return APIFetch.post<SaveWorkflowResponse>('/api/workflow/save', {
    body: params,
  });
};

// 获取proconfig
export const fetchProConfig: Fetcher<
  GetProconfigResponse,
  GetProconfigRequest
> = params => {
  return APIFetch.post<GetProconfigResponse>('/api/workflow/get_proconfig', {
    body: params,
  });
};

// 获取reactflow
export const fetchFlow: Fetcher<GetFlowResponse, GetFlowRequest> = params => {
  return APIFetch.post<GetFlowResponse>('/api/workflow/get_flow', {
    body: params,
  });
};

export const runWorkflow = (
  params: RunWorkflowRequest,
  cb: {
    onMessage?: FetchEventSourceInit['onmessage'];
    // onOpen?: (event: Event) => void;
    onError?: (event: Event | string) => void;
  },
) => {
  const abortController = new AbortController();

  // const ctrl = new AbortController();
  fetchEventSource('/api/workflow/run', {
    method: 'POST',
    mode: 'cors',
    headers: {
      method: 'POST',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
    signal: abortController.signal,
    openWhenHidden: true,
    onerror(err) {
      cb?.onError?.(err);
    },
    onmessage(msg) {
      cb?.onMessage?.(msg);
    },
    // onopen(event) {
    //   cb.onOpen && cb.onOpen(event);
    // },
  });
};

// 获取Version列表
export const fetchWorkflowVersionList = (
  params: GetWorkflowVersionListRequest,
) => {
  return APIFetch.post<GetWorkflowVersionListResponse>(
    '/api/workflow/get_version_list',
    {
      body: params,
    },
  );
};

// 发版
export const releaseWorkflow = (params: ReleaseWorkflowRequest) => {
  return APIFetch.post<ReleaseWorkflowResponse>('/api/workflow/release', {
    body: params,
  });
};

// reload
export const realoadWorkflow = (params: ReloadWorkflowRequest) => {
  return APIFetch.post<ReloadWorkflowResponse>('/api/reload', {
    body: params,
  });
};

export const importFormComfyUI = (params: ComfyUIRequest) => {
  return APIFetch.post<ComfyuiResponse>(
    '/api/tools/convert_comfyui_to_proconfig',
    {
      body: params,
    },
  );
};
