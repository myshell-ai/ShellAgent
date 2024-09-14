import type { Fetcher } from 'swr';

import {
  GetModelsMarketplaceListRequest,
  GetModelsMarketplaceListResponse,
  ModelsMarketplaceInstallRequest,
  ModelsMarketplaceInstallResponse,
  ModelsMarketplaceInstallFromLinkRequest,
  ModelsMarketplaceInstallFromLinkResponse,
  BatchModelsMarketplaceInstallRequest,
  BatchModelsMarketplaceInstallResponse,
  BatchModelsMarketplaceUninstallRequest,
  BatchModelsMarketplaceUninstallResponse,
  GetModelsInstalledListRequest,
  GetModelsInstalledListResponse,
  BatchModelsInstalledUninstallRequest,
  BatchModelsInstalledUninstallResponse,
  GetWidgetsMarketplaceListRequest,
  GetWidgetsMarketplaceListResponse,
  WidgetsMarketplaceInstallRequest,
  WidgetsMarketplaceInstallResponse,
  BatchWidgetsMarketplaceInstallRequest,
  BatchWidgetsMarketplaceInstallResponse,
  BatchWidgetsMarketplaceUninstallRequest,
  BatchWidgetsMarketplaceUninstallResponse,
  BatchWidgetsMarketplaceOpenRequest,
  BatchWidgetsMarketplaceOpenResponse,
  BatchWidgetsMarketplaceDisabledRequest,
  BatchWidgetsMarketplaceDisabledResponse,
  BatchWidgetsMarketplaceUpdateRequest,
  BatchWidgetsMarketplaceUpdateResponse,
  GetWidgetsInstalledListResponse,
  WidgetsInstalledInstallResponse,
  WidgetsInstalledInstallRequest,
  GetWidgetsInstalledListRequest,
  BatchWidgetsInstalledInstallRequest,
  BatchWidgetsInstalledInstallResponse,
  BatchWidgetsInstalledUninstallRequest,
  BatchWidgetsInstalledUninstallResponse,
  BatchWidgetsInstalledOpenRequest,
  BatchWidgetsInstalledOpenResponse,
  BatchWidgetsInstalledDisabledRequest,
  BatchWidgetsInstalledDisabledResponse,
  BatchWidgetsInstalledUpdateRequest,
  BatchWidgetsInstalledUpdateResponse,
} from './type';
import { APIFetch } from '../base';

// import、export先不做，等出设计

// Models Marketplace
export const fetchModelsMarketplaceList: Fetcher<
  GetModelsMarketplaceListResponse,
  GetModelsMarketplaceListRequest
> = params => {
  return APIFetch.post<GetModelsMarketplaceListResponse>(
    '/api/models/marketplace/list',
    {
      params,
    },
  );
};

export const installModelsMarketplace: Fetcher<
  ModelsMarketplaceInstallResponse,
  ModelsMarketplaceInstallRequest
> = params => {
  return APIFetch.post<ModelsMarketplaceInstallResponse>(
    '/api/models/marketplace/install',
    {
      body: params,
    },
  );
};

export const installFromLinkModelsMarketplace: Fetcher<
  ModelsMarketplaceInstallFromLinkResponse,
  ModelsMarketplaceInstallFromLinkRequest
> = params => {
  return APIFetch.post<ModelsMarketplaceInstallFromLinkResponse>(
    '/api/models/marketplace/install_from_link',
    {
      body: params,
    },
  );
};

export const batchInstallModelsMarketplace: Fetcher<
  BatchModelsMarketplaceInstallResponse,
  BatchModelsMarketplaceInstallRequest
> = params => {
  return APIFetch.post<BatchModelsMarketplaceInstallResponse>(
    '/api/models/marketplace/batch_install',
    {
      body: params,
    },
  );
};

export const batchUninstallModelsMarketplace: Fetcher<
  BatchModelsMarketplaceUninstallResponse,
  BatchModelsMarketplaceUninstallRequest
> = params => {
  return APIFetch.post<BatchModelsMarketplaceUninstallResponse>(
    '/api/models/marketplace/batch_uninstall',
    {
      body: params,
    },
  );
};

// Models Installed
export const fetchModelsInstalledList: Fetcher<
  GetModelsInstalledListResponse,
  GetModelsInstalledListRequest
> = params => {
  return APIFetch.get<GetModelsInstalledListResponse>(
    '/api/models/installed/list',
    {
      params,
    },
  );
};

export const batchUninstallModelsInstalled: Fetcher<
  BatchModelsInstalledUninstallResponse,
  BatchModelsInstalledUninstallRequest
> = params => {
  return APIFetch.post<BatchModelsInstalledUninstallResponse>(
    '/api/models/installed/batch_uninstall',
    {
      body: params,
    },
  );
};

// widgets Marketplace
export const fetchWidgetsMarketplaceList: Fetcher<
  GetWidgetsMarketplaceListResponse,
  GetWidgetsMarketplaceListRequest
