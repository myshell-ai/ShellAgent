import { useKeyPress } from 'ahooks';
import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

import { useReactFlowStore } from '../../../store/flow/provider';

const DefaultEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
}: EdgeProps<{
  onDelete: (id: string) => void;
}>) => {
  const [edgePath] = getBezierPath({
    sourceX: sourceX - 8,
    sourceY,
    sourcePosition,
    targetX: targetX + 2,
    targetY,
    targetPosition,
  });

  const onDelEdge = useReactFlowStore(state => state.onDelEdge);

  useKeyPress(['delete', 'backspace'], () => {
    if (selected) {
      onDelEdge({ id });
    }
  });
  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: selected ? '#3E5CFA' : '#B6BABF',
        strokeWidth: selected ? 4 : 2,
      }}
    />
  );
};

export default React.memo(DefaultEdge);
