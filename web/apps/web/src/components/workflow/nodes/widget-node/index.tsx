import {
  NodeProps,
  WidgetNode as WidgetNodeType,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { useKeyPress } from 'ahooks';
import React, { useCallback, useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useWorkflowState } from '@/stores/workflow/use-workflow-state';
import { getDelPathInfo } from '@/stores/workflow/utils/data-transformer';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import {
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '@/utils/common-helper';

import { useDuplicateState } from './hook/use-duplicate-state';
import { EventType, useEventEmitter } from '../../emitter';
import NodeCard from '../../node-card';
import NodeForm from '../../node-form';

const WidgetNode: React.FC<NodeProps<WidgetNodeType>> = ({
  id,
  selected,
  data,
}) => {
  const formRef = useRef<FormRef>(null);
  const nodeRef = useRef<HTMLElement | null>(null);
  const { duplicateState } = useDuplicateState(id);
  const { onDelNode } = useReactFlowStore(state => ({
    onDelNode: state.onDelNode,
  }));
  const { setCurrentCopyId } = useWorkflowState(state => ({
    setCurrentCopyId: state.setCurrentCopyId,
  }));

  const {
    setNodeData,
    nodeData,
    loading,
    fieldsModeMap,
    setFieldsModeMap,
    resetData,
    setResetData,
    clearResetData,
    delConfigMap,
  } = useWorkflowStore(
    useShallow(state => ({
      widgetSchema: state.widgetSchema,
      setNodeData: state.setNodeData,
      nodeData: state.nodeData,
      loading: state.loading,
      fieldsModeMap: state.config?.fieldsModeMap || {},
      setFieldsModeMap: state.setFieldsModeMap,
      resetData: state.resetData,
      setResetData: state.setResetData,
      clearResetData: state.clearResetData,
      delConfigMap: state.delConfigMap,
    })),
  );

  useEffect(() => {
    nodeRef.current = document.querySelector(`[data-id=${id}]`) as HTMLElement;
  }, [id]);

  // 节点删除，同时删除数据
  useKeyPress(
    ['delete', 'backspace'],
    e => {
      if (selected && e.target === nodeRef.current) {
        // 全量的nodeData
        const paths = getDelPathInfo(nodeData, id);
        Object.entries(paths).forEach(([path, value]) => {
          setResetData({ path, value });
        });
        onDelNode({ id: data.id });
        delConfigMap(id);
      }
    },
    {
      target: nodeRef,
    },
  );

  useKeyPress(
    `${getKeyboardKeyCodeBySystem('ctrl')}.c`,
    e => {
      if (isEventTargetInputArea(e.target as HTMLElement)) {
        return;
      }
      if (selected) {
        setCurrentCopyId(id);
      }
    },
    {
      target: nodeRef,
    },
  );

  useKeyPress(
    `${getKeyboardKeyCodeBySystem('ctrl')}.d`,
    e => {
      e.preventDefault();
      if (isEventTargetInputArea(e.target as HTMLElement)) {
        return;
      }
      if (selected) {
        duplicateState();
      }
    },
    {
      target: nodeRef,
    },
  );

  // 删除其他节点后，如果当前节点有删除节点的引用，更新数据
  useEffect(() => {
    Object.entries(resetData).forEach(([key, value]) => {
      if (key.startsWith(id)) {
        const path = key.replace(`${id}.`, '');
        formRef.current?.setValue(path, value);
        clearResetData(key);
      }
    });
  }, [resetData]);

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id, name, mode });
    },
    [id, setFieldsModeMap],
  );

  const onChange = (values: TValues) => {
    setNodeData({ id: data.id, data: values });
  };

  useEventEmitter(EventType.DELETE_EDGE, edge => {
    if (edge.target === id && edge.targetHandle) {
      formRef.current?.setValue(`input.${edge.targetHandle}`, undefined);
    }
  });

  return (
    <NodeCard selected={selected} mode={nodeData[data.id]?.mode} {...data}>
      <NodeForm
        ref={formRef}
        loading={loading.getReactFlow}
        values={nodeData[data.id]}
        onChange={onChange}
        onModeChange={onModeChange}
        modeMap={fieldsModeMap?.[data.id] || {}}
      />
    </NodeCard>
  );
};

export default WidgetNode;
