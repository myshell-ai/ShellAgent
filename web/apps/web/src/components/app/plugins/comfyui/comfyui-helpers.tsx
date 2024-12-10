import { FieldValidator } from 'formik/dist/types';
import { Field, FieldProps } from 'formik';
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
  return (
    <Field name={props.name} validate={props.validate}>
      {(fieldProps: FieldProps) => {
        const { meta } = fieldProps;
        return (
          <Form.Item
            label={props.label}
            colon={false}
            tooltip={props.tooltip}
            help={meta.error}
            validateStatus={
              meta.touched && meta.error != null ? 'error' : undefined
            }>
            {props.children(fieldProps)}
          </Form.Item>
        );
      }}
    </Field>
  );
};
