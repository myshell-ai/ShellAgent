export const COMFYUI_API = 'COMFYUI_API';

export const DEFAULT_COMFYUI_API =
  process.env.NEXT_PUBLIC_COMFYUI_API || 'https://comfyui.myshell.life/';

// postmessage type
export enum MessageType {
  LOAD = 'load', // load workflow
  LOAD_DEFAULT = 'load_default', // load default workflow
  SAVE = 'save', // save workflow
  LOADED = 'loaded', // comfyui loaded
}

export const FULL_SCREEN_MODAL_STYLES = {
  mask: {
    height: '100vh',
    width: '100vw',
    margin: 0,
    top: 0,
    paddingBottom: 0,
  },
  wrapper: {
    height: '100vh',
    width: '100vw',
    margin: 0,
    top: 0,
    paddingBottom: 0,
  },
  content: {
    padding: '6px 8px',
    height: '100vh',
    width: '100vw',
    margin: 0,
    top: 0,
    paddingBottom: 0,
  },
  body: {
    height: 'calc(100vh - 48px)',
    padding: 0,
    overflow: 'hidden',
  },
  footer: {
    marginTop: 0,
  },
};

export const DEFAULT_MODAL_STYLES = {
  content: {
    padding: '6px 8px',
  },
};

export const LOCATION_TIP =
  'The file must be a ShellAgent-extended ComfyUI JSON (.shellagent.json). To import a ComfyUI JSON, use ComfyUI-Manager.';
