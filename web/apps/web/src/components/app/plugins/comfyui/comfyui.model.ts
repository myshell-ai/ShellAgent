import { customSnakeCase } from '@shellagent/shared/utils';
import axios from 'axios';
import { inject, injectable } from 'inversify';
import { isEmpty, merge, omit } from 'lodash-es';
import mitt from 'mitt';
import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { type RefObject } from 'react';

import {
  COMFYUI_API,
  DEFAULT_COMFYUI_API,
  LOCATION_TIP,
  MessageType,
} from '@/components/app/plugins/comfyui/constant';
import { getFile, saveComfy } from '@/components/app/plugins/comfyui/services';
import {
  type SaveRequest,
  type SaveResponse,
} from '@/components/app/plugins/comfyui/services/type';
import { SettingsModel } from '@/components/settings/settings.model';
import { duplicateComfyUI } from '@/stores/app/models/app-builder-utils';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { FormikModel } from '@/utils/formik.model';
import { ModalModel } from '@/utils/modal.model';
import { ToastModel } from '@/utils/toast.model';
import { ToggleModel } from '@/utils/toggle.model';
import { checkDependency, isValidUrl, pathJoin } from './comfyui-utils';
import {
  getDefaultValueBySchema,
  type ISchema,
  TValues,
} from '@shellagent/form-engine';
import {
  defaultSchema,
  getComfyUISchema,
} from '@/components/app/plugins/comfyui/schema';
import { FormEngineModel } from '@/utils/form-engine.model';

const SETTING_DISABLED = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

export type LocationFormType = {
  location: string;
  name: string;
  stateId: string;
  parent: string;
};

@injectable()
export class ComfyUIModel {
  @observable defaultLocation?: string = undefined;
  @observable messageDetail: string = '';
  @observable iframeError: string = '';
  @observable dependencies: SaveResponse['data']['dependencies'] | null = null;
  @observable currentSchema: ISchema = defaultSchema;

  // Use observable + formik enableReinitialize to control form
  // directly use formikProps values to get intermediate value (not sure the value is latest)
  @observable currentFormData: Partial<LocationFormType> = {};

  handlers: Partial<{
    onChange: (values: any) => void;
  }> = {};

  emitter = mitt<{
    warmWithDetail: {
      message?: string;
      message_detail?: string;
    };
  }>();

  constructor(
    @inject(ModalModel) public iframeDialog: ModalModel,
    @inject('Factory<AppBuilderModel>')
    public appBuilderModelFactory: () => AppBuilderModel,
    @inject(FormikModel)
    public locationFormikSheet: FormikModel<Partial<LocationFormType>>,
    @inject(FormikModel)
    public locationFormikModal: FormikModel<Partial<LocationFormType>>,
    @inject(FormEngineModel) public formEngineModel: FormEngineModel,
    @inject(ModalModel) public locationFormDialog: ModalModel,
    @inject(ToggleModel) public fullscreen: ToggleModel,
    @inject(ToggleModel) public checkDialog: ToggleModel,
    @inject(ToggleModel) public iframeLoading: ToggleModel,
    @inject(ToggleModel) public getSchemaLoading: ToggleModel,
    @inject(ToggleModel) public saveLoading: ToggleModel,
    @inject(ModalModel) public messageDetailModal: ModalModel,
    @inject(SettingsModel) public settings: SettingsModel,
    @inject(ToastModel) public toast: ToastModel,
  ) {
    makeObservable(this);
  }

  @computed
  get showSettingButton(): boolean {
    if (SETTING_DISABLED) return false;
    return !isValidUrl(this.comfyUIUrl);
  }

  @computed
  get saveBtnDisabled(): boolean {
    return (
      this.showSettingButton ||
      this.iframeLoading.isOn ||
      this.getSchemaLoading.isOn
    );
  }

  @computed
  get comfyUIUrl() {
    if (SETTING_DISABLED) {
      return DEFAULT_COMFYUI_API;
    }
    return this.settings.envs.get(COMFYUI_API) || '';
  }

  @computed
  get buttonName() {
    if (isEmpty(this.currentFormData.location)) {
      return 'Create in ComfyUI';
    } else {
      return 'Edit in ComfyUI';
    }
  }

  @action.bound
  setCurrentSchema(schema: ISchema): void {
    this.currentSchema = schema;
  }

  async validateLocation(type: 'modal' | 'sheet', value?: string) {
    if (type === 'sheet') {
      const e = await this.checkLocationExists(value);
      return e;
    } else if (type === 'modal') {
      const e = this.checkLocation(value);
      return e;
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

  @action.bound
  checkLocation(location?: string): string | undefined {
    if (isEmpty(location)) {
      return undefined;
    }
    if (location?.trim() !== location) {
      return `Please remove spaces from the beginning and end of the path.`;
    }
    if (location?.endsWith('.shellagent.json') === false) {
      return LOCATION_TIP;
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
    return error;
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
        return `The ShellAgent-extended ComfyUI JSON (.shellagent.json) doesn't exist`;
      }
      return undefined;
    } catch (e) {
      return (e as Error).message;
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
        this.toast.error(`/api/get_cwd response is invalid`);
      }
    } catch (e) {
      this.toast.emitter.emit('message.error', (e as Error).message);
      throw e;
    }
  }

