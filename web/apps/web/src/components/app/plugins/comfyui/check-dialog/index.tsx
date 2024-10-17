'use client';

import { AModal, Button, Title } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { FormInstance } from 'antd';
import React, { useRef, useCallback } from 'react';

import { CheckerContent } from './content';
import { updateDependency } from '../services';
import type { SaveResponse } from '../services/type';
import { formatFormData2Dependency } from '../utils';

interface CheckDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setModalOpen: (open: boolean) => void;
  comfy_workflow_id: string;
  dependencies: SaveResponse['data']['dependencies'] | null;
}

export const CheckDialog: React.FC<CheckDialogProps> = ({
  open,
  setOpen,
  setModalOpen,
  comfy_workflow_id,
  dependencies,
}) => {
  const formRef = useRef<FormInstance>(null);

  const { run: updateDependencyRequest, loading: submitLoading } = useRequest(
    updateDependency,
    {
      manual: true,
      onSuccess: result => {
        if (result.success) {
          setOpen(false);
          setModalOpen(false);
        }
      },
    },
  );

  const handleSubmit = useCallback(async () => {
    try {
      await formRef.current?.validateFields();
      const values = formRef.current?.getFieldsValue();
      const formattedValues = formatFormData2Dependency(values);
      updateDependencyRequest({
        ...formattedValues,
        comfy_workflow_id,
      });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  }, [comfy_workflow_id, setOpen, setModalOpen, updateDependencyRequest]);

  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <AModal
      mask={false}
      open={open}
      width={720}
      zIndex={9999}
      bodyPadding={0}
      onCancel={handleCancel}
      title={<Title size="h3">Additional Metadata</Title>}
      footer={[
        <Button
          size="lg"
          key="submit"
          type="submit"
          onClick={handleSubmit}
          loading={submitLoading}>
          Submit
        </Button>,
      ]}>
      <CheckerContent formRef={formRef} dependencies={dependencies} />
    </AModal>
  );
};
