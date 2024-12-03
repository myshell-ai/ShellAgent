export interface Metadata {
  name: string;
  description: string;
  avatar?: string; // 默认logo，save自动截图
  categories?: string[];
}

export type Type = 'app' | 'workflow';

export interface GetListRequest {
  type: Type;
}

export interface GetListResponse {
  data: Array<{
    id: string;
    metadata: Metadata & {
      create_time: string;
      update_time: string;
    };
  }>;
  total: number;
  success: boolean;
  message: string;
}

export interface CreateRequest extends Metadata {
  type: Type;
  template_id?: string;
}

export interface CreateResponse {
  data: {
    id: string;
  };
  success: boolean;
  message: string;
}

export interface EditRequest extends Metadata {
  type: Type;
  id: string;
}

export interface EditResponse {
  success: boolean;
  message: string;
}

export interface DuplicateRequest {
  id: string; // 需要复制的workflow id，其他信息copy该workfow内容
  name: string; // 前端根据name生成 “name copy”
  type: Type;
}

export interface DuplicateResponse {
  data: {
    id: string;
  };
  success: boolean;
  message: string;
}

export interface DeleteRequest {
  type: Type;
  id: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface TemplateListRequest {
  type: Type; // 'app' | 'workflow', workflow 暂时不需要
  categories: string[];
}

export interface TemplateListResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    metadata: Metadata;
  }>;
}

export interface SaveAsTemplateResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
}
