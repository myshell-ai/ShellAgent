import { injectable } from 'inversify';
import { type FormikProps } from 'formik';

@injectable()
export class FormikModel {
  isFormikReadyPromise: Promise<unknown>;
  public formikProps: FormikProps<any> | undefined;
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
