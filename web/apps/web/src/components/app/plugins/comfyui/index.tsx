import {
  getDefaultValueBySchema,
  ISchema,
  TValues,
} from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { useInjection } from 'inversify-react';
import { merge } from 'lodash-es';
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { CommonWidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';
import { SettingsModel } from '@/components/settings/settings.model';

import { COMFYUI_API, DEFAULT_COMFYUI_API } from './constant';
import { useEventEmitter, EventType } from './emitter';
import { getComfyuiSchema, defaultSchema } from './schema';
import { getFile } from './services';
import { generateHash } from './utils';
import { ComfyUIEditor } from './widgets/comfyui-editor';
import { observer } from 'mobx-react-lite';

const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

const ComfyUIPlugin: React.FC<CommonWidgetConfigProps> = observer(
  ({ values, onChange, modeMap, onModeChange, parent }) => {
    const formRef = useRef<FormRef>(null);
    const [schema, setSchema] = useState<ISchema>(defaultSchema);

    const model = useInjection(SettingsModel);

    useEffect(() => {
      const initializeForm = async () => {
        const values = formRef.current?.getValues();
        if (!values?.comfy_workflow_id) {
          formRef.current?.setValue('comfy_workflow_id', generateHash());
        }

        if (!settingsDisabled) {
          // 本地版
          const api = model.envs.get(COMFYUI_API);
          onChange({
            ...values,
            api,
          });
        } else {
          // 线上版
          onChange({
            ...values,
            api: DEFAULT_COMFYUI_API,
          });
        }
      };

      initializeForm();
    }, [model.envs.get(COMFYUI_API)]);

    const defaultValues = useMemo(
      () => getDefaultValueBySchema(schema, false),
      [schema],
    );

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

    const handleOnChange = useCallback(
      (newValues: TValues) => {
        onChange(merge({}, defaultValues, newValues));
      },
      [defaultValues, onChange],
    );

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
          onModeChange={onModeChange}
          loading={isLoading}
          modeMap={modeMap}
          components={{
            ComfyUIEditor,
          }}
        />
      </div>
    );
  },
);

export default ComfyUIPlugin;
