import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
  NodeIdEnum,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { useKeyPress } from 'ahooks';
import { useInjection } from 'inversify-react';
import React from 'react';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';

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
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

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
    if (
      selected &&
      source !== NodeIdEnum.start &&
      target !== NodeIdEnum.intro
    ) {
      onDelEdge({ id });
      appBuilder.handleRefScene({
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
