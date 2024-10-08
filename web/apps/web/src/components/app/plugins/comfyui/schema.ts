import { ISchema, TValues } from '@shellagent/form-engine';

import { getSchemaByInputs } from '@/stores/app/utils/get-workflow-schema';

export const defaultSchema: ISchema = {
  type: 'object',
  'x-type': 'Section',
  'x-title-copiable': false,
  properties: {
    api: {
      type: 'string',
      'x-layout': 'Vertical',
      'x-type': 'Block',
      'x-component': 'ComfyUIEditor',
      'x-title-size': 'h4',
    },
    comfy_workflow_id: {
      type: 'string',
      'x-component': 'Input',
      'x-type': 'Control',
      'x-title-size': 'h4',
      'x-hidden': true,
    },
  },
};

export const getComfyuiSchema = ({
  inputs = {},
  outputs = {},
}: {
  inputs: TValues;
  outputs: TValues;
}): ISchema => {
  const types = Object.keys(outputs || {}).reduce<{ [key: string]: any }>(
    (acc, key) => {
      const { title, type, items } = outputs[key];
      if (type === 'array' && items) {
        acc[title] = {
          type: items.type,
          url_type: items.url_type,
        };
      } else {
        acc[title] = type;
      }
      return acc;
    },
    {},
  );

  return {
    type: 'object',
    'x-type': 'Section',
    'x-title-copiable': false,
    properties: {
      api: {
        type: 'string',
        'x-layout': 'Vertical',
        'x-type': 'Block',
        'x-component': 'ComfyUIEditor',
        'x-title-size': 'h4',
      },
      comfy_workflow_id: {
        type: 'string',
        'x-component': 'Input',
        'x-type': 'Control',
        'x-title-size': 'h4',
        'x-hidden': true,
      },
      inputs: getSchemaByInputs(inputs),
      outputs: {
        type: 'object',
        title: 'Output',
        'x-type': 'Block',
        'x-title-size': 'h4',
        'x-raw': true,
        properties: {
          display: {
            type: 'string',
            default: types,
            'x-type': 'Control',
            'x-component': 'JSONView',
            'x-component-props': {
              hiddenName: true,
            },
          },
        },
      },
    },
  };
};
