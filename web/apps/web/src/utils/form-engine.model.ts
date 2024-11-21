import { injectable } from 'inversify';
import { type FormRef } from '@shellagent/ui';

@injectable()
export class FormEngineModel {
  isReadyPromise: Promise<unknown>;
  public formRef!: FormRef; // if undef throw error, fail fast
  private isReadyPromiseResolve: ((value: unknown) => void) | undefined;

  constructor() {
    this.isReadyPromise = new Promise(resolve => {
      this.isReadyPromiseResolve = resolve;
    });
  }

  setFormRef(formRef: FormRef) {
    this.formRef = formRef;
    this.isReadyPromiseResolve!('');
  }
}
