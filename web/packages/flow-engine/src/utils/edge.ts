export const isCustomEdge = (sourceHandle: string, targetHandle: string) => {
  return sourceHandle.startsWith('custom') || targetHandle.startsWith('custom');
};
