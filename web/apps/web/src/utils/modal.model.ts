import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class ModalModel {
  constructor() {
    makeObservable(this);
  }

  @observable isOpen: boolean = false;

  @action.bound
  open() {
    this.isOpen = true;
  }

  @action.bound
  close() {
    this.isOpen = false;
  }
}
