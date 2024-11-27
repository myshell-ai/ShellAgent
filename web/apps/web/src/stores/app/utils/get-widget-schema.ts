/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */

import { ISchema, resolveRefs, isUpperCase } from '@shellagent/form-engine';
import { isEmpty, omit } from 'lodash-es';
import { SchemaTypes } from 'node_modules/@shellagent/form-engine/src/types';
import { JsonSchema7 } from 'node_modules/@shellagent/form-engine/src/types/jsonSchema7';

import { getTypesFromSchema } from './get-widget-schema-utils';

function getDesc(hasLimitation: boolean, schema: JsonSchema7) {
  let description;
  if (hasLimitation) {
    const desc = `Between ${schema.minimum} and ${schema.maximum}`;
    if (schema.description) {
      description = `${schema.description}; ${desc}`;
    } else {
      description = desc;
    }
  } else {
    description = schema.description;
  }
  if (schema.multipleOf) {
    description = `${description}; Multiple of ${schema.multipleOf}`;
  }
  return description;
}

// basic模式下隐藏含有hidden的字段
function addCustomUIProperties(jsonschema: any) {
  let schema = { ...jsonschema };
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  if (schema.properties) {
    schema = addAttributesToObject(schema);
  }

  if (schema.items) {
    schema = addAttributesToArray(schema);
  }

  if (schema.allOf) {
    schema = {
      ...schema,
      type: 'object',
      properties: schema.properties,
      allOf: schema.allOf.map((subSchema: JsonSchema7) => ({
        ...addCustomUIProperties(subSchema),
        title: schema.title,
      })),
    };
    if (jsonschema?.visible === false) {
      schema['x-hidden'] = true;
    }
  }

  if (schema.anyOf) {
    schema.anyOf = schema.anyOf.map((subSchema: JsonSchema7) => {
      return addCustomUIProperties(subSchema);
    });
  }

  if (schema.oneOf) {
    schema.oneOf = schema.oneOf.map((subSchema: JsonSchema7) =>
      addCustomUIProperties(subSchema),
    );
  }

  if (schema.type !== 'object' && schema.type !== 'array') {
    schema = addAttributesToPrimitive(schema);
  }
  return schema;
}

function addAttributesToObject(schema: JsonSchema7): ISchema {
  const newSchema: ISchema = {
    ...(schema as ISchema),
    type: 'object',
    'x-type': 'Block',
    'x-title-size': 'h4',
    'x-collapsible': true,
  };

  if (schema?.visible === false) {
    newSchema['x-hidden'] = true;
  }
  newSchema.properties = {};
  for (const key in schema.properties) {
    if (Object.prototype.hasOwnProperty.call(schema.properties, key)) {
      newSchema.properties[key] = addCustomUIProperties(schema.properties[key]);
      newSchema.properties[key].title = key;
    }
  }
  return newSchema;
}

