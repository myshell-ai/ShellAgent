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

export const refOptOutputGlobalSchema = z.object({
  display_name: z.string(),
  variables: variablesSchema,
});

export const refOptionsOutputSchema = z.object({
  global: z.record(
    z.union([customKeySchema, z.literal('context')]),
    refOptOutputGlobalSchema,
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

export const refsSchema = z.record(
  customKeySchema,
  z.record(
    z.string().describe('json path'),
    z.object({
      ui: z.array(z.string()),
      raw: z.array(z.string()),
      ref: z.string(),
    }),
  ),
);

export type Refs = z.infer<typeof refsSchema>;