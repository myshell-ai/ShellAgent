import { z } from 'zod';
import { NodeTypeEnum } from '@shellagent/flow-engine';
import { customKeySchema } from '@/types/app-scope/protocol';

// 基础任务模式
const BaseTaskSchema = z
  .object({
    type: z.literal('task'),
    display_name: z.string(),
    name: customKeySchema,
    mode: z.nativeEnum(NodeTypeEnum),
    inputs: z.record(z.string()),
    outputs: z.record(z.string()),
    custom: z.boolean().optional(),
  })
  .strict();

// Workflow 任务模式
const WorkflowTaskSchema = BaseTaskSchema.extend({
  mode: z.literal(NodeTypeEnum.workflow),
  workflow_id: z.string().uuid().optional(),
}).strict();

// Widget 任务模式
const WidgetTaskSchema = BaseTaskSchema.extend({
  mode: z.literal(NodeTypeEnum.widget),
  widget_name: z.string().optional(),
  widget_class_name: z.string(),
}).strict();

// 使用判别联合类型合并
const TaskSchema = z.discriminatedUnion('mode', [
  WorkflowTaskSchema,
  WidgetTaskSchema,
]);

export type Task = z.infer<typeof TaskSchema>;
export type WorkflowTask = z.infer<typeof WorkflowTaskSchema>;
export type WidgetTask = z.infer<typeof WidgetTaskSchema>;

export { TaskSchema, WorkflowTaskSchema, WidgetTaskSchema };
