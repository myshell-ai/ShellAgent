import axios from 'axios';
import { FormikProps } from 'formik';
import { inject, injectable } from 'inversify';
import { debounce, DebouncedFunc } from 'lodash-es';
import { action, makeObservable, observable, runInAction } from 'mobx';

import { url_models_marketplace_install } from '@/components/manager/manager-definitions';
import { ModalModel } from '@/utils/modal.model';

import { ToastModel } from '../../../../utils/toast.model';

@injectable()
export class ModelsCommonModel {
  formikProps: FormikProps<any> | undefined;
  @observable types = [];
  @observable bases = [];
  @observable save_paths = [];
  @observable installLoadingMap = new Map<string, boolean>();
  @observable uninstallLoadingMap = new Map<string, boolean>();
  @observable checkedType = 'All';
  @observable checkedBase = 'All';
  @observable checkedSavePath = 'All';
  debouneFunc: DebouncedFunc<any>;

  constructor(
    @inject(ToastModel) private emitter: ToastModel,
    @inject(ModalModel) public installFromModal: ModalModel,
  ) {
    makeObservable(this);
    this.debouneFunc = debounce(
      () => {
        this.emitter.emitter.emit(
          'message.success',
          'Add to installed queue. Please see the progress in download center',
        );
      },
      5000,
      {
        leading: true,
        trailing: false,
      },
    );
  }

  @action.bound
  setCheckedType(val: string) {
    this.checkedType = val;
  }

  @action.bound
  setCheckedSavePath(val: string) {
    this.checkedSavePath = val;
  }

  @action.bound
  setCheckedBase(val: string) {
    this.checkedBase = val;
  }

  async loadTypeBaseList() {
    try {
      const res = await axios.post(
        '/api/models/marketplace/types_bases_lists',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      runInAction(() => {
        this.types = res.data.types;
        this.bases = res.data.bases;
        this.save_paths = res.data.save_paths;
      });
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  async installFromLink(values: any) {
    try {
      await axios.post('/api/models/marketplace/install_from_link', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.emitter.emitter.emit(
        'message.success',
        'Add to installed queue. Please see the progress in download center',
      );
      this.installFromModal.close();
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  async batchInstall(ids: string[], loadData: () => Promise<void>) {
    ids.forEach(id => this.install(id, loadData));
  }

  async install(id: string, loadData: () => Promise<void>) {
    try {
      this.installLoadingMap.set(id, true);
      try {
        await axios.post(
          url_models_marketplace_install,
          { id },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        loadData();
      } catch (e: any) {
        this.emitter.emitter.emit('message.error', e.message);
      } finally {
        this.installLoadingMap.delete(id);
      }
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    }
  }

  async unInstall(idList: string[], loadData: () => Promise<void>) {
    try {
      idList.forEach(id => {
        runInAction(() => {
          this.uninstallLoadingMap.set(id, true);
        });
      });
      await axios.post(
        '/api/models/marketplace/batch_uninstall',
        {
          id_list: idList,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      this.emitter.emitter.emit('message.success', 'Successfully uninstalled');
      loadData();
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    } finally {
      idList.forEach(id => {
        runInAction(() => {
          this.uninstallLoadingMap.delete(id);
        });
      });
    }
  }

  async onSubmit() {
    try {
      await this.formikProps?.submitForm();
    } catch (error) {
      //
    }
  }
}
