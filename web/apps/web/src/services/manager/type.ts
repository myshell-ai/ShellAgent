// models
export interface ModelsMarketplaceData {
  name: string;
  type: string;
  base: string;
  link: string;
  description: string;
  file_name: string;
}

export interface GetModelsMarketplaceListRequest {
  query: string; // 模糊通配
  type: string;
  base: string;
}

export interface GetModelsMarketplaceListResponse {
  data: Array<
    ModelsMarketplaceData & {
      id: string;
    }
  >;
  success: boolean;
  message: string;
}

export interface ModelsMarketplaceInstallRequest {
  id: string;
}

export interface ModelsMarketplaceInstallResponse {
  data: { id: string };
  success: boolean;
  message: string;
}

export interface ModelsMarketplaceInstallFromLinkRequest
  extends ModelsMarketplaceData {}

export interface ModelsMarketplaceInstallFromLinkResponse {
  data: { id: string };
  success: boolean;
  message: string;
}

export interface BatchModelsMarketplaceInstallRequest {
  id_list: Array<string>;
}

export interface BatchModelsMarketplaceInstallResponse {
  success: boolean;
  message: string;
}

export interface BatchModelsMarketplaceUninstallRequest {
  id_list: Array<string>;
}

export interface BatchModelsMarketplaceUninstallResponse {
  success: boolean;
  message: string;
}

export interface ModelsInstalledData {
  name: string;
  type: string;
  base: string;
  link: string;
  description: string;
  file_name: string;
  version?: string;
}

export interface GetModelsInstalledListRequest {
  query: string; // 模糊通配
  type: string;
  base: string;
  location: string;
}

export interface GetModelsInstalledListResponse {
  data: Array<
    ModelsInstalledData & {
      id: string;
      create_time: string;
      update_time: string;
    }
  >;
  success: boolean;
  message: string;
}

export interface BatchModelsInstalledUninstallRequest {
  id_list: Array<string>;
}

export interface BatchModelsInstalledUninstallResponse {
  success: boolean;
  message: string;
}

// widgets
export interface WidgetsMarketplaceData {
  name: string;
  type: string;
  base: string;
  link: string;
  description: string;
  file_name: string;
}

export interface GetWidgetsMarketplaceListRequest {
  query: string; // 模糊通配
  type: string;
  base: string;
}

export interface GetWidgetsMarketplaceListResponse {
  data: Array<
    WidgetsMarketplaceData & {
      id: string;
    }
  >;
  success: boolean;
  message: string;
}

export interface WidgetsMarketplaceInstallRequest {
  id: string;
}

export interface WidgetsMarketplaceInstallResponse {
  data: { id: string };
  success: boolean;
  message: string;
}

export interface BatchWidgetsMarketplaceInstallRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsMarketplaceInstallResponse {
  success: boolean;
  message: string;
}

export interface BatchWidgetsMarketplaceUninstallRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsMarketplaceUninstallResponse {
  success: boolean;
  message: string;
}

//
export interface BatchWidgetsMarketplaceOpenRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsMarketplaceOpenResponse {
  success: boolean;
  message: string;
}

export interface BatchWidgetsMarketplaceDisabledRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsMarketplaceDisabledResponse {
  success: boolean;
  message: string;
}

export interface BatchWidgetsMarketplaceUpdateRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsMarketplaceUpdateResponse {
  success: boolean;
  message: string;
}

export interface WidgetsInstalledData {
  name: string;
  type: string;
  base: string;
  link: string;
  description: string;
  file_name: string;
  version?: string;
}

export interface GetWidgetsInstalledListRequest {
  query: string; // 模糊通配
  type: string;
  base: string;
  location: string;
}

export interface GetWidgetsInstalledListResponse {
  data: Array<
    WidgetsInstalledData & {
      id: string;
      create_time: string;
      update_time: string;
    }
  >;
  success: boolean;
  message: string;
}

export interface WidgetsInstalledInstallRequest {
  id: string;
  version: string;
}

export interface WidgetsInstalledInstallResponse {
  success: boolean;
  message: string;
}

export interface BatchWidgetsInstalledInstallRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsInstalledInstallResponse {
  success: boolean;
  message: string;
}

export interface BatchWidgetsInstalledUninstallRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsInstalledUninstallResponse {
  success: boolean;
  message: string;
}

export interface BatchWidgetsInstalledOpenRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsInstalledOpenResponse {
  success: boolean;
  message: string;
}

export interface BatchWidgetsInstalledDisabledRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsInstalledDisabledResponse {
  success: boolean;
  message: string;
}

export interface BatchWidgetsInstalledUpdateRequest {
  id_list: Array<string>;
}

export interface BatchWidgetsInstalledUpdateResponse {
  success: boolean;
  message: string;
}
