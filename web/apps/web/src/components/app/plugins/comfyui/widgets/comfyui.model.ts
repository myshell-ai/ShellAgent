import axios from 'axios';
import { inject, injectable } from 'inversify';
import { isEmpty } from 'lodash-es';
import { action, computed, makeObservable, observable } from 'mobx';

import { SettingsModel } from '@/components/settings/settings.model';
import { FormEngineModel } from '@/utils/form-engine.model';
import { FormikModel } from '@/utils/formik.model';
import { ModalModel } from '@/utils/modal.model';
import { ToggleModel } from '@/utils/toggle.model';

export const LocTip =
  'The file must be a ShellAgent-extended ComfyUI JSON file with the .shellagent.json suffix.';

export type LocationFormType = {
  location?: string;
};

@injectable()
export class ComfyUIModel {
  // TODO: use formik
  @observable location?: string = undefined;
  @observable locationTemp?: string = undefined;
  @observable locErrorMsg?: string = undefined;

  constructor(
    @inject(ModalModel) public iframeDialog: ModalModel,
    @inject(FormikModel)
    public locationFormFormik: FormikModel<LocationFormType>,
    @inject(FormEngineModel) public formRef: FormEngineModel,
    @inject(ModalModel) public locationFormDialog: ModalModel,
    @inject(ToggleModel) public fullscreen: ToggleModel,
    @inject(SettingsModel) public settings: SettingsModel,
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
    await this.formRef.isReadyPromise;
    this.formRef.formRef.setValue('location', location);
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
  checkLocation2() {
    this.locErrorMsg = this.checkLocation(this.locationTemp);
    if (!this.locErrorMsg) {
      this.setLocation(this.locationTemp);
      if (this.location) {
        this.checkJsonExists(this.location);
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
        this.locErrorMsg = `The ShellAgent-extended ComfyUI JSON file is not valid`;
      }
    } catch (e: any) {
      this.locErrorMsg = e.message;
    }
  }
}
