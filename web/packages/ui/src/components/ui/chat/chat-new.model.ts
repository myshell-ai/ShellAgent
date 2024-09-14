import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';
import { ChatModuleType } from './interfaces/chatModuleType';
import { ChatNewModelHandlers } from './interfaces/chatNewModelHandlers';
import { ChatNewModelInnerMethods } from './interfaces/chatNewModelInnerMethods';

@injectable()
export class ChatNewModel {
  isReadyPromise: Promise<unknown>;
  isReadyPromiseResolve: ((value: unknown) => void) | undefined;
  testType = 'bot' as ChatModuleType;
  testUserId = 'test-app-builder';
  testEntity = {
    id: 'test-app-builder',
    name: 'App Builder',
    energyPerChat: 5,
  };
  handlers: Partial<ChatNewModelHandlers> = {};
  innerMethods: Partial<ChatNewModelInnerMethods> = {};
  @observable imAudioDisabled = true;
  @observable imTextDisabled = true;
  @observable imUploadDisabled = true;

  constructor() {
    makeObservable(this);
    this.isReadyPromise = new Promise(resolve => {
      this.isReadyPromiseResolve = resolve;
    });
  }

  @action.bound
  disableIMUpload() {
    this.imUploadDisabled = true;
  }

  @action.bound
  enableIMUpload() {
    this.imUploadDisabled = false;
  }

  @action.bound
  disableIMText() {
    this.imTextDisabled = true;
  }

  @action.bound
  enableIMText() {
    this.imTextDisabled = false;
  }

  @action.bound
  disableIMAudio() {
    this.imAudioDisabled = true;
  }

  @action.bound
  enableIMAudio() {
    this.imAudioDisabled = false;
  }
}
