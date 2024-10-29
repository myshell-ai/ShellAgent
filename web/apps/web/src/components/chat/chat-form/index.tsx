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

import FormSkeleton from './form-skeleton';

interface ChatFormProps {
  values: TValues;
  schema?: ISchema;
  onChange: (values: TValues) => void;
  loading?: boolean;
  modeMap?: Record<string, TFieldMode>;
  onModeChange?: (name: string, mode: TFieldMode) => void;
}

const defaultSchema = {
  properties: {
    prompt: {
      type: 'string',
      description: null,
      default: null,
    },
  },
  required: ['prompt'],
};

const ChatForm = forwardRef<FormRef, ChatFormProps>(
  ({ values, onChange, schema, loading, onModeChange, modeMap }, ref) => {
    const currentSchema = schema || (defaultSchema as any);
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
        key={JSON.stringify(currentSchema)}
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
        }}
      />
    );
  },
);

ChatForm.displayName = 'ChatForm';

export default ChatForm;
