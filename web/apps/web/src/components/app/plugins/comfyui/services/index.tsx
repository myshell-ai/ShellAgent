import { APIFetch } from '@/services/base';

import {
  GetFileRequest,
  GetFileResponse,
  SaveRequest,
  SaveResponse,
  UpdateDependencyRequest,
  UpdateDependencyResponse,
  UploadRequest,
  UploadResponse,
} from './type';

export const uploadComfy = (params: UploadRequest) => {
  return APIFetch.post<UploadResponse>('/api/comfyui/upload', {
    body: params,
  });
};

export const saveComfy = (params: SaveRequest) => {
  return APIFetch.post<SaveResponse>('/api/comfyui/save', {
    body: params,
  });
};

export const getFile = (params: GetFileRequest) => {
  return APIFetch.post<GetFileResponse>('/api/comfyui/get_file', {
    body: params,
  });
};

export const updateDependency = (params: UpdateDependencyRequest) => {
  return APIFetch.post<UpdateDependencyResponse>(
    '/api/comfyui/update_dependency',
    {
      body: params,
    },
  );
};
