import { ISchema } from '@shellagent/form-engine';

export const getIntroSchema = (name: string): ISchema => {
  return {
    title: name,
    type: 'object',
    'x-type': 'Section',
    'x-title-size': 'h4',
    'x-title-copiable': false,
    properties: {
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
      render: {
        type: 'object',
        'x-type': 'Block',
        'x-hidden': true,
        default: {},
      },
    },
  };
};
