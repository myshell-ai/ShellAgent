import { z } from 'zod';
import {
  buttonsSchema,
  customEventSchema,
  customKeySchema,
  outputVariablesSchema,
  stateSchema,
  taskSchema,
  variablesSchema,
} from './protocol';

export const edgeSchema = z.object({
  source: customKeySchema,
  target: customKeySchema,
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
      ui: z.array(z.string()).optional(),
      raw: z.array(z.string()).optional(),
      ref: z.string().optional(),
    }),
  ),
);

export type Refs = z.infer<typeof refsSchema>;

export const setNodedataKeyValParamSchema = z.object({
  stateName: customKeySchema,
  key: z.string(),
  newValue: z.string(),
  mode: z.enum(['ref', 'ui']),
  origVal: z.string().optional(),
});

export const renameNodedataKeyParamSchema = z.object({
  stateName: customKeySchema,
  oldKey: z.string(),
  newKey: z.string(),
});

export const changNodedataModeParamSchema = z.object({
  stateName: customKeySchema,
  key: z.string(),
  mode: z.enum(['ref', 'ui', 'raw']),
});

export const renameStateNameParamSchema = z.object({
  oldName: z.string(),
  newName: z.string(),
});

export const renameStateOutputParamSchema = z.object({
  stateName: customKeySchema,
  oldOutputName: z.string(),
  newOutputName: z.string(),
});

export const renameRefOptParamSchema = z.object({
  oldPath: z.string(),
  newPath: z.string(),
});

export const removeNodeKeySchema = z.object({
  stateName: customKeySchema,
  key: z.string(),
});

export const removeRefOptsSchema = z.object({
  paths: z.array(z.string()),
});

export const removeRefOptsPrefixScheam = z.object({
  prefix: z.array(z.string()),
});

export const removeEdgeScheam = z.object({
  edges: edgesSchema,
  removeEdge: edgeSchema,
});

export const handleRefSceneSchema = z.union([
  // nodedata
  z.object({
    scene: z.literal('set_nodedata_key_val'),
    params: setNodedataKeyValParamSchema,
  }),
  z.object({
    scene: z.literal('rename_nodedata_key'),
    params: renameNodedataKeyParamSchema,
  }),
  z.object({
    scene: z.literal('change_nodedata_mode'),
    params: changNodedataModeParamSchema,
  }),
  z.object({
    scene: z.literal('remove_nodedata_key'),
    params: removeNodeKeySchema,
  }),
  // ref
  z.object({
    scene: z.literal('rename_ref_opt'),
    params: renameRefOptParamSchema,
  }),
  z.object({
    scene: z
      .literal('rename_state_name')
      .describe('shortcut of rename_ref_opt'),
    params: renameStateNameParamSchema,
  }),
  z.object({
    scene: z
      .literal('rename_state_output')
      .describe('shortcut of rename_ref_opt'),
    params: renameStateOutputParamSchema,
  }),
  z.object({
    scene: z.literal('remove_ref_opts'),
    params: removeRefOptsSchema,
  }),
  z.object({
    scene: z.literal('remove_ref_opts_prefix'),
    params: removeRefOptsPrefixScheam,
  }),
  z.object({
    scene: z
      .literal('remove_edge')
      .describe('shortcut of remove_ref_opt_prefix'),
    params: removeEdgeScheam,
  }),
]);

export type HandleRefSceneEvent = z.infer<typeof handleRefSceneSchema>;
