import { ISchema } from '@shellagent/form-engine';
const schema: ISchema = {
  type: 'object',
  'x-type': 'Section',
  'x-title-copiable': false,
  properties: {
    api: {
      type: 'string',
      title: 'api',
      'x-layout': 'Vertical',
      'x-type': 'Control',
      'x-component': 'Input',
      'x-title-size': 'h4',
    },
    input: {
      type: 'string',
      title: 'Input',
      'x-layout': 'Vertical',
      'x-type': 'Control',
      'x-component': 'Input',
      'x-title-size': 'h4',
    },
    outputs: {
      type: 'object',
      title: 'Output',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-raw': true,
      properties: {
        display: {
          type: 'string',
          // default: types,
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

export default schema;
