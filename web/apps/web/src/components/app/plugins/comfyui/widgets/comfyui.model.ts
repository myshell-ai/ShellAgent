import { inject, injectable } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';
import { isEmpty } from 'lodash-es';
import { ModalModel } from '@/utils/modal.model.ts';

@injectable()
export class ComfyUIModel {
  @observable location?: string = undefined;

  constructor(@inject(ModalModel) public iframeDialog: ModalModel) {
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
