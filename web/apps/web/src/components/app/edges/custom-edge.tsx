import {
  getBezierPath,
  EdgeLabelRenderer,
  EdgeProps,
  useReactFlowStore,
  BaseEdge,
  Position,
} from '@shellagent/flow-engine';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { useKeyPress } from 'ahooks';
import { useInjection } from 'inversify-react';
import React, { useState, useRef, useEffect } from 'react';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { useAppState } from '@/stores/app/use-app-state';

import { EventButton } from './event-button';
import { CustomEdgeData } from './type';

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  targetPosition,
  markerEnd,
  selected,
  style,
  source,
  target,
  sourceHandleId,
}: EdgeProps<CustomEdgeData>) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const setTransitionSheetOpen = useAppState(
    state => state.setTransitionSheetOpen,
  );

  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  const [edgePath] = getBezierPath({
    sourceX: sourceX + buttonWidth + 24,
    sourceY,
    targetX: targetX + 2,
    targetY,
    targetPosition,
    sourcePosition: Position.Right,
  });

  // 计算按钮左侧中央的坐标
  const buttonLeftCenterX = sourceX + 24;
  const buttonLeftCenterY = sourceY;

  // 生成从源handle到按钮左侧的路径
  const [leftEdgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX: buttonLeftCenterX,
    targetY: buttonLeftCenterY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  const onDelEdge = useReactFlowStore(state => state.onDelEdge);
  const edges = useReactFlowStore(state => state.edges);

  // const edges = useReactFlowStore(state => state.edges);

  // const showButton = useMemo(() => {
  //   const sameSourceEdges = edges.filter(edge => edge?.source === source);
  //   return sameSourceEdges[0]?.id === id;
  // }, [edges, id, source]);

  useKeyPress(['delete', 'backspace'], () => {
    if (selected) {
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

  const handleEditEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setTransitionSheetOpen({ open: false, source: '', sourceHandle: '' });
    setTimeout(() => {
      setTransitionSheetOpen({
        open: true,
        source,
        sourceHandle: sourceHandleId || '',
        data: {
          ...(data || {}),
          id,
          target,
          source,
        },
      });
    });
  };

  return (
    <>
      <BaseEdge
        id={`${id}-left`}
        path={leftEdgePath}
        style={{
          ...style,
          strokeWidth: selected ? 4 : 2,
        }}
      />
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 4 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <EventButton
          ref={buttonRef}
          style={{
            transform: `translate(${
              sourceX + 24
            }px,${sourceY}px) translateY(-50%)`,
          }}
          onClick={handleEditEvent}
        />
      </EdgeLabelRenderer>
    </>
  );
};
