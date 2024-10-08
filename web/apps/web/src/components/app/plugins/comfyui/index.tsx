import React, { useRef, useEffect, useState } from 'react';
import { ISchema } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';

import { WidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';
import { generateUUID } from '@/utils/common-helper';
import { useRequest } from 'ahooks';
import { getFile } from './services';

import { getComfyuiSchema, defaultSchema } from './schema';
import { ComfyUIEditor } from './widgets/comfyui-editor';

const ComfyUIPlugin: React.FC<WidgetConfigProps> = ({ values, onChange }) => {
  const formRef = useRef<FormRef>(null);
  const [schema, setSchema] = useState<ISchema>(defaultSchema);

  useEffect(() => {
    const values = formRef.current?.getValues();
    if (!values?.comfy_workflow_id) {
      formRef.current?.setValue('comfy_workflow_id', generateUUID());
    }
  }, []);

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
        components={{
          ComfyUIEditor,
        }}
      />
    </div>
  );
};

export default ComfyUIPlugin;
