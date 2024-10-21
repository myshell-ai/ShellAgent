import axios from 'axios';
import { FormikProps } from 'formik';
import { inject, injectable, postConstruct } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import { EmitterModel } from '@/utils/emitter.model';
import { ModalModel } from '@/utils/modal.model';

import {
  loadSettingEnvFormUrl,
  saveSettingEnvFormUrl,
  SettingEnvFormValue,
} from './settings-definitions';

export type SidebarValue = 'Environment' | 'SoftwareUpdate';

@injectable()
export class SettingsModel {
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
    this.loadSettingsEnv();
  }

  isFormikReadyPromise: Promise<unknown>;

  private isFormikReadyPromiseResolve: ((value: unknown) => void) | undefined;

  private formikProps: FormikProps<any> | undefined;

  @observable sidebar: SidebarValue =
    process.env.NEXT_PUBLIC_DISABLE_SOFTWARE_UPDATE === 'yes'
      ? 'Environment'
      : 'SoftwareUpdate';

  @observable isAutoCheck = true;

  @observable isAutoCheckLoading = false;

  @observable isChecking = false;

  @observable isUpdating = false;

  @observable checkedStatus: 'newUpdate' | 'latest' | null = null;

  @observable isToRestart = false;

  @observable isRestarting = false;

  @observable checkRet: Partial<{
    has_new_stable: true;
    target_release_date: string;
    current_version: string;
    latest_tag_name: string;
    changelog: string;
  }> = {};

  @observable lastChecktime = '';

  @action.bound
  autoCheck() {
    if (this.isAutoCheck) {
      this.checkNow();
    }
  }

  @observable envs: Map<string, string> = new Map();

  @action.bound
  setSidebar(v: SidebarValue) {
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
    if (process.env.NEXT_PUBLIC_DISABLE_SOFTWARE_UPDATE === 'yes') return;
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
      return null;
    }
  }

  @action.bound
  async setAutoCheck(isAutoCheck: boolean) {
    try {
      this.isAutoCheckLoading = true;
      const res = await axios.post(
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
    const res = await axios.get(`/api/restart`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const pollInterval = 3000;
    const poll = async () => {
      try {
        this.getLastChecktime();
        this.isRestarting = false;
        window.location.reload();
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
      const res = await axios.get(`/api/update/stable`, {
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
    try {
      const res = await axios.get<SettingEnvFormValue>(loadSettingEnvFormUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const ret: any = res.data;
      ret?.envs.forEach((item: any) => {
        this.envs.set(item.key, item.value);
      });
      return res.data;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
      return null;
    }
  }

  async saveSettingsEnv(value: any) {
    try {
      value?.envs.forEach((item: any) => {
        this.envs.set(item.key, item.value);
      });
      await axios.post(saveSettingEnvFormUrl, value, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
