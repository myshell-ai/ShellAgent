import { type ImageCanvasModel } from 'image-canvas/model';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import { EmitterModel } from '@/utils/emitter.model';

@injectable()
export class OpenImageCanvasModel {
  @observable isOpen = false;
  fieldProps: any;

  constructor(
    @inject(EmitterModel) private emitter: EmitterModel,
    @inject('ImageCanvasModel') public imageCanvas: ImageCanvasModel,
  ) {
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

  @action.bound
  openAndLoad() {
    this.open();
    const json = this.fieldProps.value;
    console.log('openAndLoad', json);
    this.imageCanvas.loadFromJSON(json);
  }

  @action.bound
  async saveAndClose() {
    const json = await this.imageCanvas.canvas2Json();
    // set form field(config)
    console.log('saveAndClose', json);
    this.fieldProps.onChange(json);
    this.close();
  }
}
