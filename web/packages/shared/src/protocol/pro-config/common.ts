import { z } from 'zod';

// 保留关键字
const originReservedKeys = [
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
] as const;

const extraReservedKeys = ['condition', 'blocks', 'buttons'] as const;

// CustomKey 的正则模式
const customKeyPattern =
  /^(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*$/;

// CustomEventName 的正则模式
const customEventNamePattern =
  /^(?:(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*)(?:\.(?:(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*))*$/;

// TargetPath 的正则模式
const targetPathPattern =
  /^(?:#?(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*)?(?:\.(?:(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*))*$/;

export const snakeCaseNameSchema = z.string();

export const originReservedKeySchema = z.enum(originReservedKeys);

export const reservedKeySchema = z.enum([
  ...originReservedKeys,
  ...extraReservedKeys,
]);

export const customKeySchema = z.string().regex(customKeyPattern, {
  message: 'Must be lowercase snake_case and not a reserved word',
});

export const customEventNameSchema = z.string().regex(customEventNamePattern, {
  message: 'Must be lowercase snake_case names concatenated by dots',
});

export const targetPathSchema = z.string().regex(targetPathPattern, {
  message: 'Must be a valid target path format',
});
