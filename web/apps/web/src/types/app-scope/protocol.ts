import {
  CustomEventName,
  CustomKey,
  ReservedKey,
  SnakeCaseName,
} from '@shellagent/pro-config';
import { z } from 'zod';

/**
 * only process Space, not continous Uppercase letters
 * examples see test cases
 */
export function customSnakeCase(s: unknown) {
  if (typeof s !== 'string') return s;
  const r = s.split(/(?<![A-Z])(?=[A-Z])|\s+/);
  return r.map(i => i.toLowerCase()).join('_');
}

export const variableTypeSchema = z.enum([
  'text',
  'image',
  'audio',
  'video',
  'file',
  'text_file',
]);

export type VariableType = z.infer<typeof variableTypeSchema>;

// FIX: Primitive variables cannot recurse.
// https://github.com/colinhacks/zod/discussions/2245
// https://github.com/colinhacks/zod?tab=readme-ov-file#recursive-types
// const baseVariableSchema = z.object({
//   type: variableTypeSchema,
// }).strict();

// export type Variable = z.infer<typeof baseVariableSchema> & {
//   value: Variable | string;
// };

// export const variableSchema: z.ZodType<Variable> = baseVariableSchema.extend({
//   value: z.union([z.lazy(() => variableSchema), z.string()]),
// });

export const variableSchema = z
  .object({
    type: variableTypeSchema,
    // value: z.string()
  })
  .strict();

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
    } else if (arg !== customSnakeCase(arg)) {
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
      arg.split('.').forEach(a => {
        const ret = customKeySchema.safeParse(a);
        if (!ret.success) {
          ret.error?.issues.forEach(iss => ctx.addIssue(iss));
        }
      });
    }
  }) satisfies z.Schema<CustomEventName>;

// FIX: Currently, ⁠variables should not contain a value as role of a subview.
// But the root issue is that type and data info are mixed within the subview.
// This should be refactored in Q4.
export const taskVariableSchema = z
  .object({
    type: z.literal('task'),
    // value: z.union([variableSchema, z.string()]),
  })
  .strict();

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
        ret.error.issues.forEach(iss => ctx.addIssue(iss));
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

export const buttonSchema = z
  .object({
    event: customEventSchema,
    payload: z.record(customKeySchema, variableSchema),
  })
  .strict();

export const buttonsSchema = z.record(customKeySchema, buttonSchema);

export const renderSchema = z
  .object({
    buttons: buttonsSchema,
  })
  .strict();

export const stateSchema = z
  .object({
    // variables: z.record(customKeySchema, variableSchema), // TO REMOVE: redundant with outputs variables
    children: z.object({
      inputs: z.object({
        variables: variablesSchema,
      }),
      tasks: z.object({
        variables: taskVariablesSchema,
      }),
      outputs: z.object({
        variables: outputVariablesSchema.describe(
          'Actually represents state output',
        ),
        render: renderSchema,
      }),
    }),
  })
  .strict();