function addAttributesToArray(schema: JsonSchema7): ISchema {
  let newSchema: ISchema = {
    ...(schema as ISchema),
    type: 'array',
    title: schema.title,
    default: schema.default,
    description: schema.description,
    'x-type': 'Block',
    'x-addable': true,
    'x-collapsible': true,
    'x-title-size': 'h4',
  };

  if (schema?.visible === false) {
    newSchema['x-hidden'] = true;
  }
  if (Array.isArray(schema.items)) {
    const properties = schema.items.map(item => {
      const properties = addCustomUIProperties(item);
      return {
        type: 'object' as SchemaTypes,
        properties,
        'x-type': 'Card',
        'x-role': 'core',
        'x-deletable': true,
        'x-collapsible': true,
      };
    }) as ISchema[];
    newSchema = {
      ...newSchema,
      items: properties,
      additionalItems: {
        ...properties[0],
        type: 'object',
        'x-type': 'Card',
        'x-role': 'core',
        'x-deletable': true,
        'x-collapsible': true,
      },
    };
  } else if (schema.items?.type === 'object') {
    const properties = addCustomUIProperties(schema.items);
    newSchema = {
      ...newSchema,
      items: undefined,
      additionalItems: {
        type: 'object',
        ...properties,
        'x-type': 'Card',
        'x-role': 'core',
        'x-deletable': true,
        'x-collapsible': true,
      },
    };
  } else if (
    schema.items?.type &&
    ['string', 'number', 'integer'].includes(schema.items?.type)
  ) {
    newSchema = {
      ...newSchema,
      items: undefined,
      additionalItems: {
        ...addCustomUIProperties(schema.items),
        'x-component': 'Input',
        'x-raw': true,
        'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
        'x-type': 'Control',
        // 'x-role': 'core',
        'x-deletable': true,
        // 'x-collapsible': true,
      },
    };
  } else if (
    schema.items?.anyOf?.length === 2 &&
    schema.items?.anyOf.find(item => item.type === 'string')
  ) {
    const properties = addCustomUIProperties(
      schema.items?.anyOf.find(item => item.type === 'string'),
    );
    newSchema = {
      ...newSchema,
      items: undefined,
      additionalItems: {
        ...properties,
        'x-deletable': true,
      },
    } as ISchema;
  } else {
    const properties = schema.items
      ? Object.entries(schema.items || {}).reduce((prev, [key, item]) => {
          if (key === 'anyOf') {
            const anyofList: ISchema[] = item?.map((field: ISchema) => ({
              ...addCustomUIProperties(field),
              'x-type': 'Card',
              'x-role': 'core',
              'x-deletable': true,
              'x-collapsible': true,
            }));
            const options: string[] = item?.reduce(
              (memo: string[], option: ISchema) => [
                ...memo,
                ...(option?.properties?.type?.enum || []),
              ],
              [],
            );
            prev[key] = anyofList.map(item => {
              if (item.properties?.type) {
                item.properties.type = {
                  ...item.properties.type,
                  enum: options,
                  'x-component-props': {
                    ...item.properties.type?.['x-component-props'],
                    options: options.map(option => ({
                      label: option,
                      value: option,
                    })),
                  },
                };
              }
              return {
                ...item,
                properties: {
                  type: item.properties?.type,
                  ...omit(item.properties, ['type']),
                },
              };
            });
          } else {
            prev[key] = addCustomUIProperties(item);
            prev[key].title = key;
          }
          return prev;
        }, {} as any)
      : {};
    newSchema = {
      ...newSchema,
      items: [properties],
      additionalItems: {
        type: 'object',
        properties,
        'x-type': 'Card',
        'x-role': 'core',
        'x-deletable': true,
        'x-collapsible': true,
      },
    } as ISchema;
  }
  return newSchema;
}

