import axios from 'axios';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

import { WidgetsCommonModel } from './widgets-common.model';

export type ActionKey = 'Install' | 'Update' | 'Uninstall';

@injectable()
export class WidgetsMarketplaceModel {
  constructor(@inject(WidgetsCommonModel) public common: WidgetsCommonModel) {
    makeObservable(this);
  }

  @observable data: any[] = [];

  @observable keyword: string = '';

  async loadData() {
    const res = await axios.post(
      '/api/widgets/marketplace/list',
      {
        query: this.keyword.trim(),
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
    }
  }

  @action.bound
  changeKeyword(keyword: string) {
    this.keyword = keyword;
  }
}
