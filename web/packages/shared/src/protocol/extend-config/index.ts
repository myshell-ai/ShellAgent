import { z } from 'zod';
import { customKeySchema, refsSchema } from '../app-scope';

const FieldModeEnum = z.enum(['ui', 'ref', 'raw']);

export const ExtendConfigSchema = z.object({
  fieldsModeMap: z.record(customKeySchema, z.record(z.string(), FieldModeEnum)),
  refs: refsSchema,

  // app builder 未使用
  schemaModeMap: z.record(z.string(), z.string()),
});

export type ExtendConfig = z.infer<typeof ExtendConfigSchema>;
