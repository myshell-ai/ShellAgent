import { Field, type FieldProps, type FieldValidator } from 'formik';
import { Form } from 'antd';
import React from 'react';

export interface FormItemFieldProps {
  name: string;
  validate?: FieldValidator;
  children: (field: FieldProps) => JSX.Element;

  label: string;
  tooltip?: string;
}

/**
 * A simple compound as a wrapper of Formik field and Antd Form.Item
 */
export const FormItemField = (props: FormItemFieldProps) => {
  const { name, validate, label, tooltip, children } = props;
  return (
    <Field name={name} validate={validate}>
      {(fieldProps: FieldProps) => {
        const { meta } = fieldProps;
        return (
          <Form.Item
            label={label}
            colon={false}
            tooltip={tooltip}
            help={meta.error}
            validateStatus={
              meta.touched && meta.error != null ? 'error' : undefined
            }>
            {children(fieldProps)}
          </Form.Item>
        );
      }}
    </Field>
  );
};
