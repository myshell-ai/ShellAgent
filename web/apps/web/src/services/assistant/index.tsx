import type { Fetcher } from 'swr';

import { QueryRequest, QueryResponse } from './type';
import { APIFetch } from '../base';

export const query: Fetcher<QueryResponse, QueryRequest> = params => {
  return APIFetch.post<QueryResponse>('/api/helper/query', {
    body: params,
  });
};

export const clearMemory = () => {
  return APIFetch.post('/api/helper/clear_memory');
};
