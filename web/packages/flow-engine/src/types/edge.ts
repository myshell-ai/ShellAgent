// 全量的edge类型
export enum EdgeTypeEnum {
  default = 'default_edge',
  success = 'success_edge',
  failed = 'failed_edge',
  is_running = 'is_running_edge',
}

export type EdgeType = keyof typeof EdgeTypeEnum;

export interface EdgeData {
  index?: number;
  [key: string]: any;
}
