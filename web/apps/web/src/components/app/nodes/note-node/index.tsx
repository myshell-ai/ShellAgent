import {
  NodeId,
  NodeProps,
  NodeTypeEnum,
  NoteNode as NoteNodeType,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { Textarea, Heading } from '@shellagent/ui';
import React, { useCallback, useEffect, useRef } from 'react';
import { useKeyPress } from 'ahooks';

import NodeCard from '@/components/app/node-card';

const NoteNode: React.FC<NodeProps<NoteNodeType>> = ({ selected, data }) => {
  const { onDelNode, onChangeNodeData, nodes } = useReactFlowStore(state => ({
    onDelNode: state.onDelNode,
    onChangeNodeData: state.onChangeNodeData,
    nodes: state.nodes,
  }));
  const currentNode = nodes.find(item => item.id === data.id);

  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    nodeRef.current = document.querySelector(
      `[data-id=${data.id}]`,
    ) as HTMLElement;
  }, [data.id]);

  const onChange = useCallback(
    (value: string) => {
      const newData: NoteNodeType = {
        ...currentNode?.data,
        id: data.id as NodeId,
        type: NodeTypeEnum.note,
        value,
      };
      onChangeNodeData(data.id as NodeId, newData);
    },
    [data.id, onChangeNodeData, currentNode],
  );

  useKeyPress(
    ['delete', 'backspace'],
    e => {
      if (selected && e.target === nodeRef.current) {
        onDelNode({ id: data.id });
      }
    },
    {
      target: nodeRef,
    },
  );

  return (
    <NodeCard selected={selected} {...data}>
      <Heading size="h3">Note</Heading>
      <Textarea
        className="mt-3"
        style={{
          height: '240px',
        }}
        value={(currentNode?.data as NoteNodeType)?.value}
        onChange={e => onChange(e.target.value)}
      />
    </NodeCard>
  );
};

export default NoteNode;
