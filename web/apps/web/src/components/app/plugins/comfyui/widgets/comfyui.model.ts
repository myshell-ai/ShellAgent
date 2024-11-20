import { inject, injectable } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';
import { isEmpty } from 'lodash-es';
import { ModalModel } from '@/utils/modal.model.ts';
import { ToggleModel } from '@/utils/toggle.model.ts';
import { SettingsModel } from '@/components/settings/settings.model.ts';

@injectable()
export class ComfyUIModel {
  @observable location?: string = undefined;

  constructor(
    @inject(ModalModel) public iframeDialog: ModalModel,
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
}
