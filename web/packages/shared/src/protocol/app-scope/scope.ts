import { z } from 'zod';
import {
  buttonsSchema,
  customKeySchema,
  outputVariablesSchema,
  taskSchema,
  variablesSchema,
} from './protocol';

export const edgesSchema = z.array(
  z.object({
    source: z.string(),
    target: z.string(),
  }),
);

export type Edges = z.infer<typeof edgesSchema>;

export const refTypeSchema = z.enum([
  'state_input',
  'state_task',
  'state_output',
  'state_render',
  'target_input',
]);

export type RefType = z.infer<typeof refTypeSchema>;

export const refOptionsOutputSchema = z.object({
  global: z.record(
    z.union([customKeySchema, z.literal('context')]),
    variablesSchema,
  ),
  local: z.object({
    inputs: z.object({
      variables: variablesSchema,
    }),
    tasks: z.array(taskSchema),
    outputs: z.object({
      variables: outputVariablesSchema,
    }),
    buttons: buttonsSchema,
  }),
});

export type RefOptionsOutput = z.infer<typeof refOptionsOutputSchema>;
