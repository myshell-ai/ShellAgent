import { z } from 'zod';

// start-Download-Center-Models
export const url_download_center_list =
  '/api/download-center/get_downloading_models';

export const DownloadingModelItem = z.object({
  model_id: z.string(),
  model_url: z.string(),
  cache_path: z.string(),
  force: z.boolean().optional(),
  filename: z.string(),
  status: z.string().optional(),
  error_status: z.literal('failed').optional(),
});

export const DownloadModelListRes = z.object({
  models: z.array(DownloadingModelItem),
});

// stop-Download-Center-Models

// start-Model-Cancel
export const url_model_cancel = `/api/models/cancel_download`;
export const ModelCancelRequest = z.object({
  cache_path: z.string(),
});
// stop-Model-Cancel
