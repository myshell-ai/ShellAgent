import type { SaveResponse, UpdateDependencyRequest } from './services/type';
import SHA256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';

export function isValidUrl(url: string) {
  if (!url) {
    return false;
  }
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

  // 检查comfyui_version的repo参数是否为空
  if (data?.comfyui_version?.require_recheck) {
    missingCustomNodes.push(data?.comfyui_version);
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
      urls: value.urls.length ? value.urls : [''],
    })),
  };
}

export function formatFormData2Dependency(
  data: ReturnType<typeof formatDependencyData2Form>,
) {
  return {
    ...data,
    missing_models: data?.missing_models?.reduce(
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
  if (
    typeof window !== 'undefined' &&
    window.crypto &&
    typeof window.crypto.randomUUID === 'function'
  ) {
    return window.crypto.randomUUID().replace(/-/g, '');
  } else {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString();
    const data = timestamp + random;
    const hash = SHA256(data);
    return hash.toString(encHex).slice(0, 32);
  }
}
