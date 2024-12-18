import {
  Connection,
  Node,
  NodeId,
  NodeProps,
  NodeTypeEnum,
  SourceHandle,
  IntroNode as IntroNodeType,
  TargetHandle,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import React, { useCallback, useRef, useEffect, useState } from 'react';

import { EdgeDataTypeEnum, EdgeTypeEnum } from '@/components/app/edges';
import NodeCard from '@/components/app/node-card';
import NodeForm from '@/components/app/node-form';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import emitter, {
  EventType,
  useEventEmitter,
} from '@/stores/app/models/emitter';
import { useAppState } from '@/stores/app/use-app-state';

const IntroNode: React.FC<NodeProps<IntroNodeType>> = ({ selected, data }) => {
  const stateFormRef = useRef<FormRef>(null);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
  const { selectedNodes, onConnect } = useReactFlowStore(state => ({
    selectedNodes: state.selectedNodes,
    onConnect: state.onConnect,
  }));

  const { setStateConfigSheetOpen, currentStateId, setSelectedNode } =
    useAppState(state => ({
      setStateConfigSheetOpen: state.setStateConfigSheetOpen,
      currentStateId: state.currentStateId,
      setSelectedNode: state.setSelectedNode,
    }));

  const selectedNodeRef = useRef<Node | null>(null);

  const [formKey, setFormKey] = useState(currentStateId);

  useEffect(() => {
    // 只能选一个，长度为1
    const selectedNode = selectedNodes[0];
    setSelectedNode(selectedNode);

    appBuilder.selectedStateId = selectedNode?.id;

    if (selectedNode && selectedNode.type === NodeTypeEnum.intro) {
      setStateConfigSheetOpen(selectedNode.id, true);
      selectedNodeRef.current = selectedNode;
    } else {
      setStateConfigSheetOpen(selectedNodeRef.current?.id || '', false);
    }
  }, [selectedNodes]);

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
      emitter.emit(EventType.FORM_CHANGE, {
        id: data.id as NodeId,
        data: `${new Date().valueOf()}`,
        type: 'StateCard',
      });
    },
    [data.id],
  );

  useEventEmitter(EventType.FORM_CHANGE, eventData => {
    if (eventData.id === data.id && eventData.type === 'StateConfigSheet') {
      setFormKey(eventData.data);
    }
  });

  useEventEmitter(EventType.RESET_FORM, eventData => {
    setFormKey(eventData.data);
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

  return (
    <div>
      <NodeCard selected={selected} {...data}>
        <NodeForm
          key={formKey}
          ref={stateFormRef}
          loading={appBuilder.getAutomataLoading}
          values={appBuilder.nodeData[data.id]}
          onChange={onChange}
        />
      </NodeCard>
      <SourceHandle onConnect={handleConnect} id={`custom_${data.id}`} />
      <TargetHandle id={data.id} />
    </div>
  );
};

export default IntroNode;
