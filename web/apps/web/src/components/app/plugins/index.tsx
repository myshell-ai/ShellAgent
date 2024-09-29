import React from 'react';
import ComfyUIPlugin from './comfyui';
import { WidgetConfigProps } from '@/components/app/config-form/widget-config';

const pluginMap = new Map<string, React.FC<WidgetConfigProps>>();

const registerPlugin = (
  name: string,
  component: React.FC<WidgetConfigProps>,
) => {
  if (!pluginMap.has(name)) {
    pluginMap.set(name, component);
  }
};

const getPlugin = (name: string): React.FC<WidgetConfigProps> => {
  return pluginMap.get(name) as React.FC<WidgetConfigProps>;
};

registerPlugin('ComfyUIWidget', ComfyUIPlugin);

export { registerPlugin, getPlugin, pluginMap };
