import { findLast } from 'lodash-es';
import React, {
  type ReactNode,
  type SetStateAction,
  type Dispatch,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useOnSelectionChange,
  useNodesState,
  useEdgesState,
  XYPosition,
  useViewport,
  Connection,
  addEdge,
  type NodeChange,
  type EdgeChange,
  Viewport,
  Edge,
  Node,
} from 'reactflow';
import { useContextSelector, createContext } from 'use-context-selector';
import { useImmer } from 'use-immer';

import {
  INode,
  IEdge,
  IFlow,
  NodeType,
  EdgeData,
  NodeData,
  EdgeTypeEnum,
  NodeId,
  NodeName,
} from '../../types';
import { getLayouted, getNodeName, parseNodeName, uuid } from '../../utils';

export type FlowState = {
  readonly flow: IFlow;
  readonly viewport: Viewport;
  readonly nodes: INode;
  readonly edges: IEdge;
  readonly reactFlowWrapper: React.RefObject<HTMLDivElement> | null;
  nodeIndex: Record<string, number>;
  readonly selectedNodes: Node[];
  readonly selectedEdges: Edge[];
};

export interface AddNodeProps {
  type: NodeType;
  position: XYPosition;
  data: {
    name: string;
    display_name: string;
    icon?: string;
    id?: string;
  };
}

export interface DelNodeProps {
  id: NodeId;
}

export type FlowAction = {
  onFlowChange: (flow: IFlow) => void;
  onLayoutedByDagre: () => void;
  setNodes: OnSet<INode>;
  onNodesChange: OnChange<NodeChange>;
  setEdges: OnSet<IEdge>;
  onEdgesChange: OnChange<EdgeChange>;
  onChangeNodeData: (id: NodeId, values: NodeData) => void;
  onChangeEdgeData: (id: string, values: EdgeData) => void;
  onFixView: () => void;
  onAddNode: (e: AddNodeProps) => void;
  onDelNode: (e: DelNodeProps) => void;
  onDelEdge: (e: { id: string }) => void;
  onConnect: ({
    connect,
    edge,
  }: {
    connect: Connection;
    edge?: Omit<Edge, 'id' | 'source' | 'target'>;
  }) => any;
};

export type FlowStore = FlowState & FlowAction;

export type OnSet<SetType> = Dispatch<SetStateAction<SetType>>;
export type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export interface FlowStoreProviderProps {
  children: ReactNode;
}

export const EMPTY = (): void => undefined;

export const FlowStoreContext = createContext<FlowStore>({
  reactFlowWrapper: null,
  flow: {
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  },
  viewport: { x: 0, y: 0, zoom: 1 },
  nodes: [],
  edges: [],
  nodeIndex: {},
  selectedNodes: [],
  selectedEdges: [],
  onFlowChange: EMPTY,
  setNodes: EMPTY,
  onNodesChange: EMPTY,
  onChangeNodeData: EMPTY,
  onChangeEdgeData: EMPTY,
  setEdges: EMPTY,
  onEdgesChange: EMPTY,
  onLayoutedByDagre: EMPTY,
  onFixView: EMPTY,
  onAddNode: EMPTY,
  onDelNode: EMPTY,
  onDelEdge: EMPTY,
  onConnect: EMPTY,
});

