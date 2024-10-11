export const COMFYUI_API = 'COMFYUI_API';

export const DEFAULT_COMFYUI_API =
  process.env.NEXT_PUBLIC_COMFYUI_API || 'https://comfyui-test.myshell.life/';

// postmessage type
export enum MessageType {
  LOAD = 'load', // load workflow
  LOAD_DEFAULT = 'load_default', // load default workflow
  SAVE = 'save', // save workflow
  LOADED = 'loaded', // comfyui loaded
}
