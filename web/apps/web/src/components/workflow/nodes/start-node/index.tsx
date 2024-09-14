import {
  NodeProps,
  NodeIdEnum,
  StartNode as StartNodeType,
} from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
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
  const {
    setNodeData,
    nodeData,
    loading,
    fieldsModeMap,
    setFieldsModeMap,
    setResetData,
    flowInstance,
  } = useWorkflowStore(state => ({
    setNodeData: state.setNodeData,
    nodeData: state.nodeData,
    loading: state.loading.getProConfig,
    fieldsModeMap: state.config?.fieldsModeMap || {},
    setFieldsModeMap: state.setFieldsModeMap,
    setResetData: state.setResetData,
    flowInstance: state.flowInstance,
  }));

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
        flowInstance?.setEdges(state =>
          state.filter(
            edge =>
              !(
                edge.source === data.id &&
                edge.sourceHandle &&
                diffKeys.includes(edge.sourceHandle)
              ),
          ),
        );
      }
      preNodeData.current[data.id] = values;
    },
    [setNodeData, nodeData, setResetData, data.id],
  );

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id, name, mode });
    },
    [id, setFieldsModeMap],
  );

  return (
    <NodeCard selected={selected} {...data}>
      <NodeForm
        loading={loading}
        values={nodeData[data.id]}
        onChange={onChange}
        onModeChange={onModeChange}
        modeMap={fieldsModeMap?.[data.id] || {}}
      />
    </NodeCard>
  );
};

export default StartNode;
