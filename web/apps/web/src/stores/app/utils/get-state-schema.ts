import { ISchema } from '@shellagent/form-engine';

export const getStateSchema = (name: string): ISchema => {
  return {
    title: name,
    type: 'object',
    'x-type': 'Section',
    'x-title-size': 'h4',
    'x-title-copiable': false,
    properties: {
      blocks: {
        default: [],
        type: 'array',
        title: 'Task',
        'x-type': 'Block',
        'x-title-size': 'h4',
        'x-collapsible': true,
        'x-component': 'TasksConfig',
        'x-component-props': {
          draggable: false,
        },
      },
      transition: {
        default: {},
        type: 'object',
        title: 'Transition',
        'x-type': 'Block',
        'x-title-size': 'h4',
        'x-collapsible': true,
        'x-component': 'MessagePreview',
      },
      id: {
        type: 'string',
        default: '',
        'x-hidden': true,
      },
      name: {
        type: 'string',
        default: '',
        'x-hidden': true,
      },
      type: {
        type: 'string',
        default: 'state',
        'x-hidden': true,
      },
      inputs: {
        type: 'object',
        'x-hidden': true,
        default: {},
        'x-type': 'Block',
      },
      outputs: {
        type: 'object',
        'x-hidden': true,
        default: {},
        'x-type': 'Block',
      },
      render: {
        type: 'object',
        'x-type': 'Block',
        'x-hidden': true,
        default: {},
      },
    },
  };
};
