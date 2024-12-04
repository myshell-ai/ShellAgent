import axios from 'axios';
import { inject, injectable } from 'inversify';
import { isEmpty } from 'lodash-es';
import { action, computed, makeObservable, observable } from 'mobx';

import { SettingsModel } from '@/components/settings/settings.model';
import { FormikModel } from '@/utils/formik.model';
import { ModalModel } from '@/utils/modal.model';
import { ToggleModel } from '@/utils/toggle.model';
import { ToastModel } from '@/utils/toast.model';
import { checkDependency, isValidUrl, pathJoin } from './comfyui-utils';
import {
  COMFYUI_API,
  DEFAULT_COMFYUI_API,
  MessageType,
} from '@/components/app/plugins/comfyui/constant';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { customSnakeCase } from '@shellagent/shared/utils';
import { duplicateComfyUI } from '@/stores/app/models/app-builder-utils';
import { type FieldInputProps } from 'formik';
import { getFile, saveComfy } from '@/components/app/plugins/comfyui/services';
import { type RefObject } from 'react';
import {
  SaveRequest,
  type SaveResponse,
} from '@/components/app/plugins/comfyui/services/type';
import mitt from 'mitt';

const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

export const locationTip =
  'The file must be a ShellAgent-extended ComfyUI JSON (.shellagent.json). To import a ComfyUI JSON, use ComfyUI-Manager.';

export type LocationFormType = {
  location?: string;
};

export enum EventType {
  UPDATE_FORM = 'UPDATE_FORM',
}

@injectable()
export class ComfyUIModel {
  @observable defaultLocation?: string = undefined;
  @observable messageDetail: string = '';
  @observable iframeError: string = '';
  @observable buttonName: 'Create in ComfyUI' | 'Edit in ComfyUI' =
    'Create in ComfyUI';
  @observable dependencies: SaveResponse['data']['dependencies'] | null = null;

  emitter = mitt<{
    customWarn: {
      message?: string;
      message_detail?: string;
    };
    [EventType.UPDATE_FORM]: {
      data: {
        inputs: Record<
          string,
          {
            title: string;
            type: string;
            default?: any;
            description: string;
          }
        >;
        outputs: Record<
          string,
          {
            title: string;
            type: string;
            items?: {
              type: string;
              url_type: string;
            };
          }
        >;
      };
      id: string;
    };
  }>();

  constructor(
    @inject(ModalModel) public iframeDialog: ModalModel,
    @inject('Factory<AppBuilderModel>')
    public appBuilderModelFactory: () => AppBuilderModel,
    @inject(FormikModel)
    public locationFormikSheet: FormikModel<LocationFormType>,
    @inject(FormikModel)
    public locationFormikModal: FormikModel<LocationFormType>,
    @inject(ModalModel) public locationFormDialog: ModalModel,
    @inject(ToggleModel) public fullscreen: ToggleModel,
    @inject(ToggleModel) public checkDialog: ToggleModel,
    @inject(ToggleModel) public loading: ToggleModel,
    @inject(ToggleModel) public loaded: ToggleModel,
    @inject(ToggleModel) public saveLoading: ToggleModel,
    @inject(ModalModel) public messageDetailModal: ModalModel,
    @inject(SettingsModel) public settings: SettingsModel,
    @inject(ToastModel) public toast: ToastModel,
  ) {
    makeObservable(this);
  }

  @computed
  get showSettingButton(): boolean {
    if (settingsDisabled) return false;
    return !isValidUrl(this.comfyUIUrl);
  }

  @computed
  get disabled(): boolean {
    return this.showSettingButton || this.loading.isOn || this.loaded.isOff;
  }

  @computed
  get comfyUIUrl() {
    if (settingsDisabled) {
      return DEFAULT_COMFYUI_API;
    }
    return this.settings.envs.get(COMFYUI_API) || '';
  }

  @action.bound
  setButtonName(location?: string) {
    if (isEmpty(location)) {
      this.buttonName = 'Create in ComfyUI';
    } else {
      this.buttonName = 'Edit in ComfyUI';
    }
  }

  @action.bound
  async onLocationBlur(
    model: FormikModel<LocationFormType>,
    type: 'modal' | 'sheet',
    field: FieldInputProps<string>,
  ) {
    this.setButtonName(field.value);
    await model.isReadyPromise;
    const formikProps = model.formikProps!;
    if (type === 'sheet') {
      const e = await this.checkLocationExists(field.value);
      formikProps.setFieldError('location', e);
    } else if (type === 'modal') {
      const e = this.checkLocation(field.value);
      formikProps.setFieldError('location', e);
    }
  }

  @action.bound
  showMessageDetail(detail?: string) {
    this.messageDetail = detail || '';
    this.messageDetailModal.open();
  }

  @action.bound
  setIframeError() {
    this.iframeError =
      'Failed to load ComfyUI. Please ensure the API URL correct.';
  }

  @action.bound
  async onLocationDialogOk(iframeRef: RefObject<HTMLIFrameElement>) {
    await this.locationFormikModal.isReadyPromise;
    await this.locationFormikModal.formikProps!.submitForm();
    this.locationFormDialog.close();

    iframeRef.current?.contentWindow?.postMessage(
      { type: MessageType.SAVE },
      this.comfyUIUrl,
    );
  }

  checkLocation(location?: string): string | undefined {
    if (isEmpty(location)) {
      return undefined;
    }
    if (location?.endsWith('.shellagent.json') === false) {
      return locationTip;
    }
    return undefined;
  }

