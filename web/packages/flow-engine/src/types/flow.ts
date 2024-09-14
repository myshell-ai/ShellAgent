import {
  type Node,
  type Edge,
  ReactFlowJsonObject,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
} from 'reactflow';

import { EdgeData } from './edge';
import { MaterialListType } from './material-list';
import { NodeType, NodeData } from './node';

export type INode = Node<NodeData, NodeType | string | undefined>[];

export type IEdge = Edge<EdgeData>[];

// flow全量数据
export type IFlow = ReactFlowJsonObject<NodeData, EdgeData>;

export type FlowRef = { getFlowInstance: () => ReactFlowInstance | null };

// flow组件props
export interface IFlowDagProps {
  // value: IFlow;
  // defaultValue?: IFlow;
  // onChange: (data: IFlow) => void;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  materialList?: MaterialListType;
  listLoading?: boolean;
  loading?: boolean;
  footerExtra?: React.ReactNode;
  header?: React.ReactNode;
}
