import { ISchema } from '@shellagent/form-engine';

import { ENABLE_MIME } from '@/utils/file-types';

const startSchema: ISchema = {
  title: 'Start',
  description:
    'The starting node of the workflow,used to set the information needed to initiate the workflow.',
  type: 'object',
  'x-type': 'Section',
  'x-title-size': 'h4',
  'x-title-icon': '/home.png',
  'x-collapsible': true,
  'x-title-copiable': false,
  properties: {
    input: {
      type: 'object',
      title: 'Input',
      description:
        'Variables allow users to introduce prompts or opening remarks into form inputs. You can try entering {input} in the prompt.',
      additionalProperties: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            default: 'Untitled',
            'x-role': 'title',
            'x-type': 'Control',
            'x-component': 'EditTitle',
            'x-class': 'border-0 bg-inherit rounded-lg p-0 w-full',
            'x-component-props': {
              autoFocus: true,
              maxLength: 30,
              placeholder: 'Please name the event',
            },
            'x-validator': [
              { required: true, message: 'Please name the event' },
              { maxLength: 30, message: 'Cannot exceed 30 characters' },
            ],
          },
          type: {
            type: 'string',
            default: 'text',
            enum: ['text', 'image', 'audio'],
            'x-component': 'Select',
            'x-component-props': {
              options: [
                { label: 'text', value: 'text' },
                { label: 'image', value: 'image' },
                { label: 'audio', value: 'audio' },
              ],
              triggerClassName: 'h-7 w-32',
            },
            'x-class': 'border-0 bg-inherit rounded-lg p-0 w-32',
            'x-value-prop-name': 'defaultValue',
            'x-onchange-prop-name': 'onValueChange',
            'x-type': 'Control',
          },
          user_input: {
            type: 'boolean',
            default: true,
            'x-component': 'Switch',
            'x-type': 'Control',
            'x-value-prop-name': 'checked',
            'x-onchange-prop-name': 'onCheckedChange',
          },
        },
        'x-type': 'Inline',
        'x-deletable': true,
        'x-edit-dialog': {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              default: 'text',
              title: 'Field Type',
              enum: ['text', 'image', 'audio'],
              'x-component': 'Select',
              'x-component-props': {
                options: [
                  { label: 'text', value: 'text' },
                  { label: 'image', value: 'image' },
                  { label: 'audio', value: 'audio' },
                ],
              },
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
              'x-value-prop-name': 'defaultValue',
              'x-onchange-prop-name': 'onValueChange',
              'x-type': 'Control',
              'x-reactions': [
                {
                  target: 'default_value',
                  when: '$this.value === "image"',
                  fullfill: {
                    schema: {
                      'x-component': 'FileUpload',
                      'x-component-props': {
                        accept: ENABLE_MIME.image,
                      },
                    },
                  },
                },
                {
                  target: 'default_value',
                  when: '$this.value === "audio"',
                  fullfill: {
                    schema: {
                      'x-component': 'FileUpload',
                      'x-component-props': {
                        accept: ENABLE_MIME.audio,
                      },
                    },
                  },
                },
              ],
            },
            name: {
              type: 'string',
              default: 'Untitled',
              title: 'Variable Name',
              'x-role': 'title',
              'x-type': 'Control',
              'x-component': 'Input',
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
              'x-component-props': {
                maxLength: 30,
                size: 'sm',
                placeholder: 'Please name the event',
              },
              'x-validator': [
                { required: true, message: 'Please name the event' },
                { maxLength: 30, message: 'Cannot exceed 30 characters' },
              ],
            },
            description: {
              type: 'string',
              title: 'Description',
              'x-component': 'Textarea',
              'x-layout': 'Vertical',
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
              'x-component-props': {
                maxLength: 500,
                placeholder:
                  'Please describe how to use this input variable. This description will be displayed when the user inputs.',
              },
              'x-validator': [
                {
                  exclusiveMaximum: 500,
                  message: 'Cannot exceed 500 characters',
                },
              ],
              'x-type': 'Control',
            },
            default_value: {
              type: 'string',
              title: 'Default Value',
              'x-component': 'Textarea',
              'x-type': 'Control',
              'x-component-props': {
                size: 'sm',
                placeholder: 'Please enter the default value',
              },
              'x-class': 'border-0 bg-inherit rounded-lg p-0 py-3',
            },
            validations: {
              type: 'array',
              title: 'Validations',
              additionalItems: {
                type: 'object',
                properties: {
                  void_core: {
                    type: 'void',
                    'x-role': 'core',
                    'x-type': 'Grid',
                    'x-class': 'grid-cols-3',
                    properties: {
                      rule_type: {
                        type: 'string',
                        enum: [
                          'max_length',
                          'min_number',
                          'max_number',
                          'max_file_size',
                        ],
                        'x-component': 'Select',
                        'x-component-props': {
                          placeholder: 'Rule type',
                          options: [
                            { label: 'Max Length', value: 'max_length' },
                            { label: 'Min Number', value: 'min_number' },
                            { label: 'Max Number', value: 'max_number' },
                            { label: 'Max File Size', value: 'max_file_size' },
                          ],
                        },
                        'x-value-prop-name': 'defaultValue',
                        'x-onchange-prop-name': 'onValueChange',
                        'x-type': 'Control',
                        'x-class': 'border-0 bg-inherit rounded-lg p-0',
                        'x-reactions': [
                          {
                            target: 'max_length',
                            when: '$this.value === "max_length"',
                            fullfill: {
                              schema: {
                                'x-hidden': false,
                              },
                            },
                          },
                          {
                            target: 'min_number',
                            when: '$this.value === "min_number"',
                            fullfill: {
                              schema: {
                                'x-hidden': false,
                              },
                            },
                          },
                          {
                            target: 'max_number',
                            when: '$this.value === "max_number"',
                            fullfill: {
                              schema: {
                                'x-hidden': false,
                              },
                            },
                          },
                          {
                            target: 'max_file_size',
                            when: '$this.value === "max_file_size"',
                            fullfill: {
                              schema: {
                                'x-hidden': false,
                              },
                            },
                          },
                        ],
                      },
                      max_length: {
                        type: 'number',
                        default: 500,
                        'x-component': 'NumberInput',
                        'x-type': 'Control',
                        // 'x-hidden': true,
                        'x-component-props': {
                          min: 0,
                          max: 15000,
                          placeholder: 'Rule limit',
                          size: 'sm',
                        },
                        'x-class': 'border-0 bg-inherit rounded-lg p-0',
                        'x-validator': [
                          { required: true },
                          { exclusiveMinimum: 0 },
                          { exclusiveMaximum: 15000 },
                        ],
                      },
                      min_number: {
                        type: 'number',
                        'x-component': 'NumberInput',
                        'x-type': 'Control',
                        'x-hidden': true,
                        'x-component-props': {
                          placeholder: 'Rule limit',
                          size: 'sm',
                        },
                        'x-class': 'border-0 bg-inherit rounded-lg p-0',
                      },
                      max_number: {
                        type: 'number',
                        'x-component': 'NumberInput',
                        'x-type': 'Control',
                        'x-hidden': true,
                        'x-component-props': {
                          placeholder: 'Rule limit',
                          size: 'sm',
                        },
                        'x-class': 'border-0 bg-inherit rounded-lg p-0',
                      },
                      max_file_size: {
                        type: 'number',
                        default: 10 * 1024 * 1024,
                        'x-component': 'NumberInput',
                        'x-type': 'Control',
                        'x-hidden': true,
                        'x-component-props': {
                          min: 0,
                          max: 100 * 1024 * 1024,
                          placeholder: 'Rule limit',
                          size: 'sm',
                        },
                        'x-class': 'border-0 bg-inherit rounded-lg p-0',
                        'x-validator': [
                          { required: true },
                          { exclusiveMinimum: 0 },
                          { exclusiveMaximum: 100 * 1024 * 1024 },
                        ],
                      },
                      error_message: {
                        type: 'string',
                        'x-component': 'Input',
                        'x-type': 'Control',
                        'x-component-props': {
                          size: 'sm',
                          placeholder: 'Error Message',
                        },
                        'x-class': 'border-0 bg-inherit rounded-lg p-0',
                      },
                    },
                  },
                },
                'x-type': 'Inline',
                'x-role': 'core',
                'x-deletable': true,
              },
              'x-type': 'Block',
              'x-addable': true,
              'x-class': 'border-0 bg-inherit rounded-lg p-0',
            },
          },
        },
      },
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-collapsible': true,
      'x-addable': true,
    },
    context: {
      type: 'object',
      title: 'Context',
      additionalProperties: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            default: 'text',
            enum: ['text', 'image', 'audio'],
            title: 'Field Type',
            'x-component': 'Select',
            'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
            'x-component-props': {
              options: [
                { label: 'text', value: 'text' },
                { label: 'image', value: 'image' },
                { label: 'audio', value: 'audio' },
              ],
            },
            'x-hidden': true,
            'x-value-prop-name': 'defaultValue',
            'x-onchange-prop-name': 'onValueChange',
            'x-type': 'Control',
            'x-reactions': [
              {
                target: 'value',
                when: '$this.value === "image"',
                fullfill: {
                  schema: {
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.image,
                    },
                  },
                },
              },
              {
                target: 'value',
                when: '$this.value === "audio"',
                fullfill: {
                  schema: {
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.audio,
                    },
                  },
                },
              },
            ],
            'x-validator': [
              {
                required: true,
                message: 'Please select the output type',
              },
            ],
          },
          value: {
            type: 'string',
            'x-component': 'Input',
            'x-type': 'Control',
            // 'x-class': 'border-0 bg-inherit rounded-lg p-0 w-full',
            'x-parent-deletable': true,
            'x-title-editable': true,
            'x-title-component-props': {
              showDialog: true,
              dialogConfig: {
                title: 'Edit Context',
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      default: 'Untitled',
                      title: 'Variable Name',
                      'x-role': 'title',
                      'x-type': 'Control',
                      'x-component': 'Input',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0',
                      'x-component-props': {
                        size: 'md',
                        maxLength: 30,
                        placeholder: 'The character you want to play.',
                      },
                      'x-validator': [
                        {
                          required: true,
                          message: 'Please input the Variable Name',
                        },
                        {
                          maxLength: 30,
                          message: 'Cannot exceed 30 characters',
                        },
                      ],
                    },
                    type: {
                      type: 'string',
                      default: 'text',
                      enum: ['text', 'image', 'audio'],
                      title: 'Field Type',
                      'x-component': 'Select',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                      'x-component-props': {
                        options: [
                          { label: 'text', value: 'text' },
                          { label: 'image', value: 'image' },
                          { label: 'audio', value: 'audio' },
                        ],
                      },
                      'x-value-prop-name': 'defaultValue',
                      'x-onchange-prop-name': 'onValueChange',
                      'x-type': 'Control',
                      'x-layout': 'Vertical',
                      'x-reactions': [
                        {
                          target: 'value',
                          when: '$this.value === "image"',
                          fullfill: {
                            schema: {
                              'x-raw': true,
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.audio,
                              },
                            },
                          },
                        },
                        {
                          target: 'value',
                          when: '$this.value === "audio"',
                          fullfill: {
                            schema: {
                              'x-raw': true,
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.audio,
                              },
                            },
                          },
                        },
                      ],
                      'x-validator': [
                        {
                          required: true,
                          message: 'Please select the output type',
                        },
                      ],
                    },
                    description: {
                      type: 'string',
                      title: 'Description',
                      'x-component': 'Textarea',
                      'x-layout': 'Vertical',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                      'x-component-props': {
                        maxLength: 300,
                        placeholder: 'The character you want to play.',
                      },
                      'x-validator': [
                        {
                          exclusiveMaximum: 300,
                          message: 'Cannot exceed 300 characters',
                        },
                      ],
                      'x-type': 'Control',
                    },
                  },
                },
              },
            },
            'x-layout': 'Horizontal',
            'x-validator': [
              { required: true, message: 'The value is required' },
            ],
          },
          name: {
            type: 'string',
            default: 'Untitled',
            'x-type': 'Control',
            'x-component': 'Input',
            'x-hidden': true,
            'x-class': 'border-0 bg-inherit rounded-lg p-0',
            title: 'Variable Name',
          },
        },
        'x-type': 'Inline',
        'x-collapsible': true,
      },
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-collapsible': true,
      'x-addable': true,
    },
  },
};

