import { ISchema, TValues } from '@shellagent/form-engine';
import { isEmpty } from 'lodash-es';

import { ENABLE_MIME } from '@/utils/file-types';

const getSchemaByInputs = (inputs: TValues): ISchema => {
  const properties: { [key: string]: ISchema } = {};
  Object.keys(inputs || {}).reduce<{ [key: string]: ISchema }>((prev, key) => {
    const { description, name, type, value } = inputs[key];
    const defaultValue = value || inputs[key].default_value;
    switch (type) {
      case 'audio':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.audio,
          },
        };
        break;
      case 'image':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.image,
          },
        };
        break;
      default:
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-type': 'Control',
          'x-component': 'Textarea',
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

export { getSchemaByInputs };
