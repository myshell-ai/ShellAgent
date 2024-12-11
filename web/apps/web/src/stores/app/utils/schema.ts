import { ISchema } from '@shellagent/form-engine';
import { FieldModeEnum } from '@shellagent/shared/protocol/extend-config';

import { ENABLE_MIME } from '@/utils/file-types';

import { validateImage } from './validator';

const startSchema: ISchema = {
  title: 'Start',
  type: 'object',
  'x-type': 'Section',
  'x-title-size': 'h4',
  'x-title-icon': '/home.png',
  'x-title-copiable': false,
  properties: {
    context: {
      type: 'object',
      title: 'Context',
      additionalProperties: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            default: 'text',
            enum: ['text', 'image', 'audio', 'video', 'text_file', 'file'],
            title: 'Type',
            'x-component': 'Select',
            'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
            'x-component-props': {
              options: [
                { label: 'text', value: 'text' },
                { label: 'image', value: 'image' },
                { label: 'audio', value: 'audio' },
                { label: 'video', value: 'video' },
                { label: 'text_file', value: 'text_file' },
                { label: 'file', value: 'file' },
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
              {
                target: 'value',
                when: '$this.value === "video"',
                fullfill: {
                  schema: {
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.video,
                    },
                  },
                },
              },
              {
                target: 'value',
                when: '$this.value === "text_file"',
                fullfill: {
                  schema: {
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.other,
                    },
                  },
                },
              },
              {
                target: 'value',
                when: '$this.value === "file"',
                fullfill: {
                  schema: {
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.all,
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
            'x-parent-deletable': true,
            'x-title-editable': true,
            'x-component-props': {
              size: '2xs',
            },
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
                        placeholder:
                          'The usage of the variable. It may be displayed to the users..',
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
                      enum: [
                        'text',
                        'image',
                        'audio',
                        'video',
                        'text_file',
                        'file',
                      ],
                      title: 'Type',
                      'x-component': 'Select',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                      'x-component-props': {
                        options: [
                          { label: 'text', value: 'text' },
                          { label: 'image', value: 'image' },
                          { label: 'audio', value: 'audio' },
                          { label: 'video', value: 'video' },
                          { label: 'text_file', value: 'text_file' },
                          { label: 'file', value: 'file' },
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
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.audio,
                              },
                            },
                          },
                        },
                        {
                          target: 'value',
                          when: '$this.value === "video"',
                          fullfill: {
                            schema: {
                              'x-layout': 'Vertical',
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.video,
                              },
                            },
                          },
                        },
                        {
                          target: 'value',
                          when: '$this.value === "text_file"',
                          fullfill: {
                            schema: {
                              'x-layout': 'Vertical',
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.other,
                              },
                            },
                          },
                        },
                        {
                          target: 'value',
                          when: '$this.value === "file"',
                          fullfill: {
                            schema: {
                              'x-layout': 'Vertical',
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.all,
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
                        placeholder:
                          'The usage of the variable. It may be displayed to the users..',
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
        'x-key': '{{name}} Context_{{counter}}',
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

const stateConfigSchema: ISchema = {
  type: 'object',
  'x-type': 'Block',
  'x-title-size': 'h4',
  'x-class': 'space-y-3',
  properties: {
    inputs: {
      type: 'object',
      title: 'Input',
      additionalProperties: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            default: 'Untitled',
            // 'x-role': 'title',
            'x-type': 'Control',
            'x-component': 'UnfocusInput',
            'x-class': 'border-0 bg-inherit rounded-lg p-0 w-full',
            'x-component-props': {
              size: '2xs',
              autoFocus: false,
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
            enum: ['text', 'image', 'audio', 'video', 'text_file', 'file'],
            'x-component': 'Select',
            'x-component-props': {
              options: [
                { label: 'text', value: 'text' },
                { label: 'image', value: 'image' },
                { label: 'audio', value: 'audio' },
                { label: 'video', value: 'video' },
                { label: 'text_file', value: 'text_file' },
                { label: 'file', value: 'file' },
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
        'x-key': '{{name}} Inputs_{{counter}}',
        'x-type': 'Inline',
        'x-draggable': true,
        'x-deletable': true,
        'x-edit-dialog': {
          type: 'object',
          properties: {
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
            type: {
              type: 'string',
              default: 'text',
              title: 'Type',
              enum: ['text', 'image', 'audio', 'video', 'text_file', 'file'],
              'x-component': 'Select',
              'x-component-props': {
                options: [
                  { label: 'text', value: 'text' },
                  { label: 'image', value: 'image' },
                  { label: 'audio', value: 'audio' },
                  { label: 'video', value: 'video' },
                  { label: 'text_file', value: 'text_file' },
                  { label: 'file', value: 'file' },
                ],
              },
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
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
                {
                  target: 'value',
                  when: '$this.value === "video"',
                  fullfill: {
                    schema: {
                      'x-layout': 'Vertical',
                      'x-component': 'FileUpload',
                      'x-component-props': {
                        accept: ENABLE_MIME.video,
                      },
                    },
                  },
                },
                {
                  target: 'value',
                  when: '$this.value === "text_file"',
                  fullfill: {
                    schema: {
                      'x-layout': 'Vertical',
                      'x-component': 'FileUpload',
                      'x-component-props': {
                        accept: ENABLE_MIME.other,
                      },
                    },
                  },
                },
                {
                  target: 'value',
                  when: '$this.value === "file"',
                  fullfill: {
                    schema: {
                      'x-layout': 'Vertical',
                      'x-component': 'FileUpload',
                      'x-component-props': {
                        accept: ENABLE_MIME.all,
                      },
                    },
                  },
                },
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
                {
                  target: 'default_value',
                  when: '$this.value === "video"',
                  fullfill: {
                    schema: {
                      'x-layout': 'Vertical',
                      'x-component': 'FileUpload',
                      'x-component-props': {
                        accept: ENABLE_MIME.video,
                      },
                    },
                  },
                },
                {
                  target: 'default_value',
                  when: '$this.value === "text_file"',
                  fullfill: {
                    schema: {
                      'x-layout': 'Vertical',
                      'x-component': 'FileUpload',
                      'x-component-props': {
                        accept: ENABLE_MIME.other,
                      },
                    },
                  },
                },
                {
                  target: 'default_value',
                  when: '$this.value === "file"',
                  fullfill: {
                    schema: {
                      'x-layout': 'Vertical',
                      'x-component': 'FileUpload',
                      'x-component-props': {
                        accept: ENABLE_MIME.all,
                      },
                    },
                  },
                },
                {
                  target: 'choices',
                  when: '$this.value === "text"',
                  fullfill: {
                    schema: {
                      'x-hidden': false,
                    },
                  },
                },
              ],
            },
            user_input: {
              type: 'boolean',
              default: true,
              title: 'User Input',
              'x-component': 'Switch',
              'x-type': 'Control',
              'x-value-prop-name': 'checked',
              'x-onchange-prop-name': 'onCheckedChange',
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
              'x-reactions': [
                {
                  target: 'source',
                  when: '$this.value === true',
                  fullfill: {
                    schema: {
                      'x-hidden': false,
                    },
                  },
                },
                {
                  target: 'source',
                  when: '$this.value === false',
                  fullfill: {
                    schema: {
                      'x-hidden': true,
                    },
                  },
                },
                {
                  target: 'default_value',
                  when: '$this.value === true',
                  fullfill: {
                    schema: {
                      'x-hidden': false,
                    },
                  },
                },
                {
                  target: 'default_value',
                  when: '$this.value === false',
                  fullfill: {
                    schema: {
                      'x-hidden': true,
                    },
                  },
                },
                {
                  target: 'value',
                  when: '$this.value === true',
                  fullfill: {
                    schema: {
                      'x-hidden': true,
                    },
                  },
                },
                {
                  target: 'value',
                  when: '$this.value === false',
                  fullfill: {
                    schema: {
                      'x-hidden': false,
                    },
                  },
                },
              ],
            },
            source: {
              title: 'Source',
              type: 'string',
              default: 'IM',
              'x-value-prop-name': 'defaultValue',
              'x-onchange-prop-name': 'onValueChange',
              'x-type': 'Control',
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
              'x-component': 'Select',
              'x-component-props': {
                options: [
                  { label: 'IM', value: 'IM' },
                  { label: 'form', value: 'form' },
                ],
              },
            },
            default_value: {
              type: 'string',
              title: 'Default Value',
              'x-component': 'Textarea',
              'x-raw': true,
              'x-type': 'Control',
              'x-component-props': {
                size: 'sm',
              },
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
            },
            value: {
              type: 'string',
              title: 'Value',
              'x-component': 'Textarea',
              'x-raw': true,
              'x-type': 'Control',
              'x-component-props': {
                size: 'sm',
              },
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
            },
            description: {
              type: 'string',
              title: 'Description',
              'x-raw': true,
              'x-component': 'Textarea',
              'x-layout': 'Vertical',
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3 pb-3',
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
            choices: {
              type: 'array',
              'x-title-size': 'h5',
              title: 'Choices',
              'x-raw': true,
              'x-hidden': true,
              additionalItems: {
                // TODO 临时方案，非object会有render问题
                type: 'object',
                'x-type': 'Inline',
                'x-role': 'core',
                'x-deletable': true,
                properties: {
                  value: {
                    type: 'string',
                    'x-component': 'Input',
                    'x-type': 'Control',
                    'x-raw': true,
                    'x-component-props': {
                      size: 'sm',
                    },
                    'x-class': 'border-0 bg-inherit rounded-lg p-0',
                  },
                },
              },
              'x-type': 'Block',
              'x-addable': true,
              'x-class': 'border-0 bg-inherit rounded-lg p-0 pb-3',
            },
            validations: {
              type: 'array',
              title: 'Validations',
              'x-title-size': 'h5',
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
    blocks: {
      title: 'Task',
      type: 'array',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-collapsible': true,
      'x-component': 'TasksConfig',
      'x-component-props': {
        draggable: true,
      },
    },
    outputs: {
      type: 'object',
      title: 'Output',
      additionalProperties: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            default: 'text',
            enum: ['text', 'image', 'audio', 'video', 'text_file', 'file'],
            title: 'Type',
            'x-component': 'Select',
            'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
            'x-component-props': {
              options: [
                { label: 'text', value: 'text' },
                { label: 'image', value: 'image' },
                { label: 'audio', value: 'audio' },
                { label: 'video', value: 'video' },
                { label: 'text_file', value: 'text_file' },
                { label: 'file', value: 'file' },
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
              {
                target: 'value',
                when: '$this.value === "video"',
                fullfill: {
                  schema: {
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.video,
                    },
                  },
                },
              },
              {
                target: 'value',
                when: '$this.value === "text_file"',
                fullfill: {
                  schema: {
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.other,
                    },
                  },
                },
              },
              {
                target: 'value',
                when: '$this.value === "file"',
                fullfill: {
                  schema: {
                    'x-layout': 'Vertical',
                    'x-component': 'FileUpload',
                    'x-component-props': {
                      accept: ENABLE_MIME.all,
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
            'x-raw-default': FieldModeEnum.Enum.ref,
            'x-parent-deletable': true,
            'x-title-editable': true,
            'x-title-component-props': {
              showDialog: true,
              defaultKey: 'display_name',
              dialogConfig: {
                title: 'Edit Output',
                schema: {
                  type: 'object',
                  properties: {
                    name_mode: {
                      type: 'string',
                      default: FieldModeEnum.Enum.ui,
                      title: 'Mode',
                      'x-type': 'Control',
                      'x-hidden': true,
                      'x-component': 'Input',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0',
                      'x-reactions': [
                        {
                          target: 'type',
                          when: '$this.value === "ref"',
                          fullfill: {
                            schema: {
                              'x-hidden': true,
                            },
                          },
                        },
                        {
                          target: 'description',
                          when: '$this.value === "ref"',
                          fullfill: {
                            schema: {
                              'x-hidden': true,
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
                      'x-component': 'VariableNameInput',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0',
                      'x-component-props': {
                        maxLength: 30,
                        placeholder:
                          'The usage of the variable. It may be displayed to the users..',
                      },
                      'x-validator': [
                        {
                          required: true,
                          message: 'Please input the Variable Name',
                        },
                        {
                          maxLength: 50,
                          message: 'Cannot exceed 50 characters',
                        },
                      ],
                    },
                    display_name: {
                      type: 'string',
                      'x-hidden': true,
                    },
                    type: {
                      type: 'string',
                      default: 'text',
                      enum: [
                        'text',
                        'image',
                        'audio',
                        'video',
                        'text_file',
                        'file',
                      ],
                      title: 'Type',
                      'x-component': 'Select',
                      'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                      'x-component-props': {
                        options: [
                          { label: 'text', value: 'text' },
                          { label: 'image', value: 'image' },
                          { label: 'audio', value: 'audio' },
                          { label: 'video', value: 'video' },
                          { label: 'text_file', value: 'text_file' },
                          { label: 'file', value: 'file' },
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
                        {
                          target: 'value',
                          when: '$this.value === "video"',
                          fullfill: {
                            schema: {
                              'x-layout': 'Vertical',
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.video,
                              },
                            },
                          },
                        },
                        {
                          target: 'value',
                          when: '$this.value === "text_file"',
                          fullfill: {
                            schema: {
                              'x-layout': 'Vertical',
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.other,
                              },
                            },
                          },
                        },
                        {
                          target: 'value',
                          when: '$this.value === "file"',
                          fullfill: {
                            schema: {
                              'x-layout': 'Vertical',
                              'x-component': 'FileUpload',
                              'x-component-props': {
                                accept: ENABLE_MIME.all,
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
                        placeholder:
                          'The usage of the variable. It may be displayed to the users..',
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
              size: '2xs',
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
        'x-key': '{{name}} Outputs_{{counter}}',
        'x-type': 'Inline',
        'x-collapsible': true,
      },
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-collapsible': true,
      'x-addable': true,
    },
    render: {
      type: 'object',
      title: 'Message',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-collapsible': true,
      properties: {
        text: {
          type: 'string',
          title: 'Text',
          'x-component': 'ExpressionInput',
          'x-type': 'Control',
          'x-switchable': true,
          'x-switchable-default': true,
          'x-raw': true,
          'x-raw-default': FieldModeEnum.Enum.ui,
          'x-validator': [
            {
              warningOnly: true,
              validator(rule, value) {
                console.log('value: ', value);
                return new Promise((resolve, reject) => {
                  if (/<img\s[^>]*>/.test(value)) {
                    reject(
                      new Error(
                        'The <img> tag will be deprecated in the future. Please use Message.Image to render images instead.',
                      ),
                    );
                  } else {
                    resolve(true);
                  }
                });
              },
            },
          ],
        },
        audio: {
          type: 'string',
          title: 'Audio',
          'x-component': 'FileUpload',
          'x-type': 'Control',
          'x-switchable': true,
          'x-switchable-default': false,
          'x-component-props': {
            accept: ENABLE_MIME.audio,
          },
          'x-raw': true,
          'x-raw-default': FieldModeEnum.Enum.ui,
        },
        image: {
          type: 'string',
          title: 'Image',
          'x-component': 'FileUpload',
          'x-type': 'Control',
          'x-switchable': true,
          'x-switchable-default': false,
          'x-component-props': {
            accept: ENABLE_MIME.image,
          },
          'x-raw': true,
          'x-raw-default': FieldModeEnum.Enum.ui,
        },
        buttons: {
          type: 'array',
          title: 'Buttons',
          'x-switchable': true,
          'x-component': 'ButtonEditor',
          'x-type': 'Control',
          'x-switchable-default': true,
        },
      },
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
  },
};

const introConfigSchema: ISchema = {
  type: 'object',
  'x-type': 'Block',
  'x-title-size': 'h4',
  'x-class': 'space-y-3',
  description:
    'The intro message is crucial for user experience. Keep it within one iOS screen (text, image, and buttons) to ensure a smooth, engaging start.',
  properties: {
    render: {
      type: 'object',
      title: 'Message',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-collapsible': true,
      properties: {
        text: {
          type: 'string',
          title: 'Text',
          'x-component': 'ExpressionInput',
          'x-type': 'Control',
          'x-switchable': true,
          'x-switchable-default': true,
          'x-raw': true,
          'x-raw-default': FieldModeEnum.Enum.ui,
          'x-validator': [
            {
              warningOnly: true,
              validator(rule, value) {
                return new Promise((resolve, reject) => {
                  if (/<img\s[^>]*>/.test(value)) {
                    reject(
                      new Error(
                        'The <img> tag will be deprecated in the future. Please use Message.Image to render images instead.',
                      ),
                    );
                  } else if (
                    (value?.replace(/<[^>]*>/g, '')?.trim()?.length || 0) > 320
                  ) {
                    reject(
                      new Error(
                        'The text may be too long. Please make sure the message fits within the iOS screen size.',
                      ),
                    );
                  } else {
                    resolve(true);
                  }
                });
              },
            },
          ],
          'x-validator-render': 'ValidateRender',
        },
        audio: {
          type: 'string',
          title: 'Audio',
          'x-component': 'FileUpload',
          'x-type': 'Control',
          'x-switchable': true,
          'x-switchable-default': false,
          'x-component-props': {
            accept: ENABLE_MIME.audio,
          },
          'x-raw': true,
          'x-raw-default': FieldModeEnum.Enum.ui,
        },
        image: {
          type: 'string',
          title: 'Image',
          'x-component': 'FileUpload',
          'x-type': 'Control',
          'x-switchable': true,
          'x-switchable-default': false,
          'x-component-props': {
            accept: ENABLE_MIME.image,
          },
          'x-raw': true,
          'x-raw-default': FieldModeEnum.Enum.ui,
          'x-validator': [
            {
              warningOnly: true,
              validator(rule, value) {
                return validateImage(value);
              },
            },
          ],
          'x-validator-render': 'ValidateRender',
        },
        buttons: {
          type: 'array',
          title: 'Buttons',
          'x-switchable': true,
          'x-component': 'ButtonEditor',
          'x-type': 'Control',
          'x-switchable-default': true,
          'x-validator': [
            {
              warningOnly: true,
              validator(rule, value) {
                return new Promise((resolve, reject) => {
                  if (value?.length > 4) {
                    reject(
                      new Error('Limit the number of buttons to 4 or fewer.'),
                    );
                  } else {
                    resolve(true);
                  }
                });
              },
            },
          ],
        },
      },
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
  },
};

const buttonConfigSchema: ISchema = {
  type: 'object',
  'x-type': 'Block',
  'x-title-size': 'h4',
  properties: {
    content: {
      type: 'string',
      title: 'Content',
      'x-raw': true,
      'x-type': 'Control',
      'x-title-size': 'h4',
      'x-component': 'UnfocusInput',
      'x-collapsible': true,
      'x-addable': true,
      'x-component-props': {
        size: '2xs',
      },
    },
    description: {
      type: 'string',
      title: 'Description',
      'x-raw': true,
      'x-type': 'Control',
      'x-component': 'Textarea',
      'x-component-props': {
        maxLength: 300,
        placeholder: 'Enter a description...',
      },
    },
    on_click: {
      type: 'object',
      properties: {
        event: {
          type: 'string',
          'x-hidden': true,
        },
        payload: {
          type: 'object',
          title: 'Payload',
          additionalProperties: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                default: 'text',
                enum: ['text', 'image', 'audio', 'video', 'text_file', 'file'],
                title: 'Type',
                'x-component': 'Select',
                'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                'x-component-props': {
                  options: [
                    { label: 'text', value: 'text' },
                    { label: 'image', value: 'image' },
                    { label: 'audio', value: 'audio' },
                    { label: 'video', value: 'video' },
                    { label: 'text_file', value: 'text_file' },
                    { label: 'file', value: 'file' },
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
                  {
                    target: 'value',
                    when: '$this.value === "video"',
                    fullfill: {
                      schema: {
                        'x-layout': 'Vertical',
                        'x-component': 'FileUpload',
                        'x-component-props': {
                          accept: ENABLE_MIME.video,
                        },
                      },
                    },
                  },
                  {
                    target: 'value',
                    when: '$this.value === "text_file"',
                    fullfill: {
                      schema: {
                        'x-layout': 'Vertical',
                        'x-component': 'FileUpload',
                        'x-component-props': {
                          accept: ENABLE_MIME.other,
                        },
                      },
                    },
                  },
                  {
                    target: 'value',
                    when: '$this.value === "file"',
                    fullfill: {
                      schema: {
                        'x-layout': 'Vertical',
                        'x-component': 'FileUpload',
                        'x-component-props': {
                          accept: ENABLE_MIME.all,
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
                'x-raw-default': FieldModeEnum.Enum.ref,
                'x-raw-options': [FieldModeEnum.Enum.ref],
                'x-parent-deletable': true,
                'x-title-editable': true,
                'x-component-props': {
                  size: '2xs',
                },
                'x-title-component-props': {
                  showDialog: true,
                  dialogConfig: {
                    title: 'Edit Payload',
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
                            placeholder:
                              'The usage of the variable. It may be displayed to the users..',
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
                          enum: [
                            'text',
                            'image',
                            'audio',
                            'video',
                            'text_file',
                            'file',
                          ],
                          title: 'Type',
                          'x-component': 'Select',
                          'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                          'x-component-props': {
                            options: [
                              { label: 'text', value: 'text' },
                              { label: 'image', value: 'image' },
                              { label: 'audio', value: 'audio' },
                              { label: 'video', value: 'video' },
                              { label: 'text_file', value: 'text_file' },
                              { label: 'file', value: 'file' },
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
                            {
                              target: 'value',
                              when: '$this.value === "video"',
                              fullfill: {
                                schema: {
                                  'x-layout': 'Vertical',
                                  'x-component': 'FileUpload',
                                  'x-component-props': {
                                    accept: ENABLE_MIME.video,
                                  },
                                },
                              },
                            },
                            {
                              target: 'value',
                              when: '$this.value === "text_file"',
                              fullfill: {
                                schema: {
                                  'x-layout': 'Vertical',
                                  'x-component': 'FileUpload',
                                  'x-component-props': {
                                    accept: ENABLE_MIME.other,
                                  },
                                },
                              },
                            },
                            {
                              target: 'value',
                              when: '$this.value === "file"',
                              fullfill: {
                                schema: {
                                  'x-layout': 'Vertical',
                                  'x-component': 'FileUpload',
                                  'x-component-props': {
                                    accept: ENABLE_MIME.all,
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
                          'x-raw': true,
                          'x-component': 'Textarea',
                          'x-layout': 'Vertical',
                          'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
                          'x-component-props': {
                            maxLength: 300,
                            placeholder:
                              'The usage of the variable. It may be displayed to the users..',
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
            'x-key': '{{name}} Payload_{{counter}}',
            'x-type': 'Inline',
            'x-collapsible': true,
          },
          'x-type': 'Block',
          'x-title-size': 'h4',
          'x-collapsible': true,
          'x-addable': true,
        },
      },
    },
  },
};

const transitionConfigSchema: ISchema = {
  type: 'object',
  'x-type': 'Block',
  properties: {
    transitions: {
      type: 'object',
      title: 'Transition',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-component': 'TransitionConditionEditor',
    },
  },
};

export {
  startSchema,
  stateConfigSchema,
  introConfigSchema,
  buttonConfigSchema,
  transitionConfigSchema,
};
