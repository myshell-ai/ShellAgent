import { injectable } from 'inversify';
import { type FormikProps } from 'formik';

@injectable()
export class FormikModel {
  isFormikReadyPromise: Promise<unknown>;
  public formikProps!: FormikProps<any>; // if undef throw error, fail fast
  private isFormikReadyPromiseResolve: ((value: unknown) => void) | undefined;

  constructor() {
    this.isFormikReadyPromise = new Promise(resolve => {
      this.isFormikReadyPromiseResolve = resolve;
    });
  }

  setFormikProps(formikProps: FormikProps<any>) {
    this.formikProps = formikProps;
    this.isFormikReadyPromiseResolve!('');
  }
}
