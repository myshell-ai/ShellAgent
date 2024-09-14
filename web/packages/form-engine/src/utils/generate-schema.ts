/* eslint-disable */
import { entries, includes, merge, omit } from 'lodash-es';

import { uuid } from './uuid';
import { ISchema, SchemaTypes, TValue } from '../types';
import { JsonSchema7 } from '../types/jsonSchema7';

const canConvertVariable = 'CKPT_PATH';

function isUpperCase(str: string) {
  return !/[a-z]/.test(str);
}

function getDefaultValueBySchema(
  schema: ISchema,
  initializeDefaults: boolean = true,
): TValue {
  const { type, default: defaultValue, properties, items } = schema;

  if ('default' in schema && schema.default !== undefined) {
    return defaultValue === '{{uuid}}' ? uuid() : defaultValue;
  }

  if (type === 'string') {
    return initializeDefaults ? '' : undefined;
  }
  if (type === 'number') {
    return initializeDefaults ? 0 : undefined;
  }
  if (type === 'boolean') {
    return initializeDefaults ? false : undefined;
  }
  if (type === 'object' || type === 'void') {
    const result: TValue = {};
    if (properties) {
      Object.keys(properties).forEach(key => {
        if (properties[key].type === 'void') {
          merge(
            result,
            getDefaultValueBySchema(properties[key]),
            initializeDefaults,
          );
        } else {
          result[key] = getDefaultValueBySchema(
            properties[key],
            initializeDefaults,
          );
        }
      });
    }

    if (Object.keys(result).length === 0) {
      return initializeDefaults ? result : undefined;
    }

    return result;
  }
  if (type === 'array') {
    const result: TValue[] = [];

    if (items) {
      if (Array.isArray(items)) {
        items.forEach(item => {
          result.push(getDefaultValueBySchema(item, initializeDefaults));
        });
      } else {
        result.push(getDefaultValueBySchema(items, initializeDefaults));
      }
    }

    if (result.length === 0) {
      return initializeDefaults ? result : undefined;
    }

    return result;
  }
  return null;
}

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
    if (schema?.visible === false || schema?.hidden) {
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
    title: undefined,
    type: 'object',
    'x-type': 'Block',
    'x-title-size': 'h4',
    'x-title-copiable': true,
  };

  if (schema?.visible === false || schema?.hidden) {
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
    'x-title-copiable': true,
    'x-title-size': 'h4',
  };

  if (schema?.visible === false || schema?.hidden) {
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
        'x-title-copiable': true,
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
        'x-title-copiable': true,
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
        'x-title-copiable': true,
      },
    };
  } else if (
    schema.items?.type &&
    includes(['string', 'number', 'integer'], schema.items?.type)
  ) {
    newSchema = {
      ...newSchema,
      items: undefined,
      additionalItems: {
        ...addCustomUIProperties(schema.items),
        'x-component': 'Input',
        'x-class': 'border-0 bg-inherit rounded-lg p-0 pt-3',
        'x-type': 'Control',
        // 'x-role': 'core',
        'x-deletable': true,
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
      ? entries(schema.items || {}).reduce((prev, [key, item]) => {
          if (key === 'anyOf') {
            const anyofList: ISchema[] = item?.map((field: ISchema) => ({
              ...addCustomUIProperties(field),
              'x-type': 'Card',
              'x-role': 'core',
              'x-deletable': true,
              'x-title-copiable': true,
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
        'x-title-copiable': true,
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
  if (schema?.visible === false || schema?.hidden) {
    newSchema['x-hidden'] = true;
  }

  if (schema.type === canConvertVariable) {
    return {
      ...newSchema,
      type: 'string',
      'x-field-type': canConvertVariable,
      'x-component': 'Input',
      'x-component-props': {
        size: '2xs',
      },
    };
  }

  if (newSchema.image_uplaod) {
    return {
      ...newSchema,
      title: undefined,
      'x-hidden-title': true,
      'x-component': 'ImageSelector',
      'x-component-props': {
        title: newSchema.title,
        triggerClassName: 'h-7',
        options: newSchema?.choices?.map(item => ({
          label: item,
          value: item,
        })),
      },
      'x-layout': 'Vertical',
      'x-validator': [
        {
          // required,
        },
      ],
    };
  }
  if (newSchema.video_upload) {
    return {
      ...newSchema,
      title: undefined,
      'x-hidden-title': true,
      'x-component': 'VideoSelector',
      'x-component-props': {
        title: newSchema.title,
        triggerClassName: 'h-7',
        options: newSchema?.choices?.map(item => ({
          label: item,
          value: item,
        })),
      },
      'x-layout': 'Vertical',
      'x-validator': [
        {
          // required,
        },
      ],
    };
  }
  if (newSchema.audio_upload) {
    return {
      ...newSchema,
      title: undefined,
      'x-hidden-title': true,
      'x-component': 'AudioSelector',
      'x-component-props': {
        title: newSchema.title,
        triggerClassName: 'h-7',
        options: newSchema?.choices?.map(item => ({
          label: item,
          value: item,
        })),
      },
      'x-layout': 'Vertical',
      'x-validator': [
        {
          // required,
        },
      ],
    };
  }

  if (newSchema.choices?.length) {
    const choices = newSchema.choices.filter(item => typeof item === 'string');
    return {
      ...newSchema,
      enum: choices,
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
        triggerClassName: 'h-7',
        size: '2xs',
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
      'x-component': 'Checkbox',
      'x-onchange-prop-name': 'onCheckedChange',
      'x-value-prop-name': 'checked',
      'x-component-props': {
        size: '2xs',
      },
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
      'x-component': 'Select',
      'x-component-props': {
        triggerClassName: 'h-7',
        options: newSchema.enum.map(item => {
          if (Array.isArray(item)) {
            return {
              label: item[0],
              value: item[0],
            };
          }
          return {
            label: item,
            value: item,
          };
        }),
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
        inputClassName: 'text-center h-7',
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
        inputClassName: 'text-center h-7',
      },
    };
  }
  return {
    ...newSchema,
    'x-layout': schema.multiline ? 'Vertical' : 'Horizontal',
    'x-component': schema.multiline ? 'Textarea' : 'Input',
    'x-component-props': {
      size: '2xs',
    },
    'x-validator': [
      {
        // required,
      },
    ],
  };
}

export {
  isUpperCase,
  getDefaultValueBySchema,
  addCustomUIProperties,
  canConvertVariable,
};
