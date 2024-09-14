import { z } from 'zod';

// start-url_types_bases_lists
export const url_types_bases_lists =
  '/api/models/marketplace/types_bases_lists';
// stop-url_types_bases_lists

// start-ModelsMarketPlace
export const url_models_marketplace_list = '/api/models/marketplace/list';

export const ModelsMarketPlaceItem = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  base: z.string(),
  link: z.array(
    z.object({
      url: z.string().describe('作为链接, 后端返回了其他数据先不做校验'),
    }),
  ),
  filename: z.string(),
  description: z.string(),
  install_status: z.union([
    z.literal('not_installed'),
    z.literal('installed'),
    z.literal('installing'),
  ]),
});
export const ModelsMarketPlaceSuccessRes = z.object({
  success: z.literal(true),
  data: z.array(ModelsMarketPlaceItem),
});

export const ModelsMarketPlaceFailureRes = z.object({
  success: z.literal(false),
  message: z.string(),
});

export const ModelsMarketPlaceRes = z.union([
  ModelsMarketPlaceSuccessRes,
  ModelsMarketPlaceFailureRes,
]);
// stop-ModelsMarketPlace

// start-ModelsMarketPlaceInstall
export const url_models_marketplace_install = '/api/models/marketplace/install';
export const ModelsInstallRequest = z.object({
  id: z.string(),
  force: z.literal('True').optional(),
});

export const downloading_event = z.object({
  output: z.object({
    progress: z.number(),
  }),
});

// stop-ModelsMarketPlaceInstall

// start-Manager-Models-Installed-List
export const url_models_installed_list = '/api/models/installed/list';
export const ModelInstalledResItem = z.object({
  id: z.string(),
  filename: z.string(),
  save_path: z.string(),
  local_path: z.string(),
  create_time: z.coerce.date(),
  update_time: z.coerce.date(),
});
// stop-Manager-Models-Installed-List
