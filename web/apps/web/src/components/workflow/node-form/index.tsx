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

import AudioSelector from '@/components/common/audio-selector';
import ImageSelector from '@/components/common/image-selector';
import FileUpload from '@/components/common/uploader';
import VideoSelector from '@/components/common/video-selector';
import { useSchemaContext } from '@/stores/workflow/schema-provider';

import FormSkeleton from './form-skeleton';
import {
  ModeTabs,
  ModeSelect,
  Render,
  VariableNode,
  TargetVariablePointer,
  SourceVariablePointer,
} from './widgets';

interface NodeFormProps {
  values: TValues;
  schema?: ISchema;
  onChange: (values: TValues) => void;
  loading?: boolean;
  modeMap?: Record<string, TFieldMode>;
  onModeChange?: (name: string, mode: TFieldMode) => void;
}

const NodeForm = forwardRef<FormRef, NodeFormProps>(
  ({ values, onChange, schema, loading, onModeChange, modeMap }, ref) => {
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
          JSONView,
          FileUpload,
          ModeTabs,
          ModeSelect,
          Render,
          VariableNode,
          TargetVariablePointer,
          SourceVariablePointer,
          ImageSelector,
          VideoSelector,
          AudioSelector,
        }}
      />
    );
  },
);

NodeForm.displayName = 'NodeForm';

export default NodeForm;
