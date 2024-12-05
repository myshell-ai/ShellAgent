import { z } from 'zod';
import { customEventSchema } from '../app-scope/protocol';

export const ButtonSchema = z.object({
  id: z.string(),
  content: z.string(),
  description: z.string(),
  on_click: z.object({
    event: customEventSchema,
    payload: z.record(z.any()),
  }),
});

export type Button = z.infer<typeof ButtonSchema>;
