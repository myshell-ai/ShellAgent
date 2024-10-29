import { CustomKey } from '@shellagent/pro-config';
import { z } from 'zod';

export const variableTypeSchema = z.enum([
  'text',
  'image',
  'audio',
  'video',
  'file',
  'text_file',
]);

// https://github.com/colinhacks/zod/discussions/2245
// https://github.com/colinhacks/zod?tab=readme-ov-file#recursive-types
const baseVariableSchema = z.object({
  type: variableTypeSchema,
});

export type Variable = z.infer<typeof baseVariableSchema> & {
  value: Variable | string;
};

export const variableSchema: z.ZodType<Variable> = baseVariableSchema.extend({
  value: z.union([z.lazy(() => variableSchema), z.string()]),
});

// pro-config-type/common.ts#7
export const reservedKeySchema = z.enum([
  'type',
  'id',
  'properties',
  'inputs',
  'outputs',
  'tasks',
  'render',
  'transitions',
  'states',
  'context',
  'payload',
]);

export const customKeySchema = z
  .custom<Lowercase<string>>()
  .superRefine((arg, ctx) => {
    if (typeof arg !== 'string') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is not a string`,
      });
    } else if (arg !== arg.toLowerCase()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is not lowercase`,
      });
    } else if (reservedKeySchema.safeParse(arg).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is a reserved key`,
      });
    }
  }) satisfies z.Schema<CustomKey>;

export const variablesSchema = z.record(customKeySchema, variableSchema);

export const ouputNameSchema = z.union([customKeySchema, z.string()]);

export const stateSchema = z.object({
  variables: variablesSchema,
  children: z.object({
    inputs: z.object({
      variables: variablesSchema,
    }),
    tasks: z.object({
      variables: variablesSchema,
    }),
    outputs: z.object({}),
  }),
});
