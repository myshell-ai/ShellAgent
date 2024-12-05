import {
  NodeProps,
  NodeIdEnum,
  StartNode as StartNodeType,
} from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import React, { useCallback, useRef, useEffect } from 'react';

import NodeCard from '@/components/workflow/node-card';
import NodeForm from '@/components/workflow/node-form';
import { getDelPathInfo } from '@/stores/workflow/utils/data-transformer';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { findDiffKeys } from '@/utils/common-helper';

const StartNode: React.FC<NodeProps<StartNodeType>> = ({
  id,
  selected,
  data,
}) => {
  const { setNodeData, nodeData, loading, setResetData } = useWorkflowStore(
    state => ({
      setNodeData: state.setNodeData,
      nodeData: state.nodeData,
      loading: state.loading.getProConfig,
      setResetData: state.setResetData,
    }),
  );

  const preNodeData = useRef<TValues>(nodeData);

  useEffect(() => {
    preNodeData.current = nodeData;
  }, [nodeData]);

  const onChange = useCallback(
    (values: TValues) => {
      setNodeData({ id: NodeIdEnum.start, data: values });
      const diffKeys = findDiffKeys(preNodeData.current[data.id], values);
      if (diffKeys.length) {
        diffKeys.forEach(key => {
          const id = key.includes('input.') ? key.split('.')[1] : key;
          const paths = getDelPathInfo(preNodeData.current, id);
          Object.entries(paths).forEach(([path, value]) => {
            setResetData({ path, value });
          });
        });
      }
      preNodeData.current[data.id] = values;
    },
    [setNodeData, nodeData, setResetData, data.id],
  );

  return (
    <NodeCard sourceHandle={id} selected={selected} {...data}>
      <NodeForm
        loading={loading}
        values={nodeData[data.id]}
        onChange={onChange}
      />
    </NodeCard>
  );
};

export default StartNode;
