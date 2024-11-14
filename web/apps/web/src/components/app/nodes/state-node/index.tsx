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
} from '@shellagent/flow-engine';
import { TFieldMode, TValues } from '@shellagent/form-engine';
import { observer } from 'mobx-react-lite';
import { Task, TaskSchema } from '@shellagent/shared/protocol/task';
import { customSnakeCase, getTaskDisplayName } from '@shellagent/shared/utils';
import { FormRef } from '@shellagent/ui';
import { useKeyPress } from 'ahooks';
import { isEqual } from 'lodash-es';
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';

import { EdgeDataTypeEnum, EdgeTypeEnum } from '@/components/app/edges';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import NodeCard from '@/components/app/node-card';
import NodeForm from '@/components/app/node-form';
import { useAppState } from '@/stores/app/use-app-state';
import {
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '@/utils/common-helper';

import { useDuplicateState } from './hook/use-duplicate-state';
import emitter, { EventType, useEventEmitter } from '../../emitter';

const StateNode: React.FC<NodeProps<StateNodeType>> = ({ selected, data }) => {
  const stateFormRef = useRef<FormRef>(null);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
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
    nodeRef.current = document.querySelector(
      `[data-id=${data.id}]`,
    ) as HTMLElement;
  }, [data.id]);

  useKeyPress(
    ['delete', 'backspace'],
    e => {
      if (selected && e.target === nodeRef.current) {
        appBuilder.deleteNodeData(data.id);
        onDelNode({ id: data.id });
        appBuilder.hanldeRefScene({
          scene: RefSceneEnum.Enum.remove_state,
          params: {
            stateName: data.id as Lowercase<string>,
          },
        });
        if (currentStateId === data.id) {
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
          ...appBuilder.nodeData[data.id],
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
      appBuilder.setFieldsModeMap({ id: data.id, name, mode });
    },
    [data.id, appBuilder.setFieldsModeMap],
  );

  const onChange = useCallback(
    (values: TValues) => {
      const newValues = {
        ...values,
        id: data.id,
        name: data.display_name,
        type: data.type,
      };
      const newData = { id: data.id as NodeId, data: newValues };

      appBuilder.setNodeData(newData);
      emitter.emit(EventType.STATE_FORM_CHANGE, {
        id: data.id as NodeId,
        data: `${new Date().valueOf()}`,
        type: 'StateCard',
      });
    },
    [data.id],
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
            id: data.id,
            custom: true,
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
        if (
          item.nodeType === NodeTypeEnum.widget ||
          item.nodeType === NodeTypeEnum.workflow
        ) {
          try {
            const displayName = getTaskDisplayName(
              item,
              appBuilder.nodeData[data.id]?.blocks as Task[],
            );
            const newTask = TaskSchema.parse({
              type: 'task',
              display_name: displayName,
              name: customSnakeCase(displayName),
              mode: item.type,
              ...(item.type === NodeTypeEnum.widget && {
                widget_name: item.widget_name,
                widget_class_name: item.name,
              }),
              inputs: {},
              outputs: {},
              custom: item.custom,
            });

            appBuilder.setNodeData({
              id: data.id,
              data: {
                ...appBuilder.nodeData[data.id],
                blocks: [
                  ...((appBuilder.nodeData[data.id]?.blocks as Task[]) || []),
                  newTask,
                ],
              },
            });
            const key = `${new Date().valueOf()}`;
            setFormKey(key);
            emitter.emit(EventType.STATE_FORM_CHANGE, {
              id: data.id as NodeId,
              data: key,
              type: 'StateCard',
            });
          } catch (error) {
            console.error('Task parse error:', error);
          }
        }
      },
    }),
    [appBuilder.setNodeData, appBuilder.nodeData, data.id],
  );

  const dropRef = useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <div ref={dropRef}>
      <NodeCard selected={selected} {...data}>
        <NodeForm
          key={formKey}
          ref={stateFormRef}
          loading={appBuilder.getAutomataLoading}
          values={appBuilder.nodeData[data.id]}
          onChange={onChange}
          onModeChange={onModeChange}
          modeMap={appBuilder.config.fieldsModeMap?.[data.id] || {}}
        />
      </NodeCard>
      <SourceHandle onConnect={handleConnect} id={`custom_${data.id}`} />
      <TargetHandle id={data.id} />
    </div>
  );
};

export default StateNode;
