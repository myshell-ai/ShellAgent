import {
  EventSourceMessage,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import axios from 'axios';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';
import { z } from 'zod';

import {
  DownloadingModelItem,
  DownloadModelListRes,
  url_download_center_list,
} from '@/components/download/download-definitions';
import { url_models_marketplace_install } from '@/components/manager/manager-definitions';
import { EmitterModel } from '@/utils/emitter.model';
import { ModalModel } from '@/utils/modal.model';

@injectable()
export class DownloadModel {
  @observable downloadingModels: z.infer<typeof DownloadingModelItem>[] = [];
  @observable completedModels: any[] = [];
  @observable tab: 'downloading' | 'completed' = 'downloading';
  @observable progressMap = new Map<string, number>();
  progressAbortCtrl = new AbortController();

  constructor(
    @inject(EmitterModel) private emitter: EmitterModel,
    @inject(ModalModel) public drawer: ModalModel,
  ) {
    makeObservable(this);
  }

  @action.bound
  setTab(tab: 'downloading' | 'completed') {
    this.tab = tab;
  }

  async forceInstall(id: string) {
    try {
      await axios.post(
        url_models_marketplace_install,
        { id, force: true },
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

  async getProgress() {
    this.progressAbortCtrl.abort();
    this.progressAbortCtrl = new AbortController();
    fetchEventSource('/api/download-center/get_downloading_models_progress', {
      method: 'POST',
      mode: 'cors',
      headers: {
        method: 'POST',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      signal: this.progressAbortCtrl.signal,
      openWhenHidden: true,
      onerror: err => {
        this.emitter.emitter.emit('message.error', err.message);
      },
      onmessage: (ev: EventSourceMessage) => {
        if (ev.event === 'download_start') {
          this.getDownloadingModels();
        }
        if (ev.event === 'download_end') {
          this.getDownloadingModels();
        }
        if (ev.event === 'downloading') {
          try {
            const data = JSON.parse(ev.data);
            this.progressMap.set(data.input.model_id, data.output.progress);
          } catch (e: any) {
            this.emitter.emitter.emit('message.error', e.message);
          }
        }
      },
      onopen: async () => {
        //
      },
    });
  }

  async getDownloadingModels() {
    try {
      const res = await axios.post(
        url_download_center_list,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.downloadingModels = DownloadModelListRes.parse(res.data).models;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  async getCompletedModels() {
    try {
      const res = await axios.post(
        '/api/download-center/get_completed_models',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.completedModels = res.data.models;
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  async cancelDownload(cachePath: string) {
    try {
      await axios.post(
        '/api/models/cancel_download',
        {
          cache_path: cachePath,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.emitter.emitter.emit('message.success', 'Successfully cancelled.');
      this.getDownloadingModels();
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }
}
