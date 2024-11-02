import { Task } from '@/types/task/protocol';
import { WidgetItem, NodeTypeEnum } from '@shellagent/flow-engine';

export const getTaskDisplayName = (value: WidgetItem, tasks: Task[]) => {
  let indexMap: Record<string, number> = {};

  tasks?.forEach(task => {
    const parts = task.display_name.split('#');
    const index = parts.length > 1 ? parseInt(parts[1], 10) : 0;

    if (task.mode === NodeTypeEnum.workflow) {
      indexMap[NodeTypeEnum.workflow] = Math.max(
        index,
        indexMap[NodeTypeEnum.workflow] || 0,
      );
    } else if (task.mode === NodeTypeEnum.widget) {
      indexMap[task.widget_class_name] = Math.max(
        index,
        indexMap[task.widget_class_name] || 0,
      );
    }
  });

  if (value.type === NodeTypeEnum.workflow) {
    const nextIndex = (indexMap[NodeTypeEnum.workflow] || 0) + 1;
    return `${value.display_name}#${nextIndex}`;
  }

  const nextIndex = (indexMap[value.name] || 0) + 1;
  return `${value.display_name}#${nextIndex}`;
};
