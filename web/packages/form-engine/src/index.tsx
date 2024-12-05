import {
  Form,
  Heading,
  Text,
  useForm,
  FormRef,
  FormProvider,
} from '@shellagent/ui';
import { debounce } from 'lodash-es';
import React, { useEffect, useState, forwardRef } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { EditTitle } from './components/edit-title';
import {
  FormEngineProvider,
  useFormEngineContext,
} from './components/provider';
import Recursion from './components/recursion';
import {
  ISchema,
  SchemaReactComponents,
  TValues,
  TMode,
  TFieldMode,
} from './types';
import createFields from './utils/fields';

export interface IFormEngineProps {
  schema: ISchema;
  components: SchemaReactComponents;
  mode?: TMode;
  values?: TValues;
  parent?: string;
  layout?: 'Horizontal' | 'Vertical';
  onSubmit?: (values: TValues) => void;
  onChange?: (values: TValues) => void;
  children?: React.ReactNode;
  onStatusChange?: (obj: { [key: string]: string }) => void;
}

const FormEngine = forwardRef<FormRef, IFormEngineProps>((props, ref) => {
  const {
    children,
    mode = 'all',
    schema,
    components,
    values = {},
    parent,
    layout,
    onChange,
    onSubmit,
    onStatusChange,
  } = props;

  const [fields, setFields] = useState(createFields(schema, values));

  const form = useForm({
    mode,
    defaultValues: values,
  });
  const { watch, handleSubmit } = form;

  useEffect(() => {
    const subscription = watch(
      debounce(values => {
        // 后续优化，收集依赖列表 deps，
        // if (deps.includes(name) || type !== 'change')
        // 即结构改变或者动态化字段修改，才 createFields
        setFields(createFields(schema, values));
      }, 100),
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = watch(
      debounce(values => {
        if (onChange) {
          onChange(values);
        }
      }, 50),
    );

    return () => subscription.unsubscribe();
  }, []);

  const fallbackRender = (props: FallbackProps) => (
    <div>
      <Heading size="h2" color="critical">
        Caught an error
      </Heading>
      <Text size="sm" color="subtler">
        {props.error.toString()}
      </Text>
      <pre className="bg-surface-subtle p-2 rounded-xl">
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <FormProvider {...form}>
        <Form ref={ref}>
          <FormEngineProvider
            onStatusChange={onStatusChange}
            fields={fields}
            parent={parent}
            layout={layout}
            components={{ ...components, EditTitle }}>
            <form
              onSubmit={e => {
                e.preventDefault();
                onSubmit ? handleSubmit(onSubmit) : undefined;
              }}>
              <Recursion />
              {children}
            </form>
          </FormEngineProvider>
        </Form>
      </FormProvider>
    </ErrorBoundary>
  );
});

const FieldsSlot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const MemoizedFormEngine = React.memo(FormEngine, () => true);

export { FormEngine, FieldsSlot, MemoizedFormEngine, useFormEngineContext };
export type { ISchema, TValues, TFieldMode };
export * from './utils/generate-schema';
export * from './utils/resolve-refs';
