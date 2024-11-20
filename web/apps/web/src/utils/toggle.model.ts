import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class ToggleModel {
  @observable isOn: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  toggle() {
    this.isOn = !this.isOn;
  }

  @action.bound
  on() {
    this.isOn = true;
  }

  @action.bound
  off() {
    this.isOn = false;
  }
}
