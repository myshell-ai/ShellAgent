import { z } from 'zod';

export const MessageItem = z.object({
  question: z.string().optional(),
  reply: z.string().optional(),
  loading: z.boolean().optional(),
});

export const MessagesRes = z.object({
  messages: z.array(MessageItem),
});

export const DefaultMessages = [
  {
    reply: `Hi, I'm your ShellAgent Assistant! How can I help you today? \n\n 您好，我是ShellAgent小助手！请问有什么可以帮您？`,
  },
];