const endSchema: ISchema = {
  title: 'End',
  description:
    'The starting node of the workflow,used to set the information needed to initiate the workflow.',
  type: 'object',
  'x-type': 'Section',
  'x-title-size': 'h4',
  'x-title-icon': '/flag.png',
  'x-title-copiable': false,
  'x-collapsible': true,
  properties: {
    output: {
      type: 'object',
      title: 'Outputs',
      additionalProperties: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            default: 'text',
            enum: ['text', 'image', 'audio'],
            title: 'Field Type',
            'x-component': 'Select',
            'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
            'x-component-props': {
              options: [
                { label: 'text', value: 'text' },
                { label: 'image', value: 'image' },
                { label: 'audio', value: 'audio' },
              ],
            },
            'x-hidden': true,
            'x-value-prop-name': 'defaultValue',
            'x-onchange-prop-name': 'onValueChange',
            'x-type': 'Control',
            'x-reactions': [
              {
                target: 'value',
                when: '$this.value === "image"',
                fullfill: {
                  schema: {
                    'x-raw': true,
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.image,
                    },
                  },
                },
              },
              {
                target: 'value',
                when: '$this.value === "audio"',
                fullfill: {
                  schema: {
                    'x-raw': true,
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.audio,
                    },
                  },
                },
              },
            ],
            'x-validator': [
              {
                required: true,
                message: 'Please select the output type',
              },
            ],
          },
          value: {
            type: 'string',
            'x-component': 'Input',
            'x-type': 'Control',
            'x-raw': true,
            'x-raw-default': 'ref',
            'x-parent-deletable': true,
            'x-title-editable': true,
            'x-title-component-props': {
              showDialog: true,
              dialogConfig: {
                title: 'Edit Output',
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      default: 'Untitled',
                      title: 'Variable Name',
                      'x-role': 'title',
                      'x-type': 'Control',
                      'x-component': 'Input',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0',
                      'x-component-props': {
                        size: 'md',
                        maxLength: 30,
                        placeholder: 'The character you want to play.',
                      },
                      'x-validator': [
                        {
                          required: true,
                          message: 'Please input the Variable Name',
                        },
                        {
                          maxLength: 30,
                          message: 'Cannot exceed 30 characters',
                        },
                      ],
                    },
                    type: {
                      type: 'string',
                      default: 'text',
                      enum: ['text', 'image', 'audio'],
                      title: 'Field Type',
                      'x-component': 'Select',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                      'x-component-props': {
                        options: [
                          { label: 'text', value: 'text' },
                          { label: 'image', value: 'image' },
                          { label: 'audio', value: 'audio' },
                        ],
                      },
                      'x-value-prop-name': 'defaultValue',
                      'x-onchange-prop-name': 'onValueChange',
                      'x-type': 'Control',
                      'x-layout': 'Vertical',
                      'x-reactions': [
                        {
                          target: 'value',
                          when: '$this.value === "image"',
                          fullfill: {
                            schema: {
                              'x-raw': true,
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.audio,
                              },
                            },
                          },
                        },
                        {
                          target: 'value',
                          when: '$this.value === "audio"',
                          fullfill: {
                            schema: {
                              'x-raw': true,
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.audio,
                              },
                            },
                          },
                        },
                      ],
                      'x-validator': [
                        {
                          required: true,
                          message: 'Please select the output type',
                        },
                      ],
                    },
                    description: {
                      type: 'string',
                      title: 'Description',
                      default: '',
                      'x-component': 'Textarea',
                      'x-layout': 'Vertical',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                      'x-component-props': {
                        maxLength: 300,
                        placeholder: 'The character you want to play.',
                      },
                      'x-validator': [
                        {
                          exclusiveMaximum: 300,
                          message: 'Cannot exceed 300 characters',
                        },
                      ],
                      'x-type': 'Control',
                    },
                  },
                },
              },
            },
            'x-component-props': {
              placeholder: 'Please enter event value',
            },
            'x-layout': 'Horizontal',
            'x-validator': [
              { required: true, message: 'The value is required' },
            ],
          },
          name: {
            type: 'string',
            default: 'Untitled',
            'x-type': 'Control',
            'x-component': 'Input',
            'x-hidden': true,
            'x-class': 'border-0 bg-inherit rounded-lg p-0',
          },
        },
        'x-type': 'Inline',
        'x-collapsible': true,
      },
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-collapsible': true,
      'x-addable': true,
    },
    render: {
      'x-type': 'Render',
      'x-component': 'Render',
    },
  },
};

export { startSchema, endSchema };