function addAttributesToPrimitive(schema: JsonSchema7): ISchema {
  const newSchema: ISchema = {
    ...(schema as ISchema),
    type: schema.type as ISchema['type'],
    'x-field-type': schema.type,
    title: schema.title,
    description: schema.description,
    'x-title-size': 'h4',
    'x-type': 'Control',
    'x-layout': 'Horizontal',
  };
  if (schema?.visible === false) {
    newSchema['x-hidden'] = true;
  }

  if (newSchema.choices?.length) {
    const choices = newSchema.choices.filter(item => typeof item === 'string');
    return {
      ...newSchema,
      enum: choices,
      'x-raw': true,
      'x-component': 'Select',
      'x-component-props': {
        triggerClassName: 'h-7',
        options: choices.map(item => ({
          label: item,
          value: item,
        })),
      },
      'x-onchange-prop-name': 'onValueChange',
      'x-validator': [
        {
          // required,
        },
      ],
    };
  }
  if (newSchema.type && isUpperCase(newSchema.type)) {
    return {
      ...newSchema,
      type: 'string',
      'x-component': 'VariableSelect',
      'x-component-props': {
        triggerClassName: 'h-7 w-44',
      },
      'x-validator': [
        {
          // required,
        },
      ],
    };
  }
  if (newSchema.type === 'boolean') {
    return {
      ...newSchema,
      'x-raw': true,
      'x-component': 'Checkbox',
      'x-onchange-prop-name': 'onCheckedChange',
      'x-value-prop-name': 'checked',
      'x-validator': [
        {
          // required,
        },
      ],
    };
  }
  if (newSchema.enum?.length) {
    return {
      ...newSchema,
      'x-raw': true,
      'x-component': 'Select',
      'x-component-props': {
        triggerClassName: 'h-7 w-44',
        options: newSchema.enum.map(item => ({
          label: item,
          value: item,
        })),
      },
      'x-onchange-prop-name': 'onValueChange',
      'x-validator': [
        {
          // required,
        },
      ],
    };
  }
  if (newSchema.type === 'integer') {
    const hasLimitation =
      typeof schema.minimum === 'number' && typeof schema.maximum === 'number';

    return {
      ...newSchema,
      type: 'number',
      default: typeof schema.default === 'number' ? schema.default : undefined,
      description: getDesc(hasLimitation, schema),
      'x-component': 'NumberInput',
      'x-title-size': 'h4',
      'x-raw': true,
      'x-onchange-prop-name': hasLimitation ? 'onValueChange' : 'onChange',
      'x-validator': [
        {
          exclusiveMinimum: schema.minimum,
          // message: "",
        },
        {
          exclusiveMaximum: schema.maximum,
        },
        {
          // required: isRequired,
        },
      ],
      'x-component-props': {
        min: schema.minimum,
        max: schema.maximum,
        step: schema.multipleOf == null ? 1 : schema.multipleOf,
        precision: hasLimitation ? null : 2,
        controls: false,
        wrapperClassName: 'h-7',
        inputClassName: 'text-center h-7 w-44',
      },
    };
  }
  if (newSchema.type === 'number') {
    const hasLimitation =
      typeof schema.minimum === 'number' && typeof schema.maximum === 'number';
    return {
      ...newSchema,
      type: 'number',
      default: typeof schema.default === 'number' ? schema.default : undefined,
      description: getDesc(hasLimitation, schema),
      'x-component': 'NumberInput',
      'x-onchange-prop-name': hasLimitation ? 'onValueChange' : 'onChange',
      'x-title-size': 'h4',
      'x-raw': true,
      'x-validator': [
        {
          exclusiveMinimum: schema.minimum,
        },
        {
          exclusiveMaximum: schema.maximum,
        },
        {
          // required,
        },
      ],
      'x-component-props': {
        min: schema.minimum,
        max: schema.maximum,
        step: 0.01,
        precision: hasLimitation ? null : 2,
        controls: false,
        wrapperClassName: 'h-7',
        size: '2xs',
        inputClassName: 'text-center h-7 w-44',
      },
    };
  }
  return {
    ...newSchema,
    'x-layout': schema.multiline ? 'Vertical' : 'Horizontal',
    'x-component': schema.multiline ? 'Textarea' : 'Input',
    'x-raw': true,
    'x-component-props': {
      size: '2xs',
      className: ' w-44',
    },
    'x-validator': [
      {
        // required,
      },
    ],
  };
}

const getSchemaByWidget = ({
  input_schema,
  output_schema,
}: {
  input_schema?: JsonSchema7 | Record<string, JsonSchema7>;
  output_schema?: JsonSchema7;
}): ISchema => {
  const properties: { [key: string]: ISchema } = {};
  if (!isEmpty(input_schema)) {
    const schema = resolveRefs(input_schema as JsonSchema7, input_schema);
    schema.title = 'Input';
    properties.inputs = addCustomUIProperties(schema);
  }

  const types = getTypesFromSchema(output_schema!);

  if (!isEmpty(output_schema)) {
    properties.outputs = {
      type: 'object',
      title: 'Output',
      description: output_schema.description,
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-collapsible': true,
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
    };
  }
  return {
    type: 'object',
    'x-type': 'Section',
    'x-title-size': 'h4',
    properties: {
      ...properties,
      render: {
        'x-type': 'Render',
        'x-component': 'Render',
      },
    },
  };
};
export { getSchemaByWidget };
export { getTypesFromSchema } from './get-widget-schema-utils';
