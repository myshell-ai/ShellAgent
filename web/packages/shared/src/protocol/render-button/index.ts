import { z } from 'zod';
import { customEventSchema } from '../app-scope';

export const ButtonSchema = z.object({
  id: customEventSchema,
  content: z.string(),
  description: z.string(),
  on_click: z.object({
    event: customEventSchema,
    payload: z.record(z.any()),
  }),
});

export type Button = z.infer<typeof ButtonSchema>;
