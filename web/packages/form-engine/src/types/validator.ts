export declare type ValidatorFormats =
  | 'url'
  | 'email'
  | 'ipv6'
  | 'ipv4'
  | 'number'
  | 'integer'
  | 'money'
  | 'date'
  | (string & {});

export interface IValidatorRules {
  format?: ValidatorFormats;
  // validator?: ValidatorFunction<Context>;
  required?: boolean;
  pattern?: RegExp;
  max?: number;
  maximum?: number;
  maxItems?: number;
  minItems?: number;
  maxLength?: number;
  minLength?: number;
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  minimum?: number;
  min?: number;
  length?: number;
  enum?: any[];
  const?: any;
  multipleOf?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  message?: string;
  [key: string]: any;
}
