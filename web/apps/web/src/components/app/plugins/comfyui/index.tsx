import {
  TValues,
  getDefaultValueBySchema,
  TFieldMode,
  ISchema,
} from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { merge } from 'lodash-es';
import { nanoid } from 'nanoid';
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { useAppStore } from '@/stores/app/app-provider';

import { WidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';
import { useEventEmitter, EventType } from './emitter';

import { getComfyuiSchema, defaultSchema } from './schema';
import { getFile } from './services';
import { ComfyUIEditor } from './widgets/comfyui-editor';

const ComfyUIPlugin: React.FC<WidgetConfigProps> = ({
  values,
  onChange,
  id,
  parent,
}) => {
  const formRef = useRef<FormRef>(null);
  const [schema, setSchema] = useState<ISchema>(defaultSchema);

  const { setFieldsModeMap, fieldsModeMap } = useAppStore(state => ({
    setFieldsModeMap: state.setFieldsModeMap,
    fieldsModeMap: state.config?.fieldsModeMap,
  }));

  useEffect(() => {
    const values = formRef.current?.getValues();
    if (!values?.comfy_workflow_id) {
      formRef.current?.setValue('comfy_workflow_id', nanoid());
    }
  }, []);

  const defaultValues = useMemo(
    () => getDefaultValueBySchema(schema, false),
    [schema],
  );

  useEffect(() => {
    onChange(merge({}, defaultValues, values));
  }, [defaultValues]);

  console.log('values', values);

  const { run: getComfySchema } = useRequest(getFile, {
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

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id: `${id}.${parent}`, name, mode });
    },
    [id, setFieldsModeMap, parent],
  );

  if (!values) {
    return null;
  }

  return (
    <div className="comfyui-widget flex flex-col">
      <NodeForm
        ref={formRef}
        key={JSON.stringify(schema)}
        schema={schema}
        values={values}
        onChange={onChange}
        onModeChange={onModeChange}
        modeMap={fieldsModeMap?.[`${id}.${parent}`] || {}}
        components={{
          ComfyUIEditor,
        }}
      />
    </div>
  );
};

export default ComfyUIPlugin;
