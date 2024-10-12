import {
  getDefaultValueBySchema,
  TFieldMode,
  ISchema,
} from '@shellagent/form-engine';
import { FormRef, Spinner } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { useInjection } from 'inversify-react';
import { merge } from 'lodash-es';
import { nanoid } from 'nanoid';
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { WidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';
import { SettingsModel } from '@/components/settings/settings.model';
import { useAppStore } from '@/stores/app/app-provider';

import { COMFYUI_API, DEFAULT_COMFYUI_API } from './constant';
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

  const model = useInjection(SettingsModel);

  useEffect(() => {
    const initializeForm = async () => {
      const values = formRef.current?.getValues();
      if (!values?.comfy_workflow_id) {
        formRef.current?.setValue('comfy_workflow_id', nanoid());
      }
      // 从环境变量中获取参数
      const settings = await model.loadSettingsEnv();
      const api =
        settings?.envs?.find(env => env.key === COMFYUI_API)?.value ||
        DEFAULT_COMFYUI_API;
      formRef.current?.setValue('api', api);
    };

    initializeForm();
  }, [model]);

  const defaultValues = useMemo(
    () => getDefaultValueBySchema(schema, false),
    [schema],
  );

  useEffect(() => {
    onChange(merge({}, defaultValues, values));
  }, [defaultValues]);

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
      {isLoading && (
        <div className="h-[100px] flex justify-center items-center">
          <Spinner size="lg" className="text-brand" />
        </div>
      )}
    </div>
  );
};

export default ComfyUIPlugin;
