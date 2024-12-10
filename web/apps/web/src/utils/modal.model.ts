import { injectable } from 'inversify';
import { action, computed, makeObservable, observable } from 'mobx';

@injectable()
export class ModalModel {
  @observable isOpen: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @computed get isClosed() {
    return !this.isOpen;
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
