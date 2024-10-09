import { inject, injectable } from 'inversify';
import { EmitterModel } from '@/utils/emitter.model';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class ImageCanvasModel {
  @observable isOpen = false;

  constructor(@inject(EmitterModel) private emitter: EmitterModel) {
    makeObservable(this);
  }

  @action.bound
  open() {
    this.isOpen = true;
  }

  @action.bound
  close() {
    this.isOpen = false;
  }
}
