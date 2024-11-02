import { z } from 'zod';

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
  'state_output_key',
  'state_render',
  'button_payload',
  'button_payload_key',
  'target_input',
]);

export type RefType = z.infer<typeof refTypeSchema>;
