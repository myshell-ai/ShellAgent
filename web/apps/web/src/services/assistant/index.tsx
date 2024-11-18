import type { Fetcher } from 'swr';

import { APIFetch } from '../base';
import { QueryRequest, QueryResponse } from './type';

export const query: Fetcher<QueryResponse, QueryRequest> = params => {
  return APIFetch.post<QueryResponse>('/api/helper/query', {
    body: params,
  });
};

export const clearMemory = () => {
  return APIFetch.post('/api/helper/clear_memory');
};
