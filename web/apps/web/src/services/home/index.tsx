import type { Fetcher } from 'swr';

import {
  GetListRequest,
  GetListResponse,
  CreateRequest,
  CreateResponse,
  EditRequest,
  EditResponse,
  DuplicateRequest,
  DuplicateResponse,
  DeleteRequest,
  DeleteResponse,
} from './type';
import { APIFetch } from '../base';

// 获取/app列表
export const fetchList: Fetcher<GetListResponse, GetListRequest> = params => {
  return APIFetch.post<GetListResponse>('/api/list', {
    body: params,
  });
};

// 创建/app
export const createItem = (params: CreateRequest) => {
  return APIFetch.post<CreateResponse>('/api/create', {
    body: params,
  });
};

// 编辑/app
export const editItem = (params: EditRequest) => {
  return APIFetch.post<EditResponse>('/api/edit', {
    body: params,
  });
};

// 复制/app
export const duplicateItem = (params: DuplicateRequest) => {
  return APIFetch.post<DuplicateResponse>('/api/duplicate', {
    body: params,
  });
};

// 删除/app
export const deleteItem = (params: DeleteRequest) => {
  return APIFetch.post<DeleteResponse>('/api/delete', {
    body: params,
  });
};

// import、export先不做，等出设计
