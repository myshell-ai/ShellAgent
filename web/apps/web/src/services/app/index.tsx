import {
  fetchEventSource,
  FetchEventSourceInit,
} from '@microsoft/fetch-event-source';
import type { Fetcher } from 'swr';

import {
  GetAutomataRequest,
  GetAutomatagResponse,
  GetAppFlowRequest,
  GetAppFlowResponse,
  SaveAppRequest,
  SaveAppResponse,
  RunAppRequest,
  InitBotRequest,
  InitBotResponse,
  ExportBotRequest,
  ExportBotResponse,
} from './type';
import { APIFetch } from '../base';

// 保存
export const saveApp = (params: SaveAppRequest) => {
  return APIFetch.post<SaveAppResponse>('/api/app/save', {
    body: params,
  });
};

// 获取proconfig
export const fetchAutomata: Fetcher<
  GetAutomatagResponse,
  GetAutomataRequest
> = params => {
  return APIFetch.post<GetAutomatagResponse>('/api/app/get_automata', {
    body: params,
  });
};

// 获取reactflow
export const fetchFlow: Fetcher<
  GetAppFlowResponse,
  GetAppFlowRequest
> = params => {
  return APIFetch.post<GetAppFlowResponse>('/api/app/get_flow', {
    body: params,
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
