import {
  fetchEventSource,
  FetchEventSourceInit,
} from '@microsoft/fetch-event-source';
import { isNil, omitBy } from 'lodash-es';
import type { Fetcher } from 'swr';

import { formatReactFlow2Api } from '@/stores/app/utils/data-transformer';

import {
  GetAutomataRequest,
  GetAutomatagResponse,
  GetAppFlowRequest,
  GetAppFlowResponse,
  SaveAppRequest,
  SaveAppResponse,
  ImportResponse,
  RunAppRequest,
  InitBotRequest,
  InitBotResponse,
  ExportBotRequest,
  ExportBotResponse,
  ReleaseAppRequest,
  ReleaseAppResponse,
  GetAppVersionListRequest,
  GetAppVersionListResponse,
} from './type';
import { APIFetch } from '../base';

// 保存
export const saveApp = (params: SaveAppRequest) => {
  return APIFetch.post<SaveAppResponse>('/api/app/save', {
    body: {
      ...params,
      reactflow: formatReactFlow2Api(params.reactflow),
    },
  });
};

// 获取proconfig
export const fetchAutomata: Fetcher<
  GetAutomatagResponse,
  GetAutomataRequest
> = params => {
  return APIFetch.post<GetAutomatagResponse>('/api/app/get_automata', {
    body: omitBy(params, isNil),
  });
};

// 获取reactflow
export const fetchFlow: Fetcher<
  GetAppFlowResponse,
  GetAppFlowRequest
> = params => {
  return APIFetch.post<GetAppFlowResponse>('/api/app/get_flow', {
    body: omitBy(params, isNil),
  });
};

// 获取reactflow
export const initBot: Fetcher<InitBotResponse, InitBotRequest> = params => {
  return APIFetch.post<InitBotResponse>('/api/app/init_bot', {
    body: params,
  });
};

export const runApp = (
  params: RunAppRequest,
  cb: {
    onMessage?: FetchEventSourceInit['onmessage'];
    // onOpen?: (event: Event) => void;
    onError?: (event: Event | string) => void;
  },
) => {
  const abortController = new AbortController();

  // const ctrl = new AbortController();
  fetchEventSource('/api/app/run', {
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

// 导出App
export const exportApp = (params: ExportBotRequest) => {
  return APIFetch.post<ExportBotResponse>('/api/app/export', {
    body: params,
  });
};

// 获取Version列表
export const fetchAppVersionList = (params: GetAppVersionListRequest) => {
  return APIFetch.post<GetAppVersionListResponse>('/api/app/get_version_list', {
    body: params,
  });
};

// 发版
export const releaseApp = (params: ReleaseAppRequest) => {
  return APIFetch.post<ReleaseAppResponse>('/api/app/release', {
    body: {
      ...params,
      reactflow: formatReactFlow2Api(params.reactflow),
    },
  });
};

// 导入
export const importApp = (params: ExportBotResponse['data']) => {
  return APIFetch.post<ImportResponse>('/api/app/import', {
    body: params,
  });
};
