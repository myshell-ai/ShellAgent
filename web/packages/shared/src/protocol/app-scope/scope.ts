import { z } from 'zod';
import {
  buttonsSchema,
  customKeySchema,
  outputVariablesSchema,
  taskSchema,
  variablesSchema,
} from './protocol';
import { reservedStateNameSchema } from '../node';

export const edgeSchema = z.object({
  source: z.union([customKeySchema, reservedStateNameSchema]),
  target: z.union([customKeySchema, reservedStateNameSchema]),
});
export type Edge = z.infer<typeof edgeSchema>;

export const edgesSchema = z.array(edgeSchema);

export type Edges = z.infer<typeof edgesSchema>;

export const refTypeSchema = z.enum([
  'state_input',
  'state_task',
  'state_output',
  'state_render',
  'target_input',
  'state_output_key',
]);

export type RefType = z.infer<typeof refTypeSchema>;

export const refOptOutputGlobalSchema = z.object({
  display_name: z.string(),
  variables: variablesSchema,
});

export const refOptionsOutputSchema = z.object({
  global: z.record(
    z.union([customKeySchema, z.literal('context')]),
    refOptOutputGlobalSchema,
  ),
  local: z.object({
    inputs: z.object({
      variables: variablesSchema,
    }),
    tasks: z.array(taskSchema),
    outputs: z.object({
      variables: outputVariablesSchema,
    }),
    buttons: buttonsSchema,
  }),
});

export type RefOptionsOutput = z.infer<typeof refOptionsOutputSchema>;

export const refsSchema = z.record(
  customKeySchema,
  z.record(
    z.string().describe('json path'),
    z.object({
      currentMode: z
        .union([z.literal('ui'), z.literal('raw'), z.literal('ref')])
        .optional(),
      ui: z.array(z.string()).optional(),
      raw: z.array(z.string()).optional(),
      ref: z.string().optional(),
    }),
  ),
);

export type Refs = z.infer<typeof refsSchema>;

export const setNodedataKeyValParamSchema = z.union([
  z.object({
    mode: z.literal('ref'),
    stateName: customKeySchema,
    key: z.string(),
    newValue: z.string(),
  }),
  z.object({
    mode: z.literal('ui'),
    stateName: customKeySchema,
    key: z.string(),
    newValue: z.array(z.string()),
  }),
  z.object({
    mode: z.literal('raw'),
    stateName: customKeySchema,
    key: z.string(),
    newValue: z.array(z.string()),
  }),
]);

export const changNodedataModeParamSchema = z.object({
  stateName: customKeySchema,
  key: z.string(),
  mode: z.enum(['ref', 'ui', 'raw']),
});

export const renameStateNameParamSchema = z.object({
  oldName: z.string(),
  newName: z.string(),
});

export const renameRefOptParamSchema = z.object({
  oldPath: z.string(),
  newPath: z.string(),
  stateName: customKeySchema.optional(),
  byPrefix: z.boolean().optional(),
});

export const removeRefOptsSchema = z.object({
  paths: z.array(z.string()),
  stateName: customKeySchema.optional(),
});

export const removeRefOptsPrefixScheam = z.object({
  prefix: z.array(z.string()),
  stateName: customKeySchema.optional(),
});

export const removeEdgeScheam = z.object({
  edges: edgesSchema,
  removeEdge: edgeSchema,
});

export const duplicateStateSchema = z.object({
  stateName: customKeySchema,
  duplicateStateName: customKeySchema,
});

export const removeStateParamSchema = z.object({
  stateName: customKeySchema,
});

export const renameKeyParamSchema = z.object({
  stateName: customKeySchema,
  oldKey: z.string(),
  newKey: z.string(),
});

export const reorderTaskSchema = z.object({
  previousTasks: z.array(z.string()),
  currentTasks: z.array(z.string()),
  stateName: customKeySchema,
});

export const RefSceneEnum = z.enum([
  'set_nodedata_key_val',
  'change_nodedata_mode',
  'rename_ref_opt',
  'rename_state_name', // todo
  'remove_ref_opts',
  'remove_ref_opts_prefix',
  'remove_edge',
  'duplicate_state',
  'remove_state',
  'reorder_task',
]);

export type RefScene = z.infer<typeof RefSceneEnum>;

export const handleRefSceneSchema = z.union([
  // nodedata change form item value
  z.object({
    scene: z.literal(RefSceneEnum.Enum.set_nodedata_key_val),
    params: setNodedataKeyValParamSchema,
  }),
  z.object({
    scene: z.literal(RefSceneEnum.Enum.change_nodedata_mode),
    params: changNodedataModeParamSchema,
  }),
  // ref update ref option key, should traverse all refs to find and replace
  z.object({
    scene: z.literal(RefSceneEnum.Enum.rename_ref_opt),
    params: renameRefOptParamSchema,
  }),
  z.object({
    scene: z
      .literal(RefSceneEnum.Enum.rename_state_name)
      .describe('shortcut of rename_ref_opt'),
    params: renameStateNameParamSchema,
  }),
  z.object({
    scene: z.literal(RefSceneEnum.Enum.remove_ref_opts),
    params: removeRefOptsSchema,
  }),
  z.object({
    scene: z.literal(RefSceneEnum.Enum.remove_ref_opts_prefix),
    params: removeRefOptsPrefixScheam,
  }),
  z.object({
    scene: z
      .literal(RefSceneEnum.Enum.remove_edge)
      .describe('shortcut of remove_ref_opt_prefix'),
    params: removeEdgeScheam,
  }),
  z.object({
    scene: z.literal(RefSceneEnum.Enum.duplicate_state),
    params: duplicateStateSchema,
  }),
  z.object({
    scene: z.literal(RefSceneEnum.Enum.remove_state),
    params: removeStateParamSchema,
  }),
  z.object({
    scene: z.literal(RefSceneEnum.Enum.reorder_task),
    params: reorderTaskSchema,
  }),
]);

export type HandleRefSceneEvent = z.infer<typeof handleRefSceneSchema>;
