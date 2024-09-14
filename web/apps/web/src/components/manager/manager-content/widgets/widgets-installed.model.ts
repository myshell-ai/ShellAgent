import axios from 'axios';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

import { WidgetsCommonModel } from './widgets-common.model';
import { EmitterModel } from '../../../../utils/emitter.model';

export type ActionKey = 'Install' | 'Update' | 'Uninstall';

@injectable()
export class WidgetsInstalledModel {
  @observable data: any[] = [];
  @observable keyword: string = '';
  @observable enableLoadingMap = new Map<string, boolean>();

  constructor(
    @inject(WidgetsCommonModel) public common: WidgetsCommonModel,
    @inject(EmitterModel) private emitter: EmitterModel,
  ) {
    makeObservable(this);
  }

  async loadData() {
    const res = await axios.post(
      '/api/widgets/installed/list',
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

  isDisabled(id: string, type: 'install' | 'uninstall' | 'enable') {
    if (type === 'install') {
      return (
        this.common.uninstallLoadingMap.has(id) || this.enableLoadingMap.has(id)
      );
    }
    if (type === 'uninstall') {
      return (
        this.common.installUpdateLoadingMap.has(id) ||
        this.enableLoadingMap.has(id)
      );
    }
    if (type === 'enable') {
      return (
        this.common.uninstallLoadingMap.has(id) ||
        this.common.installUpdateLoadingMap.has(id)
      );
    }
    return false;
  }

  async setEnableStatus(id: string, enabled: boolean) {
    runInAction(() => {
      this.enableLoadingMap.set(id, true);
    });
    try {
      await axios.post(
        '/api/widgets/installed/set_widget_status',
        {
          id,
          enabled,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.emitter.emitter.emit(
        'message.success',
        enabled ? 'Successfully enabled' : 'Successfully disabled',
      );
      runInAction(() => {
        this.enableLoadingMap.delete(id);
      });
      this.loadData();
    } catch (e: any) {
      runInAction(() => {
        this.enableLoadingMap.delete(id);
      });
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  async setCurrent(id: string, current_commit: string) {
    runInAction(() => {
      this.common.installUpdateLoadingMap.set(id, true);
    });
    try {
      await axios.post(
        '/api/widgets/installed/set_widget_status',
        {
          id,
          current_commit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      runInAction(() => {
        this.common.installUpdateLoadingMap.delete(id);
      });
      this.emitter.emitter.emit(
        'message.success',
        'Successfully set as current version',
      );
      this.loadData();
    } catch (e: any) {
      runInAction(() => {
        this.common.installUpdateLoadingMap.delete(id);
      });
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  @action.bound
  changeKeyword(keyword: string) {
    this.keyword = keyword;
  }

  canSetCurrent(record: any, item: string) {
    return this.isInstalled(record, item) && !this.isCurrent(record, item);
  }

  isInstalled(record: any, item: string) {
    let commit = item;
    if (this.common.remoteVersionData.tags[item]) {
      commit = this.common.remoteVersionData.tags[item];
    }
    const installed = record?.local_commits_hash?.includes(commit);
    return installed;
  }

  isCurrent(record: any, item: string) {
    let commit = item;
    if (this.common.remoteVersionData.tags[item]) {
      commit = this.common.remoteVersionData.tags[item];
    }
    return commit === record.current_commit;
  }
}
