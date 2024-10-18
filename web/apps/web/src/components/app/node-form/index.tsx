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
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, forwardRef } from 'react';

import FileUpload from '@/components/common/uploader';
import { useSchemaContext } from '@/stores/app/schema-provider';

import FormSkeleton from './form-skeleton';
import {
  ExpressionInput,
  ModeTabs,
  VariableSelect,
  ModeSelect,
  Render,
  // TasksConfig,
  MessagePreview,
  ButtonEditor,
  WorkflowSelect,
  TransitionConditionEditor,
  VariableNameInput,
} from './widgets';
import { OpenImageCanvas } from '../../image-canvas/open-image-canvas';

const TasksConfig = dynamic(
  () => import('./widgets/tasks-config').then(module => module.TasksConfig),
  { ssr: false },
);

interface NodeFormProps {
  values: TValues;
  schema?: ISchema;
  onChange: (values: TValues) => void;
  loading?: boolean;
  parent?: string;
  modeMap?: Record<string, TFieldMode>;
  onModeChange?: (name: string, mode: TFieldMode) => void;
  components?: Record<string, React.FC<any>>;
}

const NodeForm = forwardRef<FormRef, NodeFormProps>(
  (
    {
      values,
      onChange,
      schema,
      loading,
      onModeChange,
      modeMap,
      parent,
      components = {},
    },
    ref,
  ) => {
    const { schema: formSchema, formKey } = useSchemaContext(state => ({
      schema: state.schema,
      formKey: state.formKey,
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
        key={formKey}
        onChange={onChange}
        mode="onChange"
        values={values || defaultValues}
        schema={currentSchema}
        modeMap={modeMap}
        parent={parent}
        onModeChange={onModeChange}
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
          TasksConfig,
          Render,
          MessagePreview,
          ButtonEditor,
          WorkflowSelect,
          TransitionConditionEditor,
          VariableNameInput,
          OpenImageCanvas,
          ...components,
        }}
      />
    );
  },
);

NodeForm.displayName = 'NodeForm';

export default NodeForm;
