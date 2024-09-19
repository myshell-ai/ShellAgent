import { ICondition, ICustomEdge } from '@/components/app/edges';

// 把egde data映射到每个表单中
export const edgeData2Form = (
  edges: ICustomEdge[],
  sourceHandle: string,
): ICondition[] => {
  const result: ICondition[] = [];
  edges
    .filter(edge => edge.sourceHandle === sourceHandle)
    .forEach(edge => {
      if (edge.data?.conditions?.length) {
        edge.data?.conditions?.forEach(item => {
          result.push({
            source: edge.source,
            condition: item.condition,
            target: edge.target,
            target_inputs: item.target_inputs,
          });
        });
      } else {
        result.push({
          source: edge.source,
          condition: '',
          target: edge.target,
          target_inputs: {},
        });
      }
    });
  return result;
};

export const form2EdgeData = ({
  edges,
  values,
  sourceHandle,
}: {
  edges: ICustomEdge[];
  values: ICondition[];
  sourceHandle: string;
}) => {
  const result: Record<string, { conditions: string[] }> = {};
  const edgesToAdd: ICondition[] = [];
  const edgesToDelete: ICustomEdge[] = [];
  const edgesToModify: { edge: ICustomEdge; newData: ICondition }[] = [];

  const edgeMap = new Map<string, ICustomEdge>();
  edges.forEach(edge => {
    if (edge.sourceHandle === sourceHandle) {
      edgeMap.set(edge.target, edge);
    }
  });

  values.forEach(v => {
    const id = `${sourceHandle}-${v.target}`;
    if (!result[id] || !result[id]?.conditions) {
      result[id] = {
        conditions: [],
      };
    }
    result[id].conditions?.push(v.condition);

    const existingEdge = edgeMap.get(v.target);
    if (!existingEdge) {
      edgesToAdd.push(v);
    } else if (JSON.stringify(existingEdge.data) !== JSON.stringify(v)) {
      edgesToModify.push({ edge: existingEdge, newData: v });
    }
  });

  edgeMap.forEach((edge, target) => {
    if (!values.some(v => v.target === target)) {
      edgesToDelete.push(edge);
    }
  });

  return { edgesToAdd, edgesToDelete, edgesToModify };
};
