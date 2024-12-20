import {
  getDefaultValueBySchema,
  ISchema,
  TValues,
} from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { isEmpty, merge } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { CommonWidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';

import { useEventEmitter, EventType } from './emitter';
import { getComfyuiSchema, defaultSchema } from './schema';
import { getFile } from './services';
import { generateHash } from './utils';
import { ComfyUIEditor } from './widgets/comfyui-editor';

const ComfyUIPlugin: React.FC<CommonWidgetConfigProps> = ({
  values,
  onChange,
  parent,
}) => {
  const formRef = useRef<FormRef>(null);
  const [schema, setSchema] = useState<ISchema>(defaultSchema);

  useEffect(() => {
    const values = formRef.current?.getValues();
    if (!values?.comfy_workflow_id) {
      formRef.current?.setValue('comfy_workflow_id', generateHash());
    }
  }, []);

  const defaultValues = useMemo(
    () => getDefaultValueBySchema(schema, false),
    [schema],
  );

  const mergeValues = (formValues: TValues, newValues?: TValues) => {
    const result = {
      ...merge({}, formValues, newValues),
      inputs: isEmpty(formValues?.inputs)
        ? newValues?.inputs
        : Object.keys(formValues?.inputs || {})?.reduce((prev, key) => {
            prev[key] = newValues?.inputs?.[key] || formValues?.inputs?.[key];
            return prev;
          }, {} as any),
      outputs: !isEmpty(formValues?.outputs?.display)
        ? formValues?.outputs
        : newValues?.outputs,
    };
    return result;
  };

  const handleOnChange = useCallback(
    (newValues: TValues) => {
      onChange(mergeValues(defaultValues, newValues));
    },
    [defaultValues, onChange],
  );

  useEffect(() => {
    onChange(mergeValues(defaultValues, values));
  }, [schema]);

  const { run: getComfySchema, loading: isLoading } = useRequest(getFile, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        const {
          data: { schemas },
        } = result;
        setSchema(
          getComfyuiSchema({
            inputs: schemas.inputs || {},
            outputs: schemas.outputs || {},
          }),
        );
      }
    },
  });

  useEffect(() => {
    if (values?.comfy_workflow_id) {
      getComfySchema({
        comfy_workflow_id: values?.comfy_workflow_id,
        filename: 'workflow.shellagent.json',
      });
    }
  }, [values?.comfy_workflow_id]);

  useEventEmitter(EventType.UPDATE_FORM, eventData => {
    if (eventData.id === values?.comfy_workflow_id) {
      setSchema(
        getComfyuiSchema({
          inputs: eventData?.data?.inputs || {},
          outputs: eventData?.data?.outputs || {},
        }),
      );
    }
  });

  if (!values) {
    return null;
  }

  return (
    <div className="comfyui-widget flex flex-col">
      <NodeForm
        parent={parent}
        ref={formRef}
        key={JSON.stringify(schema)}
        schema={schema}
        values={values}
        onChange={handleOnChange}
        loading={isLoading}
        components={{
          ComfyUIEditor,
        }}
      />
    </div>
  );
};

export default observer(ComfyUIPlugin);
