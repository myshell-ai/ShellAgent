import axios from 'axios';
import { inject, injectable } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';
import { z } from 'zod';

import {
  ModelsMarketPlaceItem,
  ModelsMarketPlaceRes,
  url_models_marketplace_list,
} from '@/components/manager/manager-definitions';
import { ToastModel } from '@/utils/toast.model';
import { RequestModel } from '@/utils/request.model';

import { ModelsCommonModel } from './models-common.model';

@injectable()
export class ModelsMarketplaceModel {
  @observable data: z.infer<typeof ModelsMarketPlaceItem>[] = [];
  @observable keyword: string = '';
  @observable selectedIds: string[] = [];

  constructor(
    @inject(ToastModel) private emitter: ToastModel,
    @inject(RequestModel) public loadData: RequestModel<unknown>,
    @inject(ModelsCommonModel) public common: ModelsCommonModel,
  ) {
    makeObservable(this);
    this.loadData.handlers = {
      requestFunc: (requestId, abortController) => {
        return axios.post(url_models_marketplace_list, this.requestBody, {
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
      onsuccess: data => {
        const result = ModelsMarketPlaceRes.parse(data);
        if (result.success) {
          this.data = result.data;
        } else {
          this.emitter.emitter.emit('message.error', result.message);
        }
      },
      onerror: e => {
        this.emitter.emitter.emit('message.error', e.message);
      },
    };
  }

  @computed get requestBody() {
    return {
      base: this.common.checkedBase === 'All' ? '' : this.common.checkedBase,
      type: this.common.checkedType === 'All' ? '' : this.common.checkedType,
      query: this.keyword,
    };
  }

  @action.bound
  setCheckedType(val: string) {
    this.common.setCheckedType(val);
    this.loadData.request();
  }

  @action.bound
  setCheckedBase(val: string) {
    this.common.setCheckedBase(val);
    this.loadData.request();
  }

  @action.bound
  changeKeyword(keyword: string) {
    this.keyword = keyword;
  }

  @action.bound
  isRowCheckboxDisabled(record: any) {
    return record.install_status !== 'not_installed';
  }

  @action.bound
  setSelectedIds(ids: string[]) {
    this.selectedIds = ids;
  }
}