  @action.bound
  async checkLocationExists(location?: string) {
    const error = this.checkLocation(location);
    if (!error) {
      if (location) {
        return this.checkJsonExists(location);
      }
    }
    return undefined;
  }

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
        return `The ShellAgent-extended ComfyUI JSON (.shellagent.json) doesn't exist`;
      } else {
        return undefined;
      }
    } catch (e) {
      return (e as Error).message;
    }
  }

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
        this.toast.error(`/api/get_cwd response is invalid`);
      }
    } catch (e) {
      this.toast.emitter.emit('message.error', (e as Error).message);
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
      await this.locationFormikModal.isReadyPromise;
      await this.locationFormikModal.formikProps!.setFieldValue(
        'location',
        `${this.defaultLocation}/${defaultName}.shellagent.json`,
      );
    } catch (e) {
      //
    }
  }

  async openIframeDialog(iframeRef: RefObject<HTMLIFrameElement>) {
    await this.locationFormikSheet.isReadyPromise;
    const { values, errors, setFieldError } =
      this.locationFormikSheet.formikProps!;
    const err = await this.checkLocationExists(values.location);
    if (!isEmpty(err)) {
      setFieldError('location', err);
      return;
    } else {
      setFieldError('location', undefined);
    }

    this.iframeDialog.open();

    if (errors.location == null) {
      if (values.location) {
        await this.getFile(values.location, iframeRef);
      } else {
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD_DEFAULT },
          this.comfyUIUrl,
        );
      }
    }
  }

  async getFile(location: string, iframeRef: RefObject<HTMLIFrameElement>) {
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
      if (result.success) {
        const { data } = result;
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD, data: data.workflow },
          this.comfyUIUrl,
        );
      } else {
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD_DEFAULT },
          this.comfyUIUrl,
        );
      }
    } catch (e) {
      this.toast.emitter.emit('message.error', (e as Error).message);
      throw e;
    }
  }

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
    } catch (e) {
      this.toast.error((e as Error).message);
      throw e;
    }
  }

  async submitLocationFormModal(location: string) {
    await this.locationFormikSheet.isReadyPromise;
    this.locationFormikSheet.formikProps!.values.location = location; // workaround: cannot update immediately
    this.locationFormikSheet.formikProps!.setFieldValue('location', location);
  }

  async getComfySchema(
    iframeRef: RefObject<HTMLIFrameElement>,
    comfy_workflow_id: string,
  ) {
    this.loaded.on();
    try {
      const result = await getFile({
        comfy_workflow_id,
        location: this.locationFormikSheet.formikProps?.values.location,
        filename: 'workflow.json',
      });
      console.log('ComfyUI loaded');
      if (result.success) {
        const { data } = result;
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD, data: data.workflow },
          this.comfyUIUrl,
        );
      } else {
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD_DEFAULT },
          this.comfyUIUrl,
        );
      }
    } catch (e) {
      iframeRef.current?.contentWindow?.postMessage(
        { type: MessageType.LOAD_DEFAULT },
        this.comfyUIUrl,
      );
    }
  }

  async saveComfyRequest(params: Omit<SaveRequest, 'location'>) {
    try {
      this.saveLoading.on();
      const result = await saveComfy({
        ...params,
        location: this.locationFormikSheet.formikProps?.values.location,
      });
      if (result.success) {
        const { data } = result;
        const { hasMissingCustomNodes, hasMissingModels } = checkDependency(
          data.dependencies,
        );
        if (hasMissingCustomNodes || hasMissingModels) {
          this.checkDialog.on();
          this.dependencies = data.dependencies;
        } else {
          this.iframeDialog.close();
          this.emitter.emit(EventType.UPDATE_FORM, {
            data: result.data.schemas,
            id: params.comfy_workflow_id,
          });
        }
        if (result.warning_message) {
          this.toast.warn(result.warning_message);
        }
      } else {
        this.emitter.emit('customWarn', {
          message: result?.message,
          message_detail: result?.message_detail,
        });
      }
    } catch (e) {
      //
    } finally {
      this.saveLoading.off();
    }
  }

  @action.bound
  handleMessage(
    iframeRef: RefObject<HTMLIFrameElement>,
    comfy_workflow_id: string,
    event: MessageEvent,
  ) {
    if (!this.comfyUIUrl) {
      return;
    }

    try {
      const valueUrl = new URL(this.comfyUIUrl);
      if (valueUrl.origin !== event.origin) return;

      switch (event.data.type) {
        case MessageType.LOADED:
          this.getComfySchema(iframeRef, comfy_workflow_id);
          break;
        case MessageType.SAVE:
          if (this.locationFormikSheet.formikProps?.values.location == null) {
            this.toast.error(
              'The file location of ShellAgent-extended ComfyUI JSON file is invalid',
            );
            return;
          }
          this.saveComfyRequest({
            prompt: event.data.prompt,
            comfyui_api: valueUrl.origin,
            workflow: event.data.workflow,
            name: event.data.name,
            comfy_workflow_id,
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Invalid URL:', error);
    }
  }

  @action.bound
  async handleSave(
    iframeRef: RefObject<HTMLIFrameElement>,
    parent: string | undefined,
    stateId: string,
    taskName: string,
  ) {
    if (isEmpty(this.locationFormikSheet.formikProps?.values.location)) {
      if (parent) {
        this.openLocationFormDialog(stateId, taskName);
        return;
      }
    }
    iframeRef.current?.contentWindow?.postMessage(
      { type: MessageType.SAVE },
      this.comfyUIUrl,
    );
  }

  @action.bound
  async reloadSettings(callback: (api: string) => void) {
    const settings = await this.settings.loadSettingsEnv();
    const api = settings?.envs?.find(env => env.key === COMFYUI_API)?.value;
    if (api && isValidUrl(api)) {
      callback(api);
      this.loading.on();
    } else {
      this.toast.error('Invalid ComfyUI API settings');
    }
  }
}
