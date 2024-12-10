import { Button, FormRef } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';

import { CommonWidgetConfigProps } from '@/components/app/config-form/widget-config';
import NodeForm from '@/components/app/node-form';
import { ComfyUIModel } from '@/components/app/plugins/comfyui/comfyui.model';
import { ComfyUIEditor } from './widgets/comfyui-editor';
import { toast } from 'react-toastify';
import { useSchemaContext } from '@/stores/app/schema-provider';

export const ComfyUIPlugin = observer<CommonWidgetConfigProps>(
  ({ values, onChange, parent }) => {
    if (!values) {
      return null;
    }
    const { id: stateId } = useSchemaContext(state => ({
      id: state.id,
    }));
    const model = useInjection<ComfyUIModel>('ComfyUIModel');
    const formRef = useRef<FormRef>(null);

    // Until NodeForm re-render bug fixed, put initial logic (help with useEffect) here other than ComfyUIEditor
    useEffect(() => {
      if (formRef.current) {
        model.formEngineModel.setFormRef(formRef.current);
      } else {
        throw new Error('formRef should not be null');
      }
      model.loadCurrentSchema(values?.location);
      model.currentFormData = {
        ...values,
        stateId,
        parent,
      };
      model.emitter.on('warmWithDetail', evt => {
        toast.warning(
          <div>
            {evt.message}
            {evt.message_detail ? (
              <Button
                className="ml-2"
                color="error"
                size="sm"
                onClick={() => model.showMessageDetail(evt.message_detail)}>
                View Detail
              </Button>
            ) : null}
          </div>,
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          },
        );
      });
      return () => {
        model.formEngineModel.reset();
        model.currentFormData = {};
        model.emitter.off('warmWithDetail');
      };
    }, []);

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
