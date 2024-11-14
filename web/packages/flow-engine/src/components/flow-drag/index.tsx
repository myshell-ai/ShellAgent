import { Spinner } from '@shellagent/ui';
import clsx from 'clsx';
import { isEqual } from 'lodash-es';
import React, {
  forwardRef,
  useCallback,
  memo,
  useImperativeHandle,
  useRef,
} from 'react';
import { useDrop } from 'react-dnd';
import ReactFlow, { Background, OnConnect, ReactFlowInstance } from 'reactflow';

import {
  edgeOptions,
  connectionLineStyle,
  defaultViewport,
  DRAGGABLE_NODE_ID,
} from '../../constants';
import { useReactFlowStore } from '../../store/flow/provider';
import {
  DraggableNodeType,
  IFlowDagProps,
  FlowRef,
  NodeData,
  EdgeData,
} from '../../types';
import { isCustomEdge } from '../../utils';
import OptBar from '../opt-bar';

const FlowDag = forwardRef<FlowRef, IFlowDagProps>(
  ({ nodeTypes = {}, edgeTypes = {}, loading, header }, ref) => {
    const flowInstance = useRef<ReactFlowInstance<NodeData, EdgeData> | null>(
      null,
    );
    useImperativeHandle(
      ref,
      () => ({
        getFlowInstance() {
          return flowInstance.current;
        },
      }),
      [],
    );

    const {
      reactFlowWrapper,
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onAddNode,
    } = useReactFlowStore(state => ({
      reactFlowWrapper: state.reactFlowWrapper,
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      onAddNode: state.onAddNode,
    }));

    const [, drop] = useDrop<DraggableNodeType>(
      () => ({
        accept: DRAGGABLE_NODE_ID,
        drop: (item, monitor) => {
          if (!item.undraggable) {
            const coordinates = monitor.getClientOffset() || { x: 0, y: 0 };
            const reactFlowBounds =
              reactFlowWrapper?.current?.getBoundingClientRect() || {
                left: 0,
                top: 0,
              };
            const position = flowInstance.current?.project({
              x: coordinates.x - reactFlowBounds.left || 0,
              y: coordinates.y - reactFlowBounds.top || 0,
            }) || { x: 0, y: 0 };
            onAddNode({
              type: item.nodeType,
              position,
              data: {
                name: item.name,
                display_name: item.display_name,
                icon: item.name,
              },
            });
          }
        },
      }),
      [onAddNode, flowInstance],
    );

    // edge连接
    const handleEdgeConnect = useCallback<OnConnect>(
      connect => {
        if (connect.source === connect.target) {
          return;
        }
        // 如果是custom为true，则不进行连接
        if (
          isCustomEdge(connect.sourceHandle || '', connect.targetHandle || '')
        ) {
          return;
        }
        if (connect.source && connect.target) {
          onConnect({
            connect,
          });
        }
      },
      [onConnect],
    );

    const dropRef = useRef<HTMLDivElement>(null);
    drop(dropRef);

    return (
      <div className="h-full w-full relative" ref={reactFlowWrapper}>
        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-full flex items-center justify-center',
            {
              'z-9999 block': loading,
              hidden: !loading,
            },
          )}>
          <Spinner className="text-brand" />
        </div>
        <ReactFlow
          onInit={instance => {
            flowInstance.current = instance;
          }}
          className="h-full w-full"
          ref={dropRef}
          nodes={nodes}
          edges={edges}
          minZoom={0.1}
          maxZoom={2.5}
          defaultViewport={defaultViewport}
          panOnDrag
          panOnScroll={false}
          preventScrolling
          selectionOnDrag={false}
          zoomOnDoubleClick={false}
          zoomOnPinch
          defaultEdgeOptions={edgeOptions}
          connectionLineStyle={connectionLineStyle}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleEdgeConnect}
          deleteKeyCode={null}
          multiSelectionKeyCode={null}
          proOptions={{
            hideAttribution: true,
          }}>
          {header}
          <OptBar />
          <Background gap={[14, 14]} size={2} color="#E4E5E7" />
        </ReactFlow>
      </div>
    );
  },
);

FlowDag.displayName = 'FlowDag';

const MemoizedFlowDag = memo(FlowDag, (prevProps, nextProps) =>
  isEqual(prevProps.loading, nextProps.loading),
);

export default FlowDag;
