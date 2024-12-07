import { FormRef } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';

import { CommonWidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';
import { ComfyUIModel } from '@/components/app/plugins/comfyui/comfyui.model';
import { ComfyUIEditor } from './widgets/comfyui-editor';

export const ComfyUIPlugin = observer<CommonWidgetConfigProps>(
  ({ values, onChange, parent }) => {
    if (!values) {
      return null;
    }

    const model = useInjection<ComfyUIModel>('ComfyUIModel');
    const formRef = useRef<FormRef>(null);

    useEffect(() => {
      model.loadCurrentSchema(values?.location);
    }, []);

    useEffect(() => {
      formRef.current?.setValue('api', model.comfyUIUrl);
    }, [model.comfyUIUrl]);

    return (
      <div className="comfyui-widget flex flex-col">
        <NodeForm
          parent={parent}
          ref={formRef}
          key={JSON.stringify(model.currentSchema)}
          schema={model.currentSchema}
          values={values}
          onChange={newValues => {
            onChange(newValues);
          }}
          loading={model.getSchemaLoading.isOn}
          components={{
            ComfyUIEditor,
          }}
        />
      </div>
    );
  },
);
