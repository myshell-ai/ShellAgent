import { ISchema } from '@shellagent/form-engine';
const schema: ISchema = {
  type: 'object',
  'x-type': 'Section',
  'x-title-copiable': false,
  properties: {
    upload: {
      type: 'string',
      title: 'ComfyUI JSON',
      'x-layout': 'Vertical',
      'x-type': 'Control',
      'x-component': 'FileUpload',
      'x-title-size': 'h4',
      'x-raw': true,
      'x-raw-default': 'ui',
      'x-raw-options': ['ui', 'raw'],
    },
  },
};

export default schema;
