import { JsonSchema7 as JsonSchema } from './jsonSchema7';
import { IUISchema } from './uiSchema';

export type SchemaTypes =
  | 'string'
  | 'object'
  | 'array'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'void';

export interface ISchema extends JsonSchema, IUISchema {
  type?: SchemaTypes;
  default?:
    | string
    | number
    | boolean
    | object
    | string[]
    | number[]
    | boolean[]
    | object[];
  properties?: { [property: string]: ISchema };
  additionalProperties?: ISchema | boolean;
  additionalItems?: ISchema | boolean;
  items?: ISchema | ISchema[];
  choices?: { value: string; label: string }[];
}
