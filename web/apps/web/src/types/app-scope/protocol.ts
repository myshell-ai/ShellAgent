import {
  CustomEventName,
  CustomKey,
  ReservedKey,
  SnakeCaseName,
} from '@shellagent/pro-config';
import { z } from 'zod';
// import { snakeCase } from 'lodash-es';
import { snakeCase } from 'change-case';

export const variableTypeSchema = z.enum([
  'text',
  'image',
  'audio',
  'video',
  'file',
  'text_file',
]);

export type VariableType = z.infer<typeof variableTypeSchema>;

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
  .superRefine((arg, ctx) => {
    if (typeof arg !== 'string') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is not a string`,
      });
    } else if (arg !== snakeCase(arg)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is not snake_case`,
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

export const customEventSchema = z
  .custom<CustomEventName>()
  .superRefine((arg, ctx) => {
    if (arg.indexOf('.') === -1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} should concatenated by dots`,
      });
    } else {
      // TODO: customKey validate or transform
      arg.split('.').forEach(a => {
        const ret = customKeySchema.safeParse(a);
        if (!ret.success) {
          ret.error?.issues.forEach(iss => ctx.addIssue(iss));
        }
      });
    }
  }) satisfies z.Schema<CustomEventName>;

export const taskVariableSchema = z.object({
  type: z.literal('task'),
  value: z.union([variableSchema, z.string()]),
});

export const taskVariablesSchema = z.record(
  customKeySchema,
  taskVariableSchema,
);

export const outputContextNameSchema = z
  .custom<`context.${CustomKey}`>()
  .superRefine((arg, ctx) => {
    if (!arg.startsWith('context.')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is invalid, should start with context.`,
      });
    } else {
      const [a, b] = arg.split('context.');
      const ret = customKeySchema.safeParse(b);
      if (!ret.success) {
        ret.error?.issues.forEach(iss => ctx.addIssue(iss));
      }
    }
  })
  .transform(val => {
    const [a, b] = val.split('context.');
    return `context.${customKeySchema.parse(b)}`;
  });

export const outputNameSchema = z.union([
  outputContextNameSchema,
  customKeySchema,
]);

export const variablesSchema = z.record(customKeySchema, variableSchema);

export const outputVariablesSchema = z.record(outputNameSchema, variableSchema);

export const buttonSchema = z.object({
  event: customEventSchema,
  payload: z.record(customKeySchema, variableSchema),
});

export const buttonsSchema = z.record(customKeySchema, buttonSchema);

export const renderSchema = z.object({
  buttons: buttonsSchema,
});

export const stateSchema = z.object({
  variables: z.record(customKeySchema, variableSchema),
  children: z.object({
    inputs: z.object({
      variables: variablesSchema,
    }),
    tasks: z.object({
      variables: taskVariablesSchema,
    }),
    outputs: z.object({
      variables: outputVariablesSchema,
      render: renderSchema,
    }),
  }),
});
