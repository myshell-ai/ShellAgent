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

export type SidebarValue = 'Environment';

@injectable()
export class SettingsModel {
  constructor(
    @inject(EmitterModel) private emitter: EmitterModel,
    @inject(ModalModel) public modal: ModalModel,
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

  @observable sidebar: SidebarValue = 'Environment';

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
}
