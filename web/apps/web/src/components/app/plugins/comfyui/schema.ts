import { ISchema, TValues } from '@shellagent/form-engine';
import { isEmpty } from 'lodash-es';
import { ENABLE_MIME } from '@/utils/file-types';

export const getSchemaByInputs = (inputs: TValues): ISchema => {
  const properties: { [key: string]: ISchema } = {};
  Object.keys(inputs || {}).reduce<{ [key: string]: ISchema }>((prev, key) => {
    const { description, type, value, choices, title } = inputs[key];
    const defaultValue = value || inputs[key].default_value;
    switch (type) {
      case 'audio':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-raw': true,
          // 'x-raw-default': 'ref',
          'x-component-props': {
            accept: ENABLE_MIME.audio,
          },
        };
        break;
      case 'image':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-raw': true,
          // 'x-raw-default': 'ref',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.image,
          },
        };
        break;
      case 'video':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.video,
          },
        };
        break;
      case 'text_file':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.other,
          },
        };
        break;
      case 'file':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.all,
          },
        };
        break;
      default:
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title,
          description,
          'x-layout': 'Vertical',
          'x-raw': true,
          'x-raw-default': 'ref',
          'x-type': 'Control',
          'x-component': 'Textarea',
          'x-title-size': 'h4',
        };
    }

    /// 只有text类型下有enum
    if (choices?.length) {
      prev[key] = {
        type: 'string',
        default: defaultValue,
        title,
        description,
        'x-raw': true,
        'x-component': 'Select',
        'x-component-props': {
          triggerClassName: 'h-7',
          options: choices.map(({ value }: { value: string }) => ({
            label: value,
            value,
          })),
        },
        'x-onchange-prop-name': 'onValueChange',
        // 'x-layout': 'Vertical',
        'x-type': 'Control',
        'x-title-size': 'h4',
      };
    }

    return prev;
  }, properties);

  if (isEmpty(properties)) {
    return {
      type: 'object',
      title: 'Input',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-empty': {
        text: 'No input is required.',
      },
    };
  }

  return {
    type: 'object',
    title: 'Input',
    'x-title-size': 'h4',
    properties: {
      ...properties,
    },
    'x-type': 'Block',
  };
};

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
