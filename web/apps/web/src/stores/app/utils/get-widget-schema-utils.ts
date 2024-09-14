import { capitalize } from 'lodash-es';
import { JsonSchema7 } from 'node_modules/@shellagent/form-engine/src/types/jsonSchema7';

function processObject(properties: { [property: string]: JsonSchema7 }) {
  const result: { [key: string]: any } = {};
  Object.entries(properties).forEach(([key, property]) => {
    if (property.type === 'object') {
      result[key] = processObject(property.properties || {});
    } else {
      result[key] = capitalize(property.type);
    }
  });
  return result;
}

export const getTypesFromSchema = (
  schema: JsonSchema7,
): { [key: string]: any } => {
  const types: { [key: string]: any } = {};

  if (schema?.properties) {
    Object.entries(schema.properties).forEach(([key, property]) => {
      if (Object.prototype.hasOwnProperty.call(schema.properties, key)) {
        if (property.type) {
          if (property.type === 'array' && property.items) {
            const { type, properties } = property.items as JsonSchema7;
            if (type === 'object' && properties) {
              const properties = (property.items as JsonSchema7).properties!;
              types[key] = [processObject(properties)];
            } else {
              types[key] = `Array<${type}>`;
            }
          } else {
            types[key] = property.type;
          }
        }
        if (property.properties) {
          types[key] = {
            type: property.type,
            properties: getTypesFromSchema(property),
          };
        }
      }
    });
  }

  return types;
};
