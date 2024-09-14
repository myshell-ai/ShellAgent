import { Edge } from '@shellagent/flow-engine';

export enum EdgeTypeEnum {
  custom = 'custom_edge',
}

export enum EdgeDataTypeEnum {
  ALWAYS = 'ALWAYS',
  CHAT = 'CHAT',
  STATE = 'STATE',
}

export interface ICondition {
  source: string;
  condition: string;
  target_inputs: Record<string, string>;
  target: string;
}

export type CustomEdgeData = {
  id?: string;
  custom?: boolean;
  event_key?: string;
  type?: EdgeDataTypeEnum;
  source?: string;
  target?: string;
  conditions?: {
    condition: string;
    target_inputs: Record<string, string>;
  }[];
};

export type ICustomEdge = Edge<CustomEdgeData>;
