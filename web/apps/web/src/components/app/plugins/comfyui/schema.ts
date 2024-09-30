import { ISchema } from '@shellagent/form-engine';

const schema: ISchema = {
  type: 'object',
  'x-type': 'Section',
  'x-title-copiable': false,
  properties: {
    api: {
      type: 'object',
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
      'x-reactions': [
        {
          target: 'inputs',
          when: '$this.value !== ""',
          fullfill: {
            schema: {
              'x-hidden': false,
            },
          },
        },
        {
          target: 'outputs',
          when: '$this.value !== ""',
          fullfill: {
            schema: {
              'x-hidden': false,
            },
          },
        },
      ],
    },
    inputs: {
      type: 'string',
      title: 'Input',
      'x-layout': 'Vertical',
      'x-type': 'Control',
      'x-component': 'Input',
      'x-title-size': 'h4',
      'x-hidden': true,
    },
    outputs: {
      type: 'object',
      title: 'Output',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-raw': true,
      'x-hidden': true,
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
