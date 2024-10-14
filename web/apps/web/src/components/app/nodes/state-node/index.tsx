import {
  Connection,
  DRAGGABLE_NODE_ID,
  DraggableNodeType,
  Node,
  NodeId,
  NodeProps,
  NodeTypeEnum,
  SourceHandle,
  StateNode as StateNodeType,
  TargetHandle,
  useDrop,
  useReactFlowStore,
  uuid,
} from '@shellagent/flow-engine';
import { TFieldMode, TValues } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { useKeyPress } from 'ahooks';
import { isEqual } from 'lodash-es';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { EdgeDataTypeEnum, EdgeTypeEnum } from '@/components/app/edges';
import NodeCard from '@/components/app/node-card';
import NodeForm from '@/components/app/node-form';
import { useAppStore } from '@/stores/app/app-provider';
import { useAppState } from '@/stores/app/use-app-state';
import {
  generateUUID,
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '@/utils/common-helper';

import { useDuplicateState } from './hook/use-duplicate-state';
import emitter, { EventType, useEventEmitter } from '../../emitter';

const StateNode: React.FC<NodeProps<StateNodeType>> = ({
  id,
  selected,
  data,
}) => {
  const stateFormRef = useRef<FormRef>(null);
  const {
    setNodeData,
    nodeData,
    loading,
    delNodeData,
    setFieldsModeMap,
    fieldsModeMap,
  } = useAppStore(state => ({
    setNodeData: state.setNodeData,
    nodeData: state.nodeData,
    loading: state.loading.getAutomata,
    delNodeData: state.delNodeData,
    setFieldsModeMap: state.setFieldsModeMap,
    fieldsModeMap: state.config?.fieldsModeMap,
  }));

  const { onDelNode, selectedNodes, onConnect } = useReactFlowStore(state => ({
    onDelNode: state.onDelNode,
    selectedNodes: state.selectedNodes,
    onConnect: state.onConnect,
  }));

  const {
    setStateConfigSheetOpen,
    currentStateId,
    setSelectedNode,
    setCurrentCopyStateData,
  } = useAppState(state => ({
    setStateConfigSheetOpen: state.setStateConfigSheetOpen,
    currentStateId: state.currentStateId,
    setSelectedNode: state.setSelectedNode,
    setCurrentCopyStateData: state.setCurrentCopyStateData,
  }));

  const { duplicateState } = useDuplicateState();

  const selectedNodeRef = useRef<Node | null>(null);

  const [formKey, setFormKey] = useState(currentStateId);

  useEffect(() => {
    // 只能选一个，长度为1
    const selectedNode = selectedNodes[0];
    setSelectedNode(selectedNode);

    if (selectedNode && selectedNode.type === NodeTypeEnum.state) {
      setStateConfigSheetOpen(selectedNode.id, true);
      selectedNodeRef.current = selectedNode;
    } else {
      setStateConfigSheetOpen(selectedNodeRef.current?.id || '', false);
    }
  }, [selectedNodes]);

  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    nodeRef.current = document.querySelector(`[data-id=${id}]`) as HTMLElement;
  }, [id]);

  useKeyPress(
    ['delete', 'backspace'],
    e => {
      if (selected && e.target === nodeRef.current) {
        delNodeData(id);
        onDelNode({ id: data.id });
        if (currentStateId === id) {
          setStateConfigSheetOpen(currentStateId, false);
        }
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
        setCurrentCopyStateData({
          ...nodeData[id],
          ...data,
        });
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

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id, name, mode });
    },
    [id, setFieldsModeMap],
  );

  const onChange = useCallback(
    (values: TValues) => {
      const newData = { id: data.id as NodeId, data: values };

      setNodeData(newData);
      emitter.emit(EventType.STATE_FORM_CHANGE, {
        id: data.id as NodeId,
        data: `${new Date().valueOf()}`,
        type: 'StateCard',
      });
    },
    [setNodeData, data.id],
  );

  useEventEmitter(EventType.STATE_FORM_CHANGE, eventData => {
    const currentFormData = stateFormRef.current?.getValues();
    if (
      eventData.id === data.id &&
      eventData.type === 'StateConfigSheet' &&
      !isEqual(currentFormData, eventData.data)
    ) {
      setFormKey(eventData.data);
    }
  });

  const handleConnect = (connection: Connection) => {
    if (connection.source && connection.target) {
      onConnect({
        connect: connection,
        edge: {
          type: EdgeTypeEnum.custom,
          data: {
            id,
            custom: true,
            event_key: generateUUID(),
            type: EdgeDataTypeEnum.ALWAYS,
            source: connection.source,
            target: connection.target,
            conditions: [],
          },
          style: {
            stroke: '#B6BABF',
            strokeWidth: selected ? 4 : 2,
          },
        },
      });
    }
  };

  const [, drop] = useDrop<DraggableNodeType>(
    () => ({
      accept: DRAGGABLE_NODE_ID,
      drop: item => {
        const newTask = {
          type: 'task',
          display_name: item.display_name,
          name: uuid(),
          mode: item.nodeType === 'workflow' ? 'workflow' : 'widget',
          workflow_id: undefined,
          // item.nodeType === 'workflow' ? generateUUID() : undefined,
          widget_name: item.nodeType === 'widget' ? item.name : undefined,
          widget_class_name: item.nodeType === 'widget' ? item.name : undefined,
          inputs: {},
          outputs: {},
        };

        setNodeData({
          id,
          data: {
            ...nodeData[id],
            blocks: [...(nodeData[id]?.blocks || []), newTask],
          },
        });
        setFormKey(uuid());
        emitter.emit(EventType.STATE_FORM_CHANGE, {
          id: data.id as NodeId,
          data: `${new Date().valueOf()}`,
          type: 'StateCard',
        });
      },
    }),
    [setNodeData, nodeData, id],
  );

  const dropRef = useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <div ref={dropRef}>
      <NodeCard selected={selected} {...data}>
        <NodeForm
          key={formKey}
          ref={stateFormRef}
          loading={loading}
          values={nodeData[data.id]}
          onChange={onChange}
          onModeChange={onModeChange}
          modeMap={fieldsModeMap?.[data.id] || {}}
        />
      </NodeCard>
      <SourceHandle onConnect={handleConnect} id={`custom_${id}`} />
      <TargetHandle id={id} />
    </div>
  );
};

export default StateNode;
