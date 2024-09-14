import axios from 'axios';
import type { FormikProps } from 'formik';
import { inject, injectable } from 'inversify';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import { EmitterModel } from '../../../../utils/emitter.model';

export type WidgetRecord = {
  local_commits_hash?: string[];
  remote_commit_hash: string;
  current_commit: string;
};

export function getInstallStatus(
  record: WidgetRecord,
): 'Install' | 'Update' | null {
  if (!record) return null;
  if (record.local_commits_hash?.indexOf(record.remote_commit_hash) === -1) {
    return 'Update';
  }
  return null;
}

@injectable()
export class WidgetsCommonModel {
  formikProps: FormikProps<any> | undefined;
  @observable installFromModalVisible = false;
  @observable insatallFromGitLoading = false;
  @observable installUpdateLoadingMap = new Map<string, boolean>();
  @observable uninstallLoadingMap = new Map<string, boolean>();
  @observable remoteVersionData: {
    tags: Record<string, string>;
    commits: Record<
      string,
      {
        author: string;
        date: string;
        message: string;
      }
    >;
  } = {
    tags: {},
    commits: {},
  };
  @observable remoteVersionQuery: string = '';

  constructor(@inject(EmitterModel) private emitter: EmitterModel) {
    makeObservable(this);
  }

  @computed get remoteList() {
    const tags = Object.keys(this.remoteVersionData.tags);
    const commits = Object.keys(this.remoteVersionData.commits);
    return [...tags, ...commits];
  }

  @action.bound
  onChangeRemoteVersionQuery(val: string) {
    this.remoteVersionQuery = val;
  }

  onRemoteVersionOpenChange(open: boolean, git: string) {
    if (open) {
      this.loadRemoteVersions(git, this.remoteVersionQuery);
    } else {
      this.remoteVersionQuery = '';
    }
  }

  async onInstallFromGitSubmit() {
    try {
      await this.formikProps?.submitForm();
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  @action.bound
  openInstallFromGitModal() {
    this.installFromModalVisible = true;
  }

  @action.bound
  closeInstallFromGitModal() {
    this.installFromModalVisible = false;
  }

  async installFromGit(values: any) {
    runInAction(() => {
      this.insatallFromGitLoading = true;
    });
    try {
      await axios.post('/api/widgets/marketplace/install_from_git', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
    runInAction(() => {
      this.insatallFromGitLoading = false;
    });
  }

  async loadRemoteVersions(git: string, query: string = '') {
    this.remoteVersionData = {
      tags: {},
      commits: {},
    };
    try {
      const res = await axios.post(
        '/api/widgets/get_remote_versions',
        {
          git,
          query,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (res?.data?.success) {
        runInAction(() => {
          this.remoteVersionData = res.data;
        });
      } else {
        this.emitter.emitter.emit('message.error', res.data.message);
      }
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  showUninstall(record: any): boolean {
    return record?.local_commits_hash?.length > 0;
  }

  getInstallStatus(record: any) {
    return getInstallStatus(record);
  }

  async installVersion(
    id: string,
    commit: string,
    loadData: () => Promise<void>,
  ) {
    if (this.remoteVersionData.tags[commit]) {
      commit = this.remoteVersionData.tags[commit];
    }
    runInAction(() => {
      this.installUpdateLoadingMap.set(id, true);
    });
    try {
      await axios.post(
        '/api/widgets/marketplace/install',
        {
          id,
          commit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      runInAction(() => {
        this.installUpdateLoadingMap.delete(id);
      });
      this.emitter.emitter.emit('message.success', 'Successfully installed');
      loadData();
    } catch (e: any) {
      runInAction(() => {
        this.installUpdateLoadingMap.delete(id);
      });
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  async unInstallVersion(
    id: string,
    commit: string | undefined,
    loadData: () => Promise<void>,
  ) {
    runInAction(() => {
      this.uninstallLoadingMap.set(id, true);
    });
    try {
      await axios.post(
        '/api/widgets/marketplace/uninstall',
        {
          id,
          commit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      runInAction(() => {
        this.uninstallLoadingMap.delete(id);
      });
      this.emitter.emitter.emit('message.success', 'Successfully uninstalled');
      loadData();
    } catch (e: any) {
      runInAction(() => {
        this.uninstallLoadingMap.delete(id);
      });
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  canUpdate(
    commit: string,
    record: WidgetRecord,
  ): 'can_update' | 'installed' | 'current' {
    commit = this.tagToCommit(commit);
    if (commit === record.current_commit) return 'current';
    if (
      Array.isArray(record.local_commits_hash) &&
      record.local_commits_hash.indexOf(commit) > -1
    )
      return 'installed';
    return 'can_update';
  }

  /**
   * 根据获取的 remoteVersionData 将 tag 转成 commit hash
   * @param commit 可能是 tag 形式 v1
   */
  tagToCommit(commit: string) {
    if (this.remoteVersionData.tags[commit]) {
      commit = this.remoteVersionData.tags[commit];
    }
    return commit;
  }
}
