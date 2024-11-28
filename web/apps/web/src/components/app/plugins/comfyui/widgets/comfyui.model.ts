import axios from 'axios';
import { inject, injectable, type interfaces } from 'inversify';
import { isEmpty } from 'lodash-es';
import { action, computed, makeObservable, observable } from 'mobx';

import { SettingsModel } from '@/components/settings/settings.model';
import { FormEngineModel } from '@/utils/form-engine.model';
import { FormikModel } from '@/utils/formik.model';
import { ModalModel } from '@/utils/modal.model';
import { ToggleModel } from '@/utils/toggle.model';
import { EmitterModel } from '@/utils/emitter.model';
import { pathJoin } from './comfyui.utils';
import {
  COMFYUI_API,
  DEFAULT_COMFYUI_API,
  MessageType,
} from '@/components/app/plugins/comfyui/constant';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model.ts';
import { customSnakeCase } from '@shellagent/shared/utils';
import { duplicateComfyUI } from '@/stores/app/models/app-builder-utils';

const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

export const LocTip =
  'The file must be a ShellAgent-extended ComfyUI JSON (.shellagent.json). To import a ComfyUI JSON, use ComfyUI-Manager.';

export type LocationFormType = {
  location?: string;
};

@injectable()
export class ComfyUIModel {
  // TODO: use formik
  @observable location?: string = undefined;
  @observable locationTemp?: string = undefined;
  @observable locErrorMsg?: string = undefined;
  @observable defaultLocation?: string = undefined;

  constructor(
    @inject(ModalModel) public iframeDialog: ModalModel,
    @inject('Factory<AppBuilderModel>')
    public appBuilderModelFactory: () => AppBuilderModel,
    @inject(FormikModel)
    public locationFormFormik: FormikModel<LocationFormType>,
    @inject(FormEngineModel) public formRef: FormEngineModel,
    @inject(ModalModel) public locationFormDialog: ModalModel,
    @inject(ToggleModel) public fullscreen: ToggleModel,
    @inject(SettingsModel) public settings: SettingsModel,
    @inject(EmitterModel) public emitter: EmitterModel,
  ) {
    makeObservable(this);
  }

  @computed
  get buttonDisabled(): boolean {
    return this.location != null && this.locErrorMsg != null;
  }

  @computed
  get buttonName() {
    if (isEmpty(this.location)) {
      return 'Create in ComfyUI';
    }
    return 'Edit in ComfyUI';
  }

  @action.bound
  async setLocation(location?: string) {
    this.location = location;
    this.locationTemp = location;
    await this.updateFormRefForAutomataMerge(location);
  }

  async updateFormRefForAutomataMerge(location?: string) {
    await this.formRef.isReadyPromise;
    this.formRef.formRef.setValue('location', location);
    // this.formRef.formRef.setValue('comfy_workflow_id', undefined);
  }

  @action.bound
  setLocationTemp(location?: string) {
    this.locationTemp = location;
  }

  @action.bound
  async onLocationDialogOk() {
    await this.locationFormFormik.isReadyPromise;
    await this.locationFormFormik.formikProps.submitForm();
    this.locationFormDialog.close();
  }

  @action.bound
  submitLocationDialog() {
    const loc = this.locationFormFormik.formikProps.values.location;
    this.setLocation(loc);
  }

  checkLocation(loc?: string) {
    if (isEmpty(loc)) {
      return undefined;
    }
    if (loc?.endsWith('.shellagent.json') === false) {
      return LocTip;
    }
    return undefined;
  }

  @action.bound
  async checkLocation2() {
    this.locErrorMsg = this.checkLocation(this.locationTemp);
    if (!this.locErrorMsg) {
      await this.setLocation(this.locationTemp);
      if (this.location) {
        await this.checkJsonExists(this.location);
      }
    }
  }

  @action.bound
  async checkJsonExists(location: string) {
    try {
      const res = await axios.post(
        `/api/comfyui/check_json_exist`,
        {
          location,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!res.data.success) {
        this.locErrorMsg = `The ShellAgent-extended ComfyUI JSON (.shellagent.json) doesn't exist`;
      }
    } catch (e: any) {
      this.locErrorMsg = e.message;
    }
  }

  @action.bound
  async getCwd() {
    try {
      const res = await axios.get(`/api/get_cwd`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (typeof res.data.cwd === 'string') {
        this.defaultLocation = pathJoin([res.data.cwd, 'data/comfy_workflow']);
      } else {
        this.emitter.emitter.emit(
          'message.error',
          `/api/get_cwd response is invalid`,
        );
      }
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
      throw e;
    }
  }

  async handleDuplicateState(newId: string, nodeData: any) {
    await this.getCwd();
    if (this.defaultLocation) {
      return duplicateComfyUI(
        this.defaultLocation,
        this.appBuilderModelFactory().metadata.name,
        newId,
        nodeData,
      );
    }
    return nodeData;
  }

  async openLocationFormDialog(stateName: string, taskName: string) {
    const appName = this.appBuilderModelFactory().metadata.name;
    this.locationFormDialog.open();
    const defaultName = customSnakeCase(`${appName}_${stateName}_${taskName}`);
    try {
      await this.getCwd();
      await this.locationFormFormik.isReadyPromise;
      await this.locationFormFormik.formikProps.setFieldValue(
        'location',
        `${this.defaultLocation}/${defaultName}.shellagent.json`,
      );
    } catch (e: any) {
      //
    }
  }

  @action.bound
  async openIframeDialog(iframeRef: any) {
    await this.checkLocation2();
    this.iframeDialog.open();
    if (this.locErrorMsg == null) {
      if (this.location) {
        await this.getFile(this.location, iframeRef);
      } else {
        const value = this.getComfyUIUrl();
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD_DEFAULT },
          value,
        );
      }
    }
  }

  @action.bound
  async getFile(location: string, iframeRef: any) {
    try {
      const res = await axios.post(
        `/api/comfyui/get_file`,
        {
          location,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const result = res.data;
      const value = this.getComfyUIUrl();
      if (result.success) {
        const { data } = result;
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD, data: data.workflow },
          value,
        );
      } else {
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD_DEFAULT },
          value,
        );
      }
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
      throw e;
    }
  }

  getComfyUIUrl() {
    if (settingsDisabled) {
      return DEFAULT_COMFYUI_API;
    }
    return this.settings.envs.get(COMFYUI_API) || '';
  }
}
