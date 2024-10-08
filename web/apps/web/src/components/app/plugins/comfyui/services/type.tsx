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
  // metadata.json
  // workflow.json
  // workflow.shellagent.json
  filename: string;
  comfy_workflow_id: string;
}

export interface GetFileResponse {
  data: {
    workflow: any;
    workflow_api: any;
    dependencies: {
      comfyui_version: {
        name: string;
        repo: string;
        commit: string;
      };
      custom_nodes: Array<{
        name: string;
        repo: string;
        commit: string;
      }>;
      models: Record<
        string,
        {
          filename: string;
          save_path: string;
          urls: string[];
        }
      >;
      files: Record<string, any>;
    };
    schemas: {
      inputs: Record<
        string,
        {
          title: string;
          type: string;
          default?: any;
          description: string;
        }
      >;
      outputs: Record<
        string,
        {
          title: string;
          type: string;
          items?: {
            type: string;
            url_type: string;
          };
        }
      >;
    };
  };
  message: string;
  success: boolean;
}
