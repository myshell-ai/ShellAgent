import axios from 'axios';
import { inject, injectable } from 'inversify';
import { isEmpty } from 'lodash-es';
import { action, computed, makeObservable, observable } from 'mobx';

import { SettingsModel } from '@/components/settings/settings.model';
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
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
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
  // @observable location?: string = undefined;
  // TODO: use formik
  @observable locationTemp?: string = undefined;
  @observable locErrorMsg?: string = undefined;
  @observable defaultLocation?: string = undefined;

  constructor(
    @inject(ModalModel) public iframeDialog: ModalModel,
    @inject('Factory<AppBuilderModel>')
    public appBuilderModelFactory: () => AppBuilderModel,
    @inject(FormikModel)
    public locationFormFormik: FormikModel<LocationFormType>,
    @inject(ModalModel) public locationFormDialog: ModalModel,
    @inject(ToggleModel) public fullscreen: ToggleModel,
    @inject(SettingsModel) public settings: SettingsModel,
    @inject(EmitterModel) public emitter: EmitterModel,
  ) {
    makeObservable(this);
  }

  @computed
  get buttonDisabled(): boolean {
    return this.locationTemp != null && this.locErrorMsg != null;
  }

  @computed
  get buttonName() {
    if (isEmpty(this.locationTemp)) {
      return 'Create in ComfyUI';
    }
    return 'Edit in ComfyUI';
  }

  @action.bound
  async setLocation(stateId: string, taskName: string, location?: string) {
    this.appBuilderModelFactory().nodeData[stateId].blocks.map((b: any) => {
      if (b.name === taskName) {
        b.location = location;
      }
      return b;
    });
    this.locationTemp = location;
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
  submitLocationDialog(stateId: string, taskName: string) {
    const loc = this.locationFormFormik.formikProps.values.location;
    this.setLocation(stateId, taskName, loc);
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
      await this.setLocationTemp(this.locationTemp);
      if (this.locationTemp) {
        await this.checkJsonExists(this.locationTemp);
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

  async handleDuplicateState(newId: string, data: any) {
    await this.getCwd();
    if (this.defaultLocation) {
      const { nodeData, locations } = duplicateComfyUI(
        this.defaultLocation,
        this.appBuilderModelFactory().metadata.name,
        newId,
        data,
      );
      await Promise.all(
        locations.map(loc => {
          return this.duplicateComfyUIExtendedJson(loc.from, loc.to);
        }),
      );
      return nodeData;
    }
    return data;
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
      if (this.locationTemp) {
        await this.getFile(this.locationTemp, iframeRef);
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

  @action.bound
  async duplicateComfyUIExtendedJson(location: string, location_new: string) {
    try {
      await axios.post(
        `/api/comfyui/update_dependency`,
        {
          location,
          location_new, // this param will duplicate a json from location
          missing_custom_nodes: [],
          missing_models: {},
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
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
