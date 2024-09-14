import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
  getColor,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { useKeyPress } from 'ahooks';
import { get } from 'lodash-es';
import React, { useMemo } from 'react';

import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

import emitter, { EventType } from '../emitter';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
  style,
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

  const { edges, onDelEdge } = useReactFlowStore(state => ({
    edges: state.edges,
    onDelEdge: state.onDelEdge,
  }));

  const fieldTypes = useWorkflowStore(state => state.fieldTypes);

  useKeyPress(['delete', 'backspace'], () => {
    if (selected) {
      const edge = edges.find(item => item.id === id);
      if (edge) {
        emitter.emit(EventType.DELETE_EDGE, edge);
      }
      onDelEdge({ id });
    }
  });

  const stroke = useMemo(() => {
    const edge = edges.find(item => item.id === id);
    const targetType =
      edge?.target && edge?.targetHandle
        ? get(fieldTypes, [edge?.target, 'inputs', edge?.targetHandle])
        : '';
    if (targetType) {
      return getColor(targetType);
    }
    const sourceType =
      edge?.source && edge?.sourceHandle
        ? get(fieldTypes, [edge?.source, 'outputs', edge?.sourceHandle])
        : '';
    if (sourceType) {
      return getColor(sourceType);
    }
    if (style?.stroke) {
      return style?.stroke;
    }
    return '#B6BABF';
  }, [edges, id, fieldTypes, style?.stroke]);

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke,
        strokeWidth: selected ? 4 : 2,
      }}
    />
  );
};

const CustomEdgeType = 'custom_edge';

export { CustomEdgeType };

export default React.memo(CustomEdge);
