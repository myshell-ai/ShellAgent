import React, { useRef, useEffect } from 'react';
import { FormRef } from '@shellagent/ui';

import { WidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';
import { generateUUID } from '@/utils/common-helper';
import { useRequest } from 'ahooks';
import { getFile } from './services';

import schema from './schema';
import { ComfyUIEditor } from './widgets/comfyui-editor';

const ComfyUIPlugin: React.FC<WidgetConfigProps> = ({ values, onChange }) => {
  const formRef = useRef<FormRef>(null);

  useEffect(() => {
    const values = formRef.current?.getValues();
    if (!values?.comfy_workflow_id) {
      formRef.current?.setValue('comfy_workflow_id', generateUUID());
    }
  }, []);

  const { run: getComfySchema, data } = useRequest(getFile, {
    manual: true,
    onSuccess: result => {
      console.log('Save successful:', result);
    },
    onError: error => {
      console.error('Save failed:', error);
    },
  });

  useEffect(() => {
    getComfySchema({
      comfy_workflow_id: values?.comfy_workflow_id,
      file_name: 'schema.json',
    });
  }, [values?.comfy_workflow_id]);

  console.log('data>>>', data);

  if (!values) {
    return null;
  }

  return (
    <div className="comfyui-widget flex flex-col">
      <NodeForm
        ref={formRef}
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
