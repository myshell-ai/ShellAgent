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
import { findDiffKeys } from '@/utils/common-helper';

import { EventType, useEventEmitter } from '../../emitter';

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
    flowInstance,
  } = useWorkflowStore(state => ({
    setNodeData: state.setNodeData,
    nodeData: state.nodeData,
    loading: state.loading.getProConfig,
    fieldsModeMap: state.config?.fieldsModeMap || {},
    setFieldsModeMap: state.setFieldsModeMap,
    resetData: state.resetData,
    clearResetData: state.clearResetData,
    flowInstance: state.flowInstance,
  }));

  const preNodeData = useRef<TValues>(nodeData);

  useEffect(() => {
    preNodeData.current = nodeData;
  }, [nodeData]);

  const onChange = (values: TValues) => {
    setNodeData({ id: NodeIdEnum.end, data: values });
    const diffKeys = findDiffKeys(preNodeData.current[data.id], values);
    if (diffKeys.length) {
      flowInstance?.setEdges(state =>
        state.filter(
          edge =>
            !(
              edge.target === data.id &&
              edge.targetHandle &&
              diffKeys.includes(edge.targetHandle)
            ),
        ),
      );
    }
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

  useEventEmitter(EventType.DELETE_EDGE, edge => {
    if (edge.target === id && edge.targetHandle) {
      formRef.current?.setValue(`${edge.targetHandle}.value`, undefined);
    }
  });

  return (
    <NodeCard selected={selected} {...data}>
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
