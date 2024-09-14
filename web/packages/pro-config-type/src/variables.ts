export type URLString = string;

interface VariableBase {
  type: string;
  /** Explanation for variable. For inputs, it is also displayed as a form label.*/
  name?: string;
  value?: unknown;
}
interface TextVar extends VariableBase {
  type: 'text' | 'string'; // TODO 统一text和string
  value?: string | Expression;
}
interface NumVar extends VariableBase {
  type: 'number' | 'integer';
  value?: number | NumExpression;
}
interface BoolVar extends VariableBase {
  type: 'boolean';
  value?: boolean | BoolExpression;
}
interface FileVar extends VariableBase {
  type: 'image' | 'audio' | 'video' | 'text_file' | 'file';
  value?: URLString | Expression;
}
/**
 * @example
 * "list_input": {
	type: array,
	items: {
		type: image, 
	}
}
 */
interface ArrayVar extends VariableBase {
  type: 'array';
  items?: VariableDefinition;
  value?: unknown[] | Expression;
}
interface ObjectVar extends VariableBase {
  type: 'object';
  properties?: Record<string, VariableDefinition>;
  value?: Record<string, unknown> | Expression;
}

/**
 * @deprecated
 * IM type is equivalent to { type: 'text', source: 'IM' }
 **/
type IMVar = {
  type: 'IM';
  value?: string;
};

export type Variable =
  | TextVar
  | NumVar
  | BoolVar
  | FileVar
  | ArrayVar
  | ObjectVar;
type VariableDefinition = Omit<Variable, 'value'>;

export type Value = NonNullable<Variable['value']> | Expression;

type Choices<T> = Array<T | Expression> | Expression; // TODO: Array<Value | { label?: string; value: Value }>;
interface InputVariableBase extends VariableBase {
  /** Validates the input. */
  validations?: Validation[];
  /** Displayed as a form description */
  description?: string | Expression;
  default_value?: unknown | Expression;
  /** Select input options.*/
  choices?: Choices<unknown>;
  /** Defaults false. Asks user to input if set true. */
  user_input?: boolean;
  /** If `source` exists, `user_input` is set to `true` */
  source?: 'IM' | 'form';
}
interface InputTextVar extends TextVar, InputVariableBase {
  type: 'text' | 'string';
  value?: string | Expression;
  default_value?: string | Expression;
  choices?: Choices<string>;
}
interface InputNumVar extends NumVar, InputVariableBase {
  type: 'number' | 'integer';
  value?: number | NumExpression;
  default_value?: number | Expression;
  choices?: Choices<number>;
}
interface InputBoolVar extends BoolVar, InputVariableBase {
  type: 'boolean';
  value?: boolean | BoolExpression;
  default_value?: boolean | Expression;
  choices?: Choices<boolean>;
}
interface InputFileVar extends FileVar, InputVariableBase {
  type: 'image' | 'audio' | 'video' | 'text_file' | 'file';
  value?: URLString | Expression;
  default_value?: URLString | Expression;
  choices?: Choices<URLString>;
}
interface InputArrayVar extends ArrayVar, InputVariableBase {
  type: 'array';
  items?: InputVariableDefinition;
  value?: unknown[] | Expression;
  default_value?: unknown[] | Expression;
  choices?: Choices<unknown[]>;
}
interface InputObjectVar extends ObjectVar, InputVariableBase {
  type: 'object';
  properties?: Record<string, InputVariableDefinition>;
  value?: Record<string, unknown> | Expression;
  default_value?: Record<string, unknown> | Expression;
  choices?: Choices<Record<string, unknown>>;
}

export type Input =
  | InputTextVar
  | InputNumVar
  | InputBoolVar
  | InputFileVar
  | InputFileVar
  | InputArrayVar
  | InputObjectVar;
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;
type InputVariableDefinition = DistributiveOmit<
  Input,
  'value' | 'source' | 'user_input'
>;

export type Validation = {
  /** defaults to true  */
  required?: boolean;
  /** string maxinum char limitation */
  max_length?: number;
  /** max size for uploading a file in bytes */
  max_file_size?: number;
  /** max number for number and integer */
  max_number?: number;
  /** min number for number and integer */
  min_number?: number;
  /** max number for array's items */
  max_items?: number;
  /** min number for array's items */
  min_items?: number;
  // TODO: unimplemented
  error_message?: string;
};

/**
 * Supports ECMAScript 5.1 syntax and certain 6+ features.
 *
 * Expressions within double curly brackets will be evaluated.
 * By default, expressions are evaluated to string.
 *
 * @example
 * "{{ cnt > 10 }}"
 */
export type Expression = `{{${string}}}`;

/** Expression that is evaluated to boolean */
export type BoolExpression = Expression;
/** Expression that is evaluated to number */
export type NumExpression = Expression;
