import type { GetFileResponse, UpdateDependencyRequest } from './services/type';

export function isValidUrl(url: string) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export function checkDependency(
  data: GetFileResponse['data']['dependencies'] | null,
) {
  const missingCustomNodes: UpdateDependencyRequest['missing_custom_nodes'] =
    [];
  const missingModels: UpdateDependencyRequest['missing_models'] = {};

  // 检查custom_nodes的repo参数是否为空
  data?.custom_nodes?.forEach(node => {
    if (!node?.repo) {
      missingCustomNodes.push(node);
    }
  });

  // 检查models的urls是否为空
  Object.entries(data?.models || {}).forEach(([key, model]) => {
    if (!model?.urls || model.urls.length === 0) {
      missingModels[key] = model;
    }
  });

  return {
    missingCustomNodes,
    missingModels,
    hasMissingCustomNodes: missingCustomNodes.length > 0,
    hasMissingModels: Object.keys(missingModels).length > 0,
  };
}
