'use client';

import { AModal, Button } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { FormInstance } from 'antd';
import React, { useRef } from 'react';

import { CheckerContent } from './content';
import { updateDependency } from '../services';
import type {
  UpdateDependencyRequest,
  GetFileResponse,
} from '../services/type';

interface CheckDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  comfy_workflow_id: string;
  dependencies: GetFileResponse['data']['dependencies'] | null;
}

export const CheckDialog: React.FC<CheckDialogProps> = ({
  open,
  setOpen,
  comfy_workflow_id,
  dependencies,
}) => {
  const formRef = useRef<FormInstance>(null);

  const { run: updateDependencyRequest } = useRequest(updateDependency, {
    manual: true,
  });

  const handleSubmit = async () => {
    try {
      await formRef.current?.validateFields();
      setOpen(false);
      const values = formRef.current?.getFieldsValue();
      updateDependencyRequest({
        ...values,
        comfy_workflow_id,
      } as UpdateDependencyRequest);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <AModal
      open={open}
      width={720}
      zIndex={9999}
      bodyPadding={0}
      onCancel={() => setOpen(false)}
      footer={[
        <Button size="lg" key="submit" type="submit" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}>
      <CheckerContent formRef={formRef} dependencies={dependencies} />
    </AModal>
  );
};
