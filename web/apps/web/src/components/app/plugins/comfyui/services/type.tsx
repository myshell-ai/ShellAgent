export interface UploadRequest {
  // uuid
  comfy_workflow_id: string;
  // comfyui workflow
  workflow: Record<string, any>;
}

export interface UploadResponse {
  status: boolean;
  comfy_json: any;
  msg: string;
}

export interface SaveRequest {
  prompt: Record<string, any>;
  workflow: Record<string, any>;
  name: string;
  comfy_workflow_id: string;
  comfyui_api: string;
}

export interface SaveResponse {
  result: any;
}

export interface GetFileRequest {
  file_name: string;
  comfy_workflow_id: string;
}

export interface GetFileResponse {
  result: any;
}
