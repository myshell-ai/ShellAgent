import axios from 'axios';
import { FormikProps } from 'formik';
import { inject, injectable, postConstruct } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import { EmitterModel } from '@/utils/emitter.model';
import { ModalModel } from '@/utils/modal.model';

import {
  DefaultEnvs,
  DefaultEnvsMap,
  loadSettingEnvFormUrl,
  saveSettingEnvFormUrl,
  SettingEnvFormValue,
} from './settings-definitions';

export type SidebarValue = 'Environment' | 'SoftwareUpdate';

const formatEnvs2Form = (envs: SettingEnvFormValue['envs']) => {
  const keysMap = new Map(envs.map(item => [item.key, item]));
  const result = DefaultEnvs.map(
    ({ name }) => keysMap.get(name) || { key: name, value: '' },
  );
  envs.forEach(item => {
    if (!DefaultEnvsMap.has(item.key)) {
      result.push(item);
    }
  });
  return result;
};

const formatEnvs2Api = (envs: SettingEnvFormValue['envs']) => {
  return envs.map(({ key, value }) => {
    // HTTPS_PROXY / HTTPS_PROXYS
    if (key === 'HTTPS_PROXY') {
      value = envs.find(env => env.key === 'HTTP_PROXY')?.value || '';
    }
    return {
      key: key.trim(),
      value: value.trim(),
    };
  });
};

@injectable()
export class SettingsModel {
  isFormikReadyPromise: Promise<unknown>;
  @observable sidebar?: SidebarValue = undefined;
  @observable isAutoCheck = true;
  @observable isAutoCheckLoading = false;
  @observable isBetaCheck = true;
  @observable isBetaCheckLoading = false;
  @observable isChecking = false;
  @observable isUpdating = false;
  @observable checkedStatus: 'newUpdate' | 'latest' | null = null;
  @observable isToRestart = false;
  @observable isRestarting = false;
  @observable isLoadLoading = false;
  @observable checkRet: Partial<{
    has_new_stable: true;
    target_release_date: string;
    current_version: string;
    latest_tag_name: string;
    changelog: string;
  }> = {};
  @observable lastChecktime = '';
  @observable envs: Map<string, string> = new Map();
  private isFormikReadyPromiseResolve: ((value: unknown) => void) | undefined;
  private formikProps: FormikProps<any> | undefined;

  constructor(
    @inject(EmitterModel) private emitter: EmitterModel,
    @inject(ModalModel) public modal: ModalModel,
    @inject(ModalModel) public changelogModal: ModalModel,
  ) {
    makeObservable(this);

    this.isFormikReadyPromise = new Promise(resolve => {
      this.isFormikReadyPromiseResolve = resolve;
    });
  }

  @postConstruct()
  init() {
    this.loadSettingsEnv(); // @joe compatible
  }

  @action.bound
  autoCheck() {
    if (this.isAutoCheck) {
      this.checkNow();
    }
  }

  @action.bound
  setSidebar(v: SidebarValue) {
    // onBlur + leave and save
    if (this.sidebar === 'Environment') {
      this.formikProps?.submitForm();
    }
    this.sidebar = v;
  }

  setFormikProps(formikProps: FormikProps<any>) {
    this.formikProps = formikProps;
    this.isFormikReadyPromiseResolve!('');
  }

  async loadSettingsEnvAndFillForm() {
    const values = await this.loadSettingsEnv();
    await this.isFormikReadyPromise;
    this.formikProps?.setValues(values);
  }

  @action.bound
  async getLastChecktime() {
    try {
      const res = await axios.get(`/api/last_check_time`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.lastChecktime = res.data.last_check_time;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  @action.bound
  async getAutoCheck() {
    if (process.env.NEXT_PUBLIC_DISABLE_SOFTWARE_UPDATE === 'yes') {
      return false;
    }
    try {
      const res = await axios.get(`/api/auto_update`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.isAutoCheck = res.data.auto_update;
      return this.isAutoCheck;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
      return false;
    }
  }

  @action.bound
  async getIsBetaCheck() {
    if (process.env.NEXT_PUBLIC_DISABLE_SOFTWARE_UPDATE === 'yes') {
      return false;
    }
    try {
      const res = await axios.get(`/api/update_channel`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.isBetaCheck = res.data.update_channel !== 'stable';
      return this.isBetaCheck;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
      return false;
    }
  }

  @action.bound
  async setBetaCheck(isBetaCheck: boolean) {
    try {
      this.isBetaCheckLoading = true;
      await axios.post(
        `/api/update_channel`,
        {
          update_channel: isBetaCheck ? 'next' : 'stable',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.isBetaCheck = isBetaCheck;
      this.checkedStatus = null;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    } finally {
      this.isBetaCheckLoading = false;
    }
  }

  @action.bound
  async setAutoCheck(isAutoCheck: boolean) {
    try {
      this.isAutoCheckLoading = true;
      await axios.post(
        `/api/auto_update`,
        {
          auto_update: isAutoCheck,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.isAutoCheck = isAutoCheck;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    } finally {
      this.isAutoCheckLoading = false;
    }
  }

  @action.bound
  async checkNow() {
    try {
      this.isChecking = true;
      const res = await axios.get(`/api/check_repo_status`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.checkRet = res.data;

      if (this.checkRet.has_new_stable) {
        this.checkedStatus = 'newUpdate';
      } else {
        this.checkedStatus = 'latest';
        this.getLastChecktime();
      }
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    } finally {
      this.isChecking = false;
    }
  }

  @action.bound
  async getCurrentVersion() {
    try {
      const res = await axios.get(`/api/check_repo_status`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.checkRet.current_version = res.data.current_version;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  @action.bound
  async restart() {
    this.isRestarting = true;
    await axios.get(`/api/restart`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const pollInterval = 3000;
    const poll = async () => {
      try {
        await this.getLastChecktime();
        this.emitter.emitter.emit(
          'message.success',
          'Server restarted successfully, the web UI will reload automatically in 15s..',
        );
        this.isRestarting = false;
        setTimeout(() => window.location.reload(), 15000);
      } catch (e: any) {
        // noop
      } finally {
        setTimeout(poll, pollInterval);
      }
    };
    poll();
  }

  @action.bound
  async updateNow() {
    try {
      this.isUpdating = true;
      await axios.get(`/api/update`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.isToRestart = true;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    } finally {
      this.isUpdating = false;
    }
  }

  async loadSettingsEnv() {
    const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';
    if (settingsDisabled) return null;
    this.isLoadLoading = true;
    try {
      const res = await axios.get<SettingEnvFormValue>(loadSettingEnvFormUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const ret: any = res.data;
      this.envs = new Map();
      const envs = formatEnvs2Form(ret?.envs);
      envs.forEach((item: any) => {
        this.envs.set(item.key, item.value);
      });
      this.isLoadLoading = false;
      return {
        ...res.data,
        envs,
      };
    } catch (e: any) {
      this.isLoadLoading = false;
      this.emitter.emitter.emit('message.error', e.message);
      return null;
    }
  }

  async saveSettingsEnv(value: any) {
    try {
      this.envs = new Map();
      value?.envs.forEach((item: any) => {
        this.envs.set(item.key, item.value);
      });
      await axios.post(
        saveSettingEnvFormUrl,
        {
          ...value,
          envs: formatEnvs2Api(value.envs),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  @action.bound
  openChangelog() {
    this.modal.close();
    this.changelogModal.open();
  }

  @action.bound
  closeChangelog() {
    this.changelogModal.close();
    this.modal.open();
  }

  @action.bound
  onClickChangelogUpdateNow() {
    this.closeChangelog();
    this.updateNow();
  }
}
