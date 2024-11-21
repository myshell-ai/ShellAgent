import { type FormikProps } from 'formik';
import { injectable } from 'inversify';

@injectable()
export class FormikModel<T> {
  isReadyPromise: Promise<unknown>;
  public formikProps!: FormikProps<T>; // if undef throw error, fail fast
  private isReadyPromiseResolve: ((value: unknown) => void) | undefined;

  constructor() {
    this.isReadyPromise = new Promise(resolve => {
      this.isReadyPromiseResolve = resolve;
    });
  }

  setFormikProps(formikProps: FormikProps<any>) {
    this.formikProps = formikProps;
    this.isReadyPromiseResolve!('');
  }
}
