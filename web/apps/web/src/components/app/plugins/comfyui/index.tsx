import { ISchema } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';

import { CommonWidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';

import { defaultSchema, getComfyUISchema } from './schema';
import { getFile } from './services';
import { generateHash } from './comfyui-utils';
import { ComfyUIEditor } from './widgets/comfyui-editor';
import { useInjection } from 'inversify-react';
import {
  ComfyUIModel,
  EventType,
} from '@/components/app/plugins/comfyui/comfyui.model';
import { useSchemaContext } from '@/stores/app/schema-provider';

export const ComfyUIPlugin = observer<CommonWidgetConfigProps>(
  ({ values, onChange, parent }) => {
    const model = useInjection<ComfyUIModel>('ComfyUIModel');

    useEffect(() => {
      model.emitter.on(EventType.UPDATE_FORM, evt => {
        if (evt.id === values?.comfy_workflow_id) {
          setSchema(
            getComfyUISchema({
              inputs: evt?.data?.inputs || {},
              outputs: evt?.data?.outputs || {},
            }),
          );
        }
      });
      return () => {
        model.emitter.off(EventType.UPDATE_FORM);
      };
    }, []);

    const formRef = useRef<FormRef>(null);
    const [schema, setSchema] = useState<ISchema>(defaultSchema);

    const { run: getComfySchema, loading: isLoading } = useRequest(getFile, {
      manual: true,
      onSuccess: result => {
        if (result.success) {
          const {
            data: { schemas },
          } = result;
          setSchema(
            getComfyUISchema({
              inputs: schemas.inputs || {},
              outputs: schemas.outputs || {},
            }),
          );
        }
      },
    });

    useEffect(() => {
      const values = formRef.current?.getValues();
      if (!values?.comfy_workflow_id) {
        formRef.current?.setValue('comfy_workflow_id', generateHash());
      }
    }, []);

    useEffect(() => {
      formRef.current?.setValue('api', model.comfyUIUrl);
    }, [model.comfyUIUrl]);

    useEffect(() => {
      if (values?.comfy_workflow_id || values?.location) {
        getComfySchema({
          comfy_workflow_id: values?.comfy_workflow_id,
          location: values?.location,
          filename: 'workflow.shellagent.json',
        });
      }
    }, [values?.location, values?.comfy_workflow_id]);

    if (!values) {
      return null;
    }

    const { id: stateId } = useSchemaContext(state => ({
      id: state.id,
    }));

    return (
      <div className="comfyui-widget flex flex-col">
        <NodeForm
          parent={parent}
          ref={formRef}
          key={JSON.stringify(schema)}
          schema={schema}
          values={values}
          onChange={newValues => {
            const appModel = model.appBuilderModelFactory();
            appModel.nodeData[stateId].blocks = appModel.nodeData[
              stateId
            ].blocks.map((b: any) => {
              if (parent.endsWith(b.name)) {
                return newValues;
              }
              return b;
            });
          }}
          loading={isLoading}
          components={{
            ComfyUIEditor,
          }}
        />
      </div>
    );
  },
);
