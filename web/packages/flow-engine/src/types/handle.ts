/**
 * 连线的端点
 */

import { HandleProps } from 'reactflow';

export enum HandleStatusEnum {
  default = 'default',
  success = 'success',
  failed = 'failed',
  is_running = 'is_running',
}

export enum HandleTypeEnum {
  left = 'target',
  right = 'source',
}

export type HandleStatus = keyof typeof HandleStatusEnum;

export interface IHandle extends Omit<HandleProps, 'type' | 'position'> {
  id: string;
  type?: HandleStatus;
  style?: React.CSSProperties | undefined;
  index?: number;
  hidden?: boolean;
  isConnectable?: boolean;
}
