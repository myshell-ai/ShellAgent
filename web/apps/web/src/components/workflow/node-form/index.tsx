import {
  MemoizedFormEngine,
  ISchema,
  TValues,
  TFieldMode,
  getDefaultValueBySchema,
} from '@shellagent/form-engine';
import {
  Select,
  Checkbox,
  Input,
  NumberInput,
  RadioGroup,
  Switch,
  Textarea,
  Slider,
  SliderSingle,
  JSONView,
  FormRef,
} from '@shellagent/ui';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useMemo, forwardRef } from 'react';

import FileUpload from '@/components/common/uploader';
import { useSchemaContext } from '@/stores/workflow/schema-provider';

import FormSkeleton from './form-skeleton';
import {
  ExpressionInput,
  ModeTabs,
  VariableSelect,
  ModeSelect,
  Render,
} from './widgets';

interface NodeFormProps {
  values: TValues;
  schema?: ISchema;
  onChange: (values: TValues) => void;
  loading?: boolean;
}

const NodeForm = forwardRef<FormRef, NodeFormProps>(
  ({ values, onChange, schema, loading }, ref) => {
    const { schemaMode, schema: formSchema } = useSchemaContext(state => ({
      schemaMode: state.schemaMode,
      schema: state.schema,
    }));

    const currentSchema = schema || formSchema;
    const defaultValues = useMemo(
      () => getDefaultValueBySchema(currentSchema, false),
      [currentSchema],
    );

    useEffect(() => {
      if (!loading && isEmpty(values) && !isEmpty(defaultValues)) {
        onChange(defaultValues);
      }
    }, [currentSchema, loading, defaultValues]);

    if (loading || isEmpty(currentSchema)) {
      return <FormSkeleton />;
    }
    return (
      <MemoizedFormEngine
        ref={ref}
        key={schemaMode}
        onChange={onChange}
        mode="onChange"
        values={values || defaultValues}
        schema={currentSchema}
        components={{
          Input,
          Select,
          RadioGroup,
          Checkbox,
          NumberInput,
          Switch,
          Textarea,
          Slider,
          SliderSingle,
          ExpressionInput,
          VariableSelect,
          JSONView,
          FileUpload,
          ModeTabs,
          ModeSelect,
          Render,
        }}
      />
    );
  },
);

NodeForm.displayName = 'NodeForm';

export default NodeForm;
