import {
  NodeProps,
  NodeIdEnum,
  StartNode as StartNodeType,
  SourceHandle,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import React, { useCallback, useMemo } from 'react';

import NodeCard from '@/components/app/node-card';
import NodeForm from '@/components/app/node-form';
import { useAppStore } from '@/stores/app/app-provider';

const StartNode: React.FC<NodeProps<StartNodeType>> = ({
  id,
  selected,
  data,
}) => {
  const {
    setNodeData,
    nodeData,
    fieldsModeMap,
    setFieldsModeMap,
    setResetData,
    loading,
  } = useAppStore(state => ({
    setNodeData: state.setNodeData,
    nodeData: state.nodeData,
    fieldsModeMap: state.config?.fieldsModeMap || {},
    setFieldsModeMap: state.setFieldsModeMap,
    setResetData: state.setResetData,
    loading: state.loading.getAutomata,
  }));

  const edges = useReactFlowStore(state => state.edges);

  const onChange = useCallback(
    (values: TValues) => {
      setNodeData({ id: NodeIdEnum.start, data: values });
    },
    [setNodeData, nodeData, setResetData, data.id],
  );

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id, name, mode });
    },
    [id, setFieldsModeMap],
  );

  // 只能连接一个state节点
  const isConnectable = useMemo(() => {
    return edges.some(edge => edge.source === id) === false;
  }, [edges]);

  return (
    <>
      <NodeCard selected={selected} {...data}>
        <NodeForm
          loading={loading}
          values={nodeData[data.id]}
          onChange={onChange}
          onModeChange={onModeChange}
          modeMap={fieldsModeMap?.[data.id] || {}}
        />
      </NodeCard>
      <SourceHandle isConnectable={isConnectable} id={id} />
    </>
  );
};

export default StartNode;
