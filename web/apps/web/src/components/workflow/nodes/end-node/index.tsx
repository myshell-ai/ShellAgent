import {
  NodeProps,
  NodeIdEnum,
  EndNode as EndNodeType,
} from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import React, { useEffect, useRef } from 'react';

import NodeCard from '@/components/workflow/node-card';
import NodeForm from '@/components/workflow/node-form';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

const EndNode: React.FC<NodeProps<EndNodeType>> = ({ id, data, selected }) => {
  const formRef = useRef<FormRef>(null);
  const { setNodeData, nodeData, loading, resetData, clearResetData } =
    useWorkflowStore(state => ({
      setNodeData: state.setNodeData,
      nodeData: state.nodeData,
      loading: state.loading.getProConfig,
      resetData: state.resetData,
      clearResetData: state.clearResetData,
    }));

  const onChange = (values: TValues) => {
    setNodeData({ id: NodeIdEnum.end, data: values });
  };

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
      />
    </NodeCard>
  );
};

export default EndNode;
