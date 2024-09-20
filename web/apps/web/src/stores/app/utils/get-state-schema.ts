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
        type: 'object',
        title: 'Transition',
        'x-type': 'Block',
        'x-title-size': 'h4',
        'x-collapsible': true,
        'x-component': 'MessagePreview',
      },
    },
  };
};
