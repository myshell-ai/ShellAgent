import React from 'react';
import ComfyUIPlugin from './comfyui';

const pluginMap = new Map<string, React.FC>();

const registerPlugin = (name: string, component: React.FC) => {
  if (!pluginMap.has(name)) {
    pluginMap.set(name, component);
  }
};

const getPlugin = (name: string): React.FC | undefined => {
  return pluginMap.get(name);
};

registerPlugin('ComfyUIWidget', ComfyUIPlugin);

export { registerPlugin, getPlugin, pluginMap };
