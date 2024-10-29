import { CustomKey, ReservedKey, SnakeCaseName } from '@shellagent/pro-config';
import { z } from 'zod';
import { snakeCase, lowerCase } from 'lodash-es';

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

export const taskVariableSchema = z.object({
  type: z.literal('task'),
  value: z.union([variableSchema, z.string()]),
});

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
]) satisfies z.Schema<ReservedKey>;

export const customKeySchema = z
  .custom<Lowercase<SnakeCaseName>>()
  .transform(val => {
    return snakeCase(val).toLowerCase() as Lowercase<SnakeCaseName>;
  })
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

export const outputContextNameSchema = z
  .custom<`context.${CustomKey}`>()
  .superRefine((arg, ctx) => {
    if (!arg.startsWith('context.')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is invalid, should start with context.`,
      });
    }
  });

export const outputNameSchema = z.union([
  customKeySchema,
  outputContextNameSchema,
]);

export const variablesSchema = z.record(customKeySchema, variableSchema);

export const stateSchema = z.object({
  variables: variablesSchema,
  children: z.object({
    inputs: z.object({
      variables: variablesSchema,
    }),
    tasks: z.object({
      variables: taskVariableSchema,
    }),
    outputs: z.object({}),
  }),
});
