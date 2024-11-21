import { inject, injectable } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';
import { isEmpty } from 'lodash-es';
import { ModalModel } from '@/utils/modal.model.ts';
import { ToggleModel } from '@/utils/toggle.model.ts';
import { SettingsModel } from '@/components/settings/settings.model.ts';
import { FormikModel } from '@/utils/formik.model.ts';

export const LocTip =
  'The file must be a ShellAgent-extended ComfyUI JSON file with the .shellagent.json suffix.';

@injectable()
export class ComfyUIModel {
  @observable location?: string = undefined;
  @observable locErrorMsg?: string = undefined;

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

  checkLocation(loc?: string) {
    if (isEmpty(loc)) {
      return undefined;
    }
    if (loc?.endsWith('.shellagent.json') === false) {
      return LocTip;
    } else {
      return undefined;
    }
  }

  @action.bound
  checkLocation2() {
    this.locErrorMsg = this.checkLocation(this.location);
  }
}
