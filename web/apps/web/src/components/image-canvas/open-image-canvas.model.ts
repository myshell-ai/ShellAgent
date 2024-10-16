import { type ImageCanvasModel } from 'image-canvas/model';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import { EmitterModel } from '@/utils/emitter.model';

@injectable()
export class OpenImageCanvasModel {
  @observable isOpen = false;
  fieldProps: any;
  getValues: any;

  constructor(
    @inject(EmitterModel) private emitter: EmitterModel,
    @inject('ImageCanvasModel') public imageCanvas: ImageCanvasModel,
  ) {
    makeObservable(this);
  }

  onEffect(fieldProps: any, getValues: any, options: any[]) {
    this.fieldProps = fieldProps;
    this.getValues = getValues;
    this.imageCanvas.setVariables(options);
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
  async openAndLoad() {
    this.open();
    const values = this.getValues();
    const jsonStr = values.inputs?.config;
    if (jsonStr === undefined) {
      // await this.imageCanvas.loadFromJSON(null);
    } else if (jsonStr === '') {
      // await this.imageCanvas.loadFromJSON(null);
    } else {
      try {
        const json = JSON.parse(jsonStr);
        console.log('openAndLoad', json);
        await this.imageCanvas.loadFromJSON(json);
      } catch (e: any) {
        this.emitter.emitter.emit('message.error', e.message);
      }
    }
  }

  @action.bound
  async saveAndClose() {
    const json = await this.imageCanvas.canvas2Json();
    console.log('saveAndClose', json);
    const jsonStr = JSON.stringify(json);
    // set form field(config)
    this.fieldProps.onChange(jsonStr);
    this.close();
  }
}
