export const loadSettingEnvFormUrl = '/api/settings/env/load'; // GET POST
export const saveSettingEnvFormUrl = '/api/settings/env/save'; // POST

// start-SettingEnvFormValue
export type SettingEnvFormValue = {
  model_location: string;
  envs: Array<{
    key: string;
    value: string;
  }>;
};
// stop-SettingEnvFormValue

export const DefaultEnvs = [
  {
    label: 'MyShell API Key',
    name: 'MYSHELL_API_KEY',
    tooltip: 'You may generate it in MyShell - Settings - API Key.',
  },
  {
    label: 'OpenAI API Key',
    name: 'OPENAI_API_KEY',
  },
  {
    label: 'ComfyUI Address',
    name: 'COMFYUI_API',
    tooltip:
      'ComfyUI server address such as http://127.0.0.1:8188. Supports remote address.',
  },
  {
    label: 'Proxy',
    name: 'HTTP_PROXY',
    tooltip: 'Including HTTP_PROXY and HTTPS_PROXY.',
  },
  {
    label: 'Proxy',
    name: 'HTTPS_PROXY',
    tooltip: 'Including HTTP_PROXY and HTTPS_PROXY.',
    hidden: true,
  },
];