export const FlowStoreProvider = ({ children }: FlowStoreProviderProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeData>([]);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);

  const viewport = useViewport();
  const [nodeIndex, setNodeIndex] = useImmer<Record<string, number>>({});
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  useOnSelectionChange({
    onChange: params => {
      setSelectedNodes(params.nodes);
      setSelectedEdges(params.edges);
    },
  });

  const onFixView = useCallback(() => {
    const btn = document.querySelector(
      '.react-flow__controls-fitview',
    ) as HTMLButtonElement;

    setTimeout(() => {
      btn?.click();
    }, 100);
  }, []);

  const onDelEdge = useCallback(({ id }: { id: string }) => {
    setEdges(state => state.filter(edge => edge.id !== id));
  }, []);

  const onFlowChange = (flow: IFlow) => {
    setEdges(flow?.edges);
    setNodes(flow?.nodes);
  };

  const onLayoutedByDagre = () => {
    const layouted = getLayouted({
      nodes,
      edges,
    });
    setEdges(layouted.edges);
    setNodes(layouted.nodes);
  };

  const onAddNode = useCallback(
    ({ type, position, data }: AddNodeProps) => {
      const { name, display_name: displayName } = data;
      const lastNodeName =
        findLast(nodes, node => node.data.name === name)?.data.display_name ||
        '';
      const lastIndex = parseNodeName(lastNodeName as NodeName).index || 0;

      const index = (nodeIndex[name] || lastIndex) + 1;
      const id = data?.id || (uuid() as NodeId);
      setNodeIndex(draft => {
        draft[name] = index;
      });
      setNodes(
        nodes =>
          [
            ...nodes,
            {
              id,
              position,
              type,
              selectable: true,
              focusable: true,
              draggable: true,
              data: {
                type,
                id,
                name,
                display_name: getNodeName(displayName, index),
              },
            },
          ] as any,
      );
    },
    [nodeIndex, nodes],
  );

  const onDelNode = useCallback(({ id }: DelNodeProps) => {
    // 删除节点
    setNodes(state => state.filter(item => item.id !== id));
    // 删除连线
    setEdges(state =>
      state.filter(edge => edge.source !== id && edge.target !== id),
    );
  }, []);

  type OnConnectProps = {
    connect: Connection;
    edge?: Omit<Edge, 'id' | 'source' | 'target'>;
  };

  // 连线
  const onConnect = useCallback(
    ({ connect, edge }: OnConnectProps) => {
      if (edge) {
        setEdges(state => {
          return addEdge(
            {
              ...connect,
              ...edge,
            },
            state,
          );
        });
      } else {
        setEdges(state =>
          addEdge(
            {
              ...connect,
              type: EdgeTypeEnum.default,
              animated: false,
            },
            state,
          ),
        );
      }
    },
    [nodes, setEdges],
  );

  // 更新节点的data
  const onChangeNodeData = useCallback(
    (id: NodeId, values: NodeData) => {
      // 通过id查找nodes中对应的node
      // node的data改成对应的values
      // setNode 改值

      const newNodes = nodes?.map(item => {
        if (item?.id === id) {
          return {
            ...item,
            data: {
              ...values,
            },
          };
        }
        return item;
      });
      setNodes(newNodes);
    },
    [nodes],
  );

  // 更新连线的data
  const onChangeEdgeData = useCallback(
    (id: string, values: EdgeData) => {
      const newEdges = edges?.map(item => {
        if (item?.id === id) {
          return {
            ...item,
            data: {
              ...values,
            },
          };
        }
        return item;
      });
      setEdges(newEdges);
    },
    [edges],
  );

  const storeValue = useMemo<FlowStore>(
    () => ({
      reactFlowWrapper,
      flow: {
        viewport,
        nodes,
        edges,
      },
      nodes,
      edges,
      viewport,
      nodeIndex,
      setNodes,
      onNodesChange,
      setEdges,
      onEdgesChange,
      onFlowChange,
      onLayoutedByDagre,
      onFixView,
      onAddNode,
      onDelNode,
      onDelEdge,
      onConnect,
      selectedNodes,
      selectedEdges,
      onChangeNodeData,
      onChangeEdgeData,
    }),
    [
      reactFlowWrapper,
      nodes,
      edges,
      viewport,
      nodeIndex,
      setNodes,
      onNodesChange,
      setEdges,
      onEdgesChange,
      onFlowChange,
      onFixView,
      onAddNode,
      onDelNode,
      onDelEdge,
      onConnect,
      selectedNodes,
      selectedEdges,
      onChangeNodeData,
      onChangeEdgeData,
    ],
  );

  return (
    <FlowStoreContext.Provider value={storeValue}>
      {children}
    </FlowStoreContext.Provider>
  );
};

export const useReactFlowStore = <T,>(selector: (store: FlowStore) => T): T => {
  return useContextSelector(FlowStoreContext, selector);
};