  @action.bound
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

  @action.bound
  async openLocationFormDialog() {
    const appName = this.appBuilderModelFactory().metadata.name;
    this.locationFormDialog.open();
    const defaultName = customSnakeCase(
      `${appName}_${this.currentFormData.stateId}_${this.currentFormData.name}`,
    );
    try {
      await this.getCwd();
      await this.locationFormikModal.isReadyPromise;
      const formikProps = this.locationFormikModal.formikProps!;
      await formikProps.setFieldValue(
        'location',
        `${this.defaultLocation}/${defaultName}.shellagent.json`,
      );
    } catch (e) {
      // noop
    }
  }

  @action.bound
  closeIframeDialog() {
    this.iframeDialog.close();
  }

  @action.bound
  async openIframeDialog() {
    await this.locationFormikSheet.isReadyPromise;
    const { values, setFieldError } = this.locationFormikSheet.formikProps!;
    const err = await this.checkLocationExists(values.location);
    if (!isEmpty(err)) {
      setFieldError('location', err);
      return;
    }
    setFieldError('location', undefined);
    this.iframeDialog.open();
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
    } catch (e) {
      this.toast.error((e as Error).message);
      throw e;
    }
  }

  @action.bound
  async loadCurrentSchema(location?: string) {
    if (location == null) {
      this.currentSchema = defaultSchema;
      return;
    }

    this.getSchemaLoading.on();
    try {
      const result = await getFile({
        location,
        filename: 'workflow.json',
      });
      if (result.success) {
        const data = result.data.schemas;
        this.setCurrentSchema(
          getComfyUISchema({
            inputs: data?.inputs || {},
            outputs: data?.outputs || {},
          }),
        );
      } else {
        // noop
      }
    } catch (e) {
      this.toast.error((e as Error).message);
    } finally {
      this.getSchemaLoading.off();
    }
  }

  @action.bound
  async getComfySchema(iframeRef: RefObject<HTMLIFrameElement>) {
    if (this.currentFormData.location == null) {
      iframeRef.current?.contentWindow?.postMessage(
        { type: MessageType.LOAD_DEFAULT },
        this.comfyUIUrl,
      );
      return;
    }

    this.getSchemaLoading.on();
    try {
      const result = await getFile({
        location: this.currentFormData.location,
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
    } finally {
      this.getSchemaLoading.off();
    }
  }

  @action.bound
  async saveComfyRequest(params: SaveRequest) {
    try {
      this.saveLoading.on();
      const result = await saveComfy(params);
      if (result.success) {
        const { data } = result;
        const { hasMissingCustomNodes, hasMissingModels } = checkDependency(
          data.dependencies,
        );
        if (hasMissingCustomNodes || hasMissingModels) {
          this.checkDialog.on();
          this.dependencies = data.dependencies;
        } else {
          this.closeIframeDialog();
          const data = result.data.schemas;
          this.setCurrentSchema(
            getComfyUISchema({
              inputs: data?.inputs || {},
              outputs: data?.outputs || {},
            }),
          );
          this.currentFormData.location = params.location;
          // todo: (see comfyui-editor) add a temp form value to communicate with modal and sheet form
          this.setValuesAfterSchemaChange();
        }
        if (result.warning_message) {
          this.toast.warn(result.warning_message);
        }
      } else {
        this.emitter.emit('warmWithDetail', {
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
  async handleMessage(
    iframeRef: RefObject<HTMLIFrameElement>,
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
          this.getComfySchema(iframeRef);
          break;
        case MessageType.SAVE:
          // TODO: amend to use separate modal form location
          if (isEmpty(this.currentFormData.location)) {
            this.toast.error(
              'The file location of ShellAgent-extended ComfyUI JSON file is invalid',
            );
            return;
          }
          const location = this.currentFormData.location!;
          await this.saveComfyRequest({
            prompt: event.data.prompt,
            comfyui_api: valueUrl.origin,
            workflow: event.data.workflow,
            name: event.data.name,
            location,
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
  async handleSave(iframeRef: RefObject<HTMLIFrameElement>) {
    if (isEmpty(this.currentFormData.location)) {
      this.openLocationFormDialog();
      return;
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
      this.iframeLoading.on();
    } else {
      this.toast.error('Invalid ComfyUI API settings');
    }
  }

  setValuesAfterSchemaChange() {
    const defaultValues = getDefaultValueBySchema(
      toJS(this.currentSchema),
      false,
    );
    // TODO move stateId parent out of form data
    const newValues = omit(toJS(this.currentFormData), ['stateId', 'parent']);
    const values = mergeValues(defaultValues, {
      ...newValues,
      api: this.comfyUIUrl, // Always retrieve api from settings
    });
    this.handlers.onChange!(values);
  }
}

const mergeValues = (formValues: TValues, newValues?: TValues) => {
  const result = {
    ...merge({}, formValues, newValues),
    inputs: isEmpty(formValues?.inputs)
      ? newValues?.inputs
      : Object.keys(formValues?.inputs || {})?.reduce((prev, key) => {
          prev[key] = newValues?.inputs?.[key] || formValues?.inputs?.[key];
          return prev;
        }, {} as any),
    outputs: !isEmpty(formValues?.outputs?.display)
      ? formValues?.outputs
      : newValues?.outputs,
  };
  return result;
};
