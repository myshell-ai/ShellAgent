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

  values.forEach(v => {
    const id = `${sourceHandle}-${v.target}`;
    if (!result[id] || !result[id]?.conditions) {
      result[id] = {
        conditions: [],
      };
    }
    result[id].conditions?.push(v.condition);

    // 检查是否需要添加新边
    const existingEdge = edges.find(
      edge => edge.sourceHandle === sourceHandle && edge.target === v.target,
    );
    if (!existingEdge) {
      edgesToAdd.push(v);
    } else if (JSON.stringify(existingEdge.data) !== JSON.stringify(v)) {
      edgesToModify.push({ edge: existingEdge, newData: v });
    }
  });

  // 检查需要删除的边
  edges.forEach(edge => {
    if (edge.sourceHandle === sourceHandle) {
      const matchingNewTransition = values.find(
        nt => nt.target === edge.target,
      );
      if (!matchingNewTransition) {
        edgesToDelete.push(edge);
      }
    }
  });

  return { edgesToAdd, edgesToDelete, edgesToModify };
};
