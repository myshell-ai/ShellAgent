export enum DataTypeEnum {
  string = 'string',
  map = 'map',
  all = 'all',
}

// 全量node类型
export enum NodeTypeEnum {
  start = 'start',
  end = 'end',
  widget = 'widget',
  state = 'state',
  workflow = 'workflow',
}

export type NodeType = keyof typeof NodeTypeEnum;

export type DataType = keyof typeof DataTypeEnum;

export enum NodeIdEnum {
  start = '@@@start',
  end = '@@@end',
}

// 节点id通过uuid生成
export type WidgetNodeId = `key_${string}`;
export type StateNodeId = `key_${string}`;
// 节点名称
export type NodeName = `${string}#${number}`;

// start和end节点唯一
export type NodeId = WidgetNodeId | NodeIdEnum.start | NodeIdEnum.end;

export enum NodeStatusEnum {
  start = 'start',
  succeeded = 'succeeded',
  failed = 'failed',
}

// 节点运行状态
export type NodeStatus =
  | NodeStatusEnum.start
  | NodeStatusEnum.succeeded
  | NodeStatusEnum.failed;

// 通用节点数据
interface CommonNode {
  id: NodeId;
  runtime_data?: {
    input: Record<string, any>;
    output: Record<string, any>;
    node_id: NodeId;
    create_time: number;
    finish_time: number | null;
    node_status: NodeStatus;
    progress?: number;
  };
  name?: string;
  display_name?: NodeName | string;
  index?: number;
}

export type StartNode = CommonNode & {
  type: 'start';
};

export type EndNode = CommonNode & {
  type: 'end';
};

export type WidgetNode = CommonNode & {
  type: 'widget';
};

export type StateNode = CommonNode & {
  type: 'state';
};

// 全量的自定义节点data数据

export type NodeData = StartNode | EndNode | WidgetNode | StateNode;
