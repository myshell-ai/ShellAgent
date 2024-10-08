import {
  NodeProps,
  NodeIdEnum,
  EndNode as EndNodeType,
} from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import React, { useCallback, useEffect, useRef } from 'react';

import NodeCard from '@/components/workflow/node-card';
import NodeForm from '@/components/workflow/node-form';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

const EndNode: React.FC<NodeProps<EndNodeType>> = ({ id, data, selected }) => {
  const formRef = useRef<FormRef>(null);
  const {
    setNodeData,
    nodeData,
    loading,
    fieldsModeMap,
    setFieldsModeMap,
    resetData,
    clearResetData,
  } = useWorkflowStore(state => ({
    setNodeData: state.setNodeData,
    nodeData: state.nodeData,
    loading: state.loading.getProConfig,
    fieldsModeMap: state.config?.fieldsModeMap || {},
    setFieldsModeMap: state.setFieldsModeMap,
    resetData: state.resetData,
    clearResetData: state.clearResetData,
  }));

  const onChange = (values: TValues) => {
    setNodeData({ id: NodeIdEnum.end, data: values });
  };

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id, name, mode });
    },
    [id, setFieldsModeMap],
  );

  useEffect(() => {
    Object.entries(resetData).forEach(([key, value]) => {
      if (key.startsWith(id)) {
        const path = key.replace(`${id}.`, '');
        formRef.current?.setValue(path, value);
        clearResetData(key);
      }
    });
  }, [resetData]);

  return (
    <NodeCard targetHandle={id} selected={selected} {...data}>
      <NodeForm
        ref={formRef}
        loading={loading}
        values={nodeData[data.id]}
        onChange={onChange}
        onModeChange={onModeChange}
        modeMap={fieldsModeMap?.[data.id] || {}}
      />
    </NodeCard>
  );
};

export default EndNode;
