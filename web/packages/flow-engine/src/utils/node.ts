// 获取node id
import { NodeName } from '../types';

export const getNodeName: (name: string, index: number) => NodeName = (
  name,
  index,
) => `${name}#${index}`;

export const parseNodeName: (nodeId?: NodeName) => {
  name: string;
  index: number;
} = nodeId => {
  if (!nodeId) {
    return { name: '', index: 0 };
  }
  const [name, index] = nodeId.split('#');
  return { name, index: Number(index) };
};
