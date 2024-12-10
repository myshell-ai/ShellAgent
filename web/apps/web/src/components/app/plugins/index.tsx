import React from 'react';

import { CommonWidgetConfigProps } from '@/components/app/config-form/widget-config';

import { ComfyUIPlugin } from './comfyui';

const pluginMap = new Map<string, React.FC<CommonWidgetConfigProps>>();

const registerPlugin = (
  name: string,
  component: React.FC<CommonWidgetConfigProps>,
) => {
  if (!pluginMap.has(name)) {
    pluginMap.set(name, component);
  }
};

const getPlugin = (name: string): React.FC<CommonWidgetConfigProps> => {
  return pluginMap.get(name) as React.FC<CommonWidgetConfigProps>;
};

registerPlugin('ComfyUIWidget', ComfyUIPlugin);

export { registerPlugin, getPlugin, pluginMap };
