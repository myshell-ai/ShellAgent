import axios from 'axios';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

import { url_models_installed_list } from '@/components/manager/manager-definitions';
import { SettingsModel } from '@/components/settings/settings.model';
import { EmitterModel } from '@/utils/emitter.model';

import { ModelsCommonModel } from './models-common.model';

@injectable()
export class ModelsInstalledModel {
  @observable data: any[] = [];
  @observable keyword: string = '';
  @observable loadingData: boolean = false;

  constructor(
    @inject(ModelsCommonModel) public common: ModelsCommonModel,
    @inject(EmitterModel) public emitter: EmitterModel,
    @inject(SettingsModel) private settings: SettingsModel,
  ) {
    makeObservable(this);
  }

  @action.bound
  setCheckedType(val: string) {
    this.common.setCheckedType(val);
    this.loadData();
  }

  @action.bound
  setCheckedBase(val: string) {
    this.common.setCheckedBase(val);
    this.loadData();
  }

  async loadData() {
    runInAction(() => {
      this.loadingData = true;
    });
    const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';
    let location;
    if (settingsDisabled) {
      location = 'models';
    } else {
      const settingsEnv = await this.settings.loadSettingsEnv();
      location = settingsEnv?.model_location;
    }

    if (location == null) {
      this.emitter.emitter.emit(
        'message.error',
        `model_location is null ${
          settingsDisabled ? '' : ' ,go to Settings to set a value'
        }`,
      );
    }
    try {
      const res = await axios.post(
        url_models_installed_list,
        {
          base:
            this.common.checkedBase === 'All' ? '' : this.common.checkedBase,
          save_path:
            this.common.checkedSavePath === 'All'
              ? ''
              : this.common.checkedSavePath,
          query: this.keyword,
          location,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (res?.data?.success) {
        runInAction(() => {
          this.data = res.data.data;
        });
      } else {
        this.emitter.emitter.emit('message.error', `load data error`);
      }
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    } finally {
      runInAction(() => {
        this.loadingData = false;
      });
    }
  }

  @action.bound
  changeKeyword(keyword: string) {
    this.keyword = keyword;
  }
}
