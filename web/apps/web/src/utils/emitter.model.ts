import { injectable, preDestroy } from 'inversify';
import mitt from 'mitt';

@injectable()
export class EmitterModel {
  emitter = mitt<{
    'message.error': string;
    'message.success': string;
  }>();

  @preDestroy()
  public myPreDestroyMethod() {
    this.emitter.all.clear();
  }
}
