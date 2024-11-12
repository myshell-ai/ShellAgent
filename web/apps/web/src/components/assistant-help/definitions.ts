import { z } from 'zod';

export const MessageItem = z.object({
  question: z.string().optional(),
  reply: z.string().optional(),
  loading: z.boolean().optional(),
});

export const MessagesRes = z.object({
  messages: z.array(MessageItem),
});
