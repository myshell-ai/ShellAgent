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
