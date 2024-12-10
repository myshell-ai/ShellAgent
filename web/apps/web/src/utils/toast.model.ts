import { injectable, preDestroy } from 'inversify';
import mitt from 'mitt';

@injectable()
export class ToastModel {
  emitter = mitt<{
    'message.error': string;
    'message.success': string;
    'message.warn': string;
  }>();

  success(message: string): void {
    this.emitter.emit('message.success', message);
  }

  warn(message: string): void {
    this.emitter.emit('message.warn', message);
  }

  error(message: string): void {
    this.emitter.emit('message.error', message);
  }

  @preDestroy()
  public myPreDestroyMethod() {
    this.emitter.all.clear();
  }
}
