import { Task } from '@/protocol/task';
import { Button } from '@/protocol/render-button';
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

export const getButtonDisplayName = (value: Button[]) => {
  let indexMap: Record<string, number> = {};

  value?.forEach(button => {
    const parts = button.content.split('#');
    const index = parts.length > 1 ? parseInt(parts[1], 10) : 0;
    indexMap['button'] = Math.max(index, indexMap['button'] || 0);
  });

  const nextIndex = (indexMap['button'] || 0) + 1;
  return `Button#${nextIndex}`;
};
