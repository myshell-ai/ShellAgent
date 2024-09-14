/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
import {
  ISchema,
  resolveRefs,
  addCustomUIProperties,
  JsonSchema,
  isUpperCase,
  canConvertVariable,
} from '@shellagent/form-engine';
import { entries, get, set } from 'lodash-es';
import { JsonSchema7 } from 'node_modules/@shellagent/form-engine/src/types/jsonSchema7';

const getVariableBySchema = (schema: ISchema, parentKey = '', result = {}) => {
  const upperCaseEntries: [string, string][] = [];
  const lowerCaseEntries: [string, string][] = [];
  entries(schema.properties).forEach(([key, prop]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (prop.hidden) {
      return;
    }
    if (prop.type === 'object' && prop.properties) {
      getVariableBySchema(prop, newKey, result); // 递归处理嵌套的对象
    } else {
      const fieldType = prop['x-field-type'] || prop.type;
      // 根据type是否为小写进行分类
      if (fieldType === fieldType?.toLowerCase()) {
        lowerCaseEntries.push([
          newKey,
          prop['x-field-type'] || fieldType || '',
        ]);
      } else {
        upperCaseEntries.push([
          newKey,
          prop['x-field-type'] || fieldType || '',
        ]);
      }
    }
  });
  upperCaseEntries.forEach(([key, value]) => {
    set(result, key!, value);
  });
  lowerCaseEntries.forEach(([key, value]) => {
    set(result, key!, value);
  });
  return result;
};

function splitSchemaByType(
  schema: JsonSchema7,
  fieldsModeMap?: Record<string, string>,
): [JsonSchema7, JsonSchema7] {
  const variableSchema: JsonSchema7 = {
    ...schema,
    properties: {},
    required: [],
  };

  const baseSchema: JsonSchema7 = {
    ...schema,
    properties: {},
    required: [],
  };

  Object.keys(schema.properties || {}).forEach(key => {
    const property = get(schema.properties, key);

    if (property?.type === 'object' && property?.properties) {
      // 递归处理嵌套的对象
      const [nestedLowerCaseSchema, nestedUpperCaseSchema] =
        splitSchemaByType(property);

      if (Object.keys(nestedLowerCaseSchema?.properties || {}).length > 0) {
        set(baseSchema, ['properties', key], nestedLowerCaseSchema);
        if (schema?.required?.includes(key)) {
          set(baseSchema, ['required'], [...(baseSchema.required || []), key]);
        }
      }

      if (Object.keys(nestedUpperCaseSchema?.properties || {}).length > 0) {
        set(variableSchema, ['properties', key], nestedUpperCaseSchema);
        if (schema?.required?.includes(key)) {
          set(
            variableSchema,
            ['required'],
            [...(variableSchema.required || []), key],
          );
        }
      }
    } else if (
      get(fieldsModeMap, key) === 'ref' ||
      (isUpperCase(property?.type || '') &&
        property?.type !== canConvertVariable)
    ) {
      set(variableSchema, ['properties', key], property);
      if (schema?.required?.includes(key)) {
        set(
          variableSchema,
          ['required'],
          [...(variableSchema.required || []), key],
        );
      }
    } else {
      set(baseSchema, ['properties', key], property);
      if (schema?.required?.includes(key)) {
        set(baseSchema, ['required'], [...(baseSchema.required || []), key]);
      }
    }
  });

  return [baseSchema, variableSchema];
}

const getSchemaByWidget = ({
  name,
  inputSchema,
  outputSchema,
  fieldsModeMap,
}: {
  name: string;
  inputSchema?: JsonSchema7 | Record<string, JsonSchema7>;
  outputSchema?: JsonSchema7;
  fieldsModeMap?: Record<string, string>;
}): {
  formSchema: ISchema;
  resolveRefsSchema: JsonSchema7;
} => {
  const properties: { [key: string]: ISchema } = {};
  let resolveRefsSchema: JsonSchema = {};

  if (inputSchema) {
    resolveRefsSchema = resolveRefs(inputSchema as JsonSchema7, inputSchema);
    const [baseSchema, variableSchema] = splitSchemaByType(
      resolveRefsSchema as JsonSchema7,
      fieldsModeMap,
    );
    properties.variable = {
      type: 'object',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-component': 'VariableNode',
      'x-class': 'mt-0',
      properties: {
        input_variable: variableSchema as ISchema,
        output_variable: outputSchema as ISchema,
      },
    };
    properties.input = addCustomUIProperties(baseSchema);
  }
  // const types = getTypesFromSchema(output_schema!);

  return {
    formSchema: {
      type: 'object',
      title: name,
      'x-type': 'Section',
      'x-title-size': 'h4',
      'x-title-copiable': true,
      'x-class':
        'mt-2 space-y-1.5 bg-surface-container-default rounded-lg p-1.5',
      properties: {
        ...properties,
        render: {
          'x-type': 'Render',
          'x-component': 'Render',
        },
      },
    },
    resolveRefsSchema,
  };
};

export { getSchemaByWidget, getVariableBySchema };
export { getTypesFromSchema } from './get-widget-schema-utils';
