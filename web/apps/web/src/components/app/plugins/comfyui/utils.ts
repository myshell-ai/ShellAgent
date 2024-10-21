import type { SaveResponse, UpdateDependencyRequest } from './services/type';

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
  data: SaveResponse['data']['dependencies'] | null,
) {
  const missingCustomNodes: UpdateDependencyRequest['missing_custom_nodes'] =
    [];
  const missingModels: UpdateDependencyRequest['missing_models'] = {};

  if (!data?.comfyui_version?.repo) {
    missingCustomNodes.push({
      ...(data?.comfyui_version || {
        name: 'ComfyUI',
        repo: '',
        commit: '',
      }),
      name: 'ComfyUI',
    });
  }

  // 检查custom_nodes的repo参数是否为空
  data?.custom_nodes?.forEach(node => {
    if (node?.require_recheck) {
      missingCustomNodes.push(node);
    }
  });

  // 检查models的urls是否为空
  Object.entries(data?.models || {}).forEach(([key, model]) => {
    if (model?.require_recheck) {
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

export function formatDependencyData2Form(
  data: Pick<
    UpdateDependencyRequest,
    'missing_custom_nodes' | 'missing_models'
  >,
) {
  return {
    ...data,
    missing_models: Object.entries(data.missing_models).map(([key, value]) => ({
      id: key,
      filename: value.filename,
      save_path: value.save_path,
      urls: value.urls,
    })),
  };
}

export function formatFormData2Dependency(
  data: ReturnType<typeof formatDependencyData2Form>,
) {
  return {
    ...data,
    missing_models: data.missing_models.reduce(
      (acc, curr) => {
        const { id, ...rest } = curr;
        acc[id] = rest;
        return acc;
      },
      {} as Record<string, UpdateDependencyRequest['missing_models'][string]>,
    ),
  };
}

export function generateHash() {
  return crypto.randomUUID().replace(/-/g, '');
}
