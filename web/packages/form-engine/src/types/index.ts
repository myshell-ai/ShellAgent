import { FieldValues, FieldValue, FieldPath, Mode } from '@shellagent/ui';
import { FieldMode } from '@shellagent/shared/protocol/extend-config';

import { ISchema } from './schema';

export declare type JSXComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;
export declare type SchemaReactComponents = Record<string, JSXComponent>;
export type TPath = FieldPath<FieldValues>;

export type TContext = { [key: string]: any };
export type TValues = FieldValues;
export type TValue = FieldValue<FieldValues>;

export type TField = {
  path: TPath;
  parent: TPath;
  schema: ISchema;
  error?: boolean;
  state?: {
    value?: TValue;
  };
  context: TContext;
};

export type TFields = {
  [path: TPath]: TField;
};

export type TMode = Mode;

export type TFieldMode = FieldMode;

export * from './schema';
export * from './uiSchema';
