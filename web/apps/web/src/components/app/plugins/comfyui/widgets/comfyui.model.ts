import { inject, injectable } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';
import { isEmpty } from 'lodash-es';
import { ModalModel } from '@/utils/modal.model.ts';
import { ToggleModel } from '@/utils/toggle.model.ts';
import { SettingsModel } from '@/components/settings/settings.model.ts';
import { FormikModel } from '@/utils/formik.model.ts';

@injectable()
export class ComfyUIModel {
  @observable location?: string = undefined;

  constructor(
    @inject(ModalModel) public iframeDialog: ModalModel,
    @inject(FormikModel) public locationFormFormik: FormikModel,
    @inject(ModalModel) public locationFormDialog: ModalModel,
    @inject(ToggleModel) public fullscreen: ToggleModel,
    @inject(SettingsModel) public settings: SettingsModel,
  ) {
    makeObservable(this);
  }

  @computed
  get buttonName() {
    if (isEmpty(this.location)) {
      return 'Create in ComfyUI';
    } else {
      return 'Edit in ComfyUI';
    }
  }

  @action.bound
  setLocation(location: string) {
    this.location = location;
  }

  @action.bound
  async onLocationDialogOk() {
    await this.locationFormFormik.isFormikReadyPromise;
    await this.locationFormFormik.formikProps.submitForm();
    this.locationFormDialog.close();
  }

  @action.bound
  submitLocationDialog() {
    this.location = this.locationFormFormik.formikProps.values['location'];
  }
}
