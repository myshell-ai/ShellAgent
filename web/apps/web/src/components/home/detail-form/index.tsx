import { ISchema, MemoizedFormEngine, TValues } from '@shellagent/form-engine';
import { Input, Textarea } from '@shellagent/ui';
import React from 'react';

interface DetailFormProps {
  type: 'app' | 'workflow';
  values: TValues;
  onChange: (values: TValues) => void;
}

export default function DetailForm({
  type,
  values,
  onChange,
}: DetailFormProps) {
  const schema: ISchema = {
    type: 'object',
    'x-type': 'Block',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        'x-type': 'Control',
        'x-layout': 'Vertical',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: `Please fill in the name of ${type}.`,
        },
        'x-validator': [
          {
            required: true,
            message: `Please fill in the name of ${type}.`,
          },
        ],
      },
      description: {
        type: 'string',
        title: 'Description',
        'x-type': 'Control',
        'x-layout': 'Vertical',
        'x-component': 'Textarea',
        'x-component-props': {
          placeholder: `Please fill in the description of ${type}.`,
        },
      },
    },
  };
  return (
    <MemoizedFormEngine
      onChange={onChange}
      mode="onChange"
      values={values}
      schema={schema}
      components={{
        Input,
        Textarea,
      }}
    />
  );
}