> = params => {
  return APIFetch.get<GetWidgetsMarketplaceListResponse>(
    '/api/widgets/marketplace/list',
    {
      params,
    },
  );
};

export const installWidgetsMarketplace: Fetcher<
  WidgetsMarketplaceInstallResponse,
  WidgetsMarketplaceInstallRequest
> = params => {
  return APIFetch.post<WidgetsMarketplaceInstallResponse>(
    '/api/widgets/marketplace/install',
    {
      body: params,
    },
  );
};

export const batchInstallWidgetsMarketplace: Fetcher<
  BatchWidgetsMarketplaceInstallResponse,
  BatchWidgetsMarketplaceInstallRequest
> = params => {
  return APIFetch.post<BatchWidgetsMarketplaceInstallResponse>(
    '/api/widgets/marketplace/batch_install',
    {
      body: params,
    },
  );
};

export const batchOpenWidgetsMarketplace: Fetcher<
  BatchWidgetsMarketplaceOpenResponse,
  BatchWidgetsMarketplaceOpenRequest
> = params => {
  return APIFetch.post<BatchWidgetsMarketplaceOpenResponse>(
    '/api/widgets/marketplace/batch_open',
    {
      body: params,
    },
  );
};
export const batchDisabledWidgetsMarketplace: Fetcher<
  BatchWidgetsMarketplaceDisabledResponse,
  BatchWidgetsMarketplaceDisabledRequest
> = params => {
  return APIFetch.post<BatchWidgetsMarketplaceDisabledResponse>(
    '/api/widgets/marketplace/batch_disabled',
    {
      body: params,
    },
  );
};
export const batchUpdateWidgetsMarketplace: Fetcher<
  BatchWidgetsMarketplaceUpdateResponse,
  BatchWidgetsMarketplaceUpdateRequest
> = params => {
  return APIFetch.post<BatchWidgetsMarketplaceUpdateResponse>(
    '/api/widgets/marketplace/batch_update',
    {
      body: params,
    },
  );
};

export const batchUninstallWidgetsMarketplace: Fetcher<
  BatchWidgetsMarketplaceUninstallResponse,
  BatchWidgetsMarketplaceUninstallRequest
> = params => {
  return APIFetch.post<BatchWidgetsMarketplaceUninstallResponse>(
    '/api/widgets/marketplace/batch_uninstall',
    {
      body: params,
    },
  );
};

// Widgets Installed
export const fetchWidgetsInstalledList: Fetcher<
  GetWidgetsInstalledListResponse,
  GetWidgetsInstalledListRequest
> = params => {
  return APIFetch.get<GetWidgetsInstalledListResponse>(
    '/api/widgets/installed/list',
    {
      params,
    },
  );
};

export const installWidgetsInstalled: Fetcher<
  WidgetsInstalledInstallResponse,
  WidgetsInstalledInstallRequest
> = params => {
  return APIFetch.post<WidgetsInstalledInstallResponse>(
    '/api/widgets/installed/install',
    {
      body: params,
    },
  );
};

export const batchInstallWidgetsInstalled: Fetcher<
  BatchWidgetsInstalledInstallResponse,
  BatchWidgetsInstalledInstallRequest
> = params => {
  return APIFetch.post<BatchWidgetsInstalledInstallResponse>(
    '/api/widgets/installed/batch_install',
    {
      body: params,
    },
  );
};

export const batchUninstallWidgetsInstalled: Fetcher<
  BatchWidgetsInstalledUninstallResponse,
  BatchWidgetsInstalledUninstallRequest
> = params => {
  return APIFetch.post<BatchWidgetsInstalledUninstallResponse>(
    '/api/widgets/installed/batch_uninstall',
    {
      body: params,
    },
  );
};

export const batchOpenWidgetsInstalled: Fetcher<
  BatchWidgetsInstalledOpenResponse,
  BatchWidgetsInstalledOpenRequest
> = params => {
  return APIFetch.post<BatchWidgetsInstalledOpenResponse>(
    '/api/widgets/Installed/batch_open',
    {
      body: params,
    },
  );
};
export const batchDisabledWidgetsInstalled: Fetcher<
  BatchWidgetsInstalledDisabledResponse,
  BatchWidgetsInstalledDisabledRequest
> = params => {
  return APIFetch.post<BatchWidgetsInstalledDisabledResponse>(
    '/api/widgets/Installed/batch_disabled',
    {
      body: params,
    },
  );
};
export const batchUpdateWidgetsInstalled: Fetcher<
  BatchWidgetsInstalledUpdateResponse,
  BatchWidgetsInstalledUpdateRequest
> = params => {
  return APIFetch.post<BatchWidgetsInstalledUpdateResponse>(
    '/api/widgets/Installed/batch_update',
    {
      body: params,
    },
  );
};
