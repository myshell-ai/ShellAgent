import {
  CustomEventName,
  CustomKey,
  ReservedKey,
  SnakeCaseName,
} from '@shellagent/pro-config';
import { customSnakeCase } from '../../utils/utils';
import { z } from 'zod';
import { reservedStateNameSchema } from '../node';
/**
 * only process Space, not continous Uppercase letters
 * examples see test cases
 */
export { customSnakeCase };

export const primitiveVariableTypeSchema = z.enum([
  'text',
  'image',
  'audio',
  'video',
  'file',
  'text_file',
]);

export type PrimitiveVariableType = z.infer<typeof primitiveVariableTypeSchema>;

// TODO: refer arktype
export type CompoundType = string;

export type VariableType = PrimitiveVariableType | CompoundType;

export const variableTypeSchema = z
  .custom<VariableType>()
  .superRefine((arg, ctx) => {
    if (arg == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `should not be empty`,
      });
    }
    // TODO: check compound type
    // else if (arg.indexOf('|') === -1) {
    //   const ret = primitiveVariableTypeSchema.safeParse(arg);
    //   if (!ret.success) {
    //     ret.error?.issues.forEach(iss => ctx.addIssue(iss));
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: `${arg} is not valid, only allowed compound type, e.g. string|object`,
    //     });
    //   }
    // } else {
    //   // noops
    // }
  });

// FIX: Primitive variables cannot be nested.
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
    display_name: z.string(),
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
    if (
      arg === reservedStateNameSchema.enum.start ||
      arg === reservedStateNameSchema.enum.end
    ) {
      return;
    }
    if (typeof arg !== 'string') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is not a string`,
      });
    } else if (arg.indexOf('.') > -1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${arg} is invalid, contains dots`,
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
    if (arg == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `event name should not be null`,
      });
    } else if (arg.indexOf('.') === -1) {
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

export type Variables = z.infer<typeof variablesSchema>;

export const outputVariablesSchema = z.record(outputNameSchema, variableSchema);

export const buttonSchema = z
  .object({
    event: customEventSchema,
    payload: z.record(customKeySchema, variableSchema),
  })
  .strict();

export const buttonsSchema = z.record(z.string(), buttonSchema);

export type Buttons = z.infer<typeof buttonsSchema>;

export const renderSchema = z
  .object({
    buttons: buttonsSchema,
  })
  .strict();

export const taskVariablesSchema = variableSchema
  .omit({
    type: true,
  })
  .extend({
    type: z.string(),
  });

export const taskSchema = z.object({
  name: z.string(),
  display_name: z.string(),
  variables: variablesSchema,
});

export type Task = z.infer<typeof taskSchema>;

export const stateSchema = z
  .object({
    name: z.string(),
    display_name: z.string(),
    children: z.object({
      inputs: z.object({
        variables: variablesSchema,
      }),
      tasks: z.array(taskSchema),
      outputs: z.object({
        variables: outputVariablesSchema,
        render: renderSchema,
      }),
    }),
  })
  .strict();

export type State = z.infer<typeof stateSchema>;

export const scopesSchema = z.object({
  scopes: z.object({
    context: z.object({
      variables: variablesSchema,
    }),
    edges: z.array(
      z.object({
        target: z.union([customKeySchema, reservedStateNameSchema]),
        source: z.union([customKeySchema, reservedStateNameSchema]),
      }),
    ),
    states: z.record(customKeySchema, stateSchema),
  }),
});

export type Scopes = z.infer<typeof scopesSchema>;
