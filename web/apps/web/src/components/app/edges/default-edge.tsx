import { useKeyPress } from 'ahooks';
import React from 'react';
import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';

export const DefaultEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
  target,
  source,
}: EdgeProps<{
  onDelete: (id: string) => void;
}>) => {
  const appBuilder = useInjection(AppBuilderModel);

  const [edgePath] = getBezierPath({
    sourceX: sourceX - 8,
    sourceY,
    sourcePosition,
    targetX: targetX + 2,
    targetY,
    targetPosition,
  });

  const onDelEdge = useReactFlowStore(state => state.onDelEdge);
  const edges = useReactFlowStore(state => state.edges);

  useKeyPress(['delete', 'backspace'], () => {
    if (selected) {
      onDelEdge({ id });
      appBuilder.hanldeRefScene({
        scene: RefSceneEnum.Enum.remove_edge,
        params: {
          edges: edges as any,
          removeEdge: {
            target: target as Lowercase<string>,
            source: source as Lowercase<string>,
          },
        },
      });
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
