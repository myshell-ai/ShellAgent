'use client';

import { AModal, Button } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { FormInstance } from 'antd';
import React, { useRef, useCallback } from 'react';

import { CheckerContent } from './content';
import { updateDependency } from '../services';
import type { GetFileResponse } from '../services/type';
import { formatFormData2Dependency } from '../utils';

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

  const handleSubmit = useCallback(async () => {
    try {
      await formRef.current?.validateFields();
      const values = formRef.current?.getFieldsValue();
      const formattedValues = formatFormData2Dependency(values);

      setOpen(false);
      updateDependencyRequest({
        ...formattedValues,
        comfy_workflow_id,
      });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  }, [comfy_workflow_id, setOpen, updateDependencyRequest]);

  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <AModal
      open={open}
      width={720}
      zIndex={9999}
      bodyPadding={0}
      onCancel={handleCancel}
      footer={[
        <Button size="lg" key="submit" type="submit" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}>
      <CheckerContent formRef={formRef} dependencies={dependencies} />
    </AModal>
  );
};
