import { CustomKey, CustomEventName } from '@shellagent/pro-config';
import { Scopes } from './protocol';
import {
  changNodedataModeParamSchema,
  Edges,
  HandleRefSceneEvent,
  RefOptionsOutput,
  refOptionsOutputSchema,
  Refs,
  RefType,
  removeRefOptsPrefixScheam,
  removeRefOptsSchema,
  renameRefOptParamSchema,
  renameStateNameParamSchema,
  setNodedataKeyValParamSchema,
  removeEdgeScheam,
  Edge,
  duplicateStateSchema,
} from './scope';
import { reservedStateNameSchema } from '../node';
import {
  cloneDeep,
  isEmpty,
  isNumber,
  mapValues,
  omitBy,
  pickBy,
} from 'lodash-es';
import { z } from 'zod';

export function getRefOptions(
  scopes: Scopes,
  stateName: CustomKey,
  refType: RefType,
  taskIndex?: number,
  eventKey?: CustomEventName,
): RefOptionsOutput {
  const ret: RefOptionsOutput = {
    global: {
      context: {
        display_name: 'Context',
        variables: scopes.scopes.context.variables,
      },
    },
    local: {
      inputs: { variables: {} },
      tasks: [],
      outputs: { variables: {} },
      buttons: {},
    },
  };

  switch (refType) {
    case 'state_input': {
      assignAncestralStatesOutput();
      break;
    }
    case 'state_task': {
      assignAncestralStatesOutput();
      assignCurrentStateInput();
      assignPreviousTasks();
      break;
    }
    case 'state_output': {
      assignAncestralStatesOutput();
      assignCurrentStateInput();
      assignAllTasks();
      break;
    }
    case 'state_render':
      assignStateRender();
      break;
    case 'target_input':
      assignStateRender();
      assignButtonsPayload();
      break;
    default: {
      // noops
    }
  }

  return refOptionsOutputSchema.parse(ret);

  function assignStateRender() {
    assignAncestralStatesOutput();
    assignCurrentStateInput();
    assignAllTasks();
    assignCurrentStateOutput();
  }

  function assignButtonsPayload() {
    const state = scopes.scopes.states[stateName];
    if (state == null) throw new Error(`cannot find ${stateName} in scopes`);
    if (refType === 'target_input' && eventKey == null)
      throw new Error(`should provide eventKey if refType is target_input`);

    const buttons = state.children.outputs.render.buttons;
    ret.local.buttons = pickBy(buttons, button => button?.event === eventKey);
  }

  function assignAncestralStatesOutput() {
    const ancestors = findAncestors(scopes.scopes.edges, stateName);
    ancestors.forEach((a: CustomKey) => {
      if (a === reservedStateNameSchema.enum.start) return;
      const state = scopes.scopes.states[a];
      if (state == null) throw new Error(`${a} is in edges, but not in scopes`);
      ret.global[a] = {
        display_name: state.display_name,
        variables: state.children.outputs.variables,
      };
    });
  }

  function assignCurrentStateInput() {
    const state = scopes.scopes.states[stateName];
    if (state == null) throw new Error(`cannot find ${stateName} in scopes`);
    if (!isEmpty(state.children.inputs.variables)) {
      ret.local.inputs.variables = state.children.inputs.variables;
    }
  }

  function assignCurrentStateOutput() {
    const state = scopes.scopes.states[stateName];
    if (state == null) throw new Error(`cannot find ${stateName} in scopes`);
    ret.local.outputs.variables = state.children.outputs.variables;
  }

  function assignPreviousTasks() {
    const state = scopes.scopes.states[stateName];
    if (state == null) throw new Error(`cannot find ${stateName} in scopes`);
    const tasks = state.children.tasks;
    if (!isNumber(taskIndex))
      throw new Error(`cannot find ${taskIndex} in ${stateName} tasks`);

    if (taskIndex === 0) {
      // noops
    } else {
      const prevTasks = tasks.slice(0, taskIndex);
      ret.local.tasks = prevTasks;
    }
  }

  function assignAllTasks() {
    const state = scopes.scopes.states[stateName];
    if (state == null) throw new Error(`cannot find ${stateName} in scopes`);
    const tasks = state.children.tasks;
    ret.local.tasks = tasks;
  }
}

export function findDescendants(
  edges: Edges,
  stateName: CustomKey,
): CustomKey[] {
  const descendants: CustomKey[] = [];
  const visited = new Set<CustomKey>();

  function dfs(currentNode: string) {
    for (const edge of edges) {
      if (edge.source === currentNode && !visited.has(edge.target)) {
        visited.add(edge.target);
        descendants.push(edge.target);
        dfs(edge.target);
      }
    }
  }

  dfs(stateName);
  return descendants;
}

export function findAncestors(edges: Edges, stateName: CustomKey): CustomKey[] {
  const ancestors = new Set<string>();

  function findUpstream(currentState: string) {
    for (const edge of edges) {
      if (edge.target === currentState && !ancestors.has(edge.source)) {
        ancestors.add(edge.source);
        findUpstream(edge.source);
      }
    }
  }

  findUpstream(stateName);
  return Array.from(ancestors) as CustomKey[];
}

// export function renameNodedataKey(
//   refs: Refs,
//   params: z.infer<typeof renameNodedataKeyParamSchema>,
// ): Refs {
//   const { stateName, oldKey, newKey } = params;
//   return mapValues(refs, (value, key) => {
//     if (key === stateName) {
//       return mapKeys(value, (v, k) => {
//         return k === oldKey ? newKey : k;
//       });
//     } else {
//       return value;
//     }
//   });
// }

export function setNodedataKeyVal(
  refs: Refs,
  params: z.infer<typeof setNodedataKeyValParamSchema>,
): Refs {
  const { mode, origVal, stateName, key, newValue } = params;
  if (mode === 'ui' && origVal == null) {
    throw new Error('Should specify origValue in mode ui');
  }

  return mapValues(refs, (v1, k1) => {
    if (k1 === stateName) {
      return mapValues(v1, (v2, k2) => {
        if (k2 === key) {
          if (v2.ref) {
            v2.ref = newValue;
          }
          if (origVal != null && Array.isArray(v2.ui)) {
            v2.ui = v2.ui.map(i => (i === origVal ? newValue : i));
          }
        }
        if (mode === 'ref') {
          delete v2.ui;
          delete v2.raw;
        } else if (mode === 'ui') {
          delete v2.ref;
          delete v2.raw;
        }
        return v2;
      });
    } else {
      return v1;
    }
  });
}

export function changeNodedataKeyMode(
  refs: Refs,
  param: z.infer<typeof changNodedataModeParamSchema>,
): Refs {
  const { stateName, mode, key } = param;
  return mapValues(refs, (v1, k1) => {
    if (k1 === stateName) {
      return mapValues(v1, (v2, k2) => {
        if (k2 === key) {
          if (mode === 'raw') {
            delete v2.ref;
            delete v2.ui;
          }
          if (mode === 'ui') {
            delete v2.raw;
            delete v2.ref;
          }
          if (mode === 'ref') {
            delete v2.ui;
            delete v2.raw;
          }
        }
        return v2;
      });
    } else {
      return v1;
    }
  });
}

export function renameRefOpt(
  refs: Refs,
  param: z.infer<typeof renameRefOptParamSchema>,
): Refs {
  const { oldPath, newPath } = param;
  return mapValues(refs, (v, k) => {
    return mapValues(v, (v2, k2) => {
      if (v2.ref && v2.ref === oldPath) {
        v2.ref = newPath;
      }
      if (v2.raw != null && Array.isArray(v2.raw)) {
        v2.raw = v2.raw.map(i => (i === oldPath ? newPath : i));
      }
      if (v2.ui != null && Array.isArray(v2.ui)) {
        v2.ui = v2.ui.map(i => (i === oldPath ? newPath : i));
      }
      return v2;
    });
  });
}

export function renameStateName(
  refs: Refs,
  param: z.infer<typeof renameStateNameParamSchema>,
): Refs {
  const { oldName, newName } = param;
  return mapValues(refs, (v, k) => {
    return mapValues(v, (v2, k2) => {
      if (v2.ref && v2.ref.startsWith(oldName)) {
        v2.ref = [newName, v2.ref.split('.')[1]].join('.');
      }
      if (v2.raw != null && Array.isArray(v2.raw)) {
        v2.raw = v2.raw.map(i => {
          if (i.startsWith(oldName)) {
            return [newName, i.split('.')[1]].join('.');
          } else {
            return i;
          }
        });
      }
      if (v2.ui != null && Array.isArray(v2.ui)) {
        v2.ui = v2.ui.map(i => {
          if (i.startsWith(oldName)) {
            return [newName, i.split('.')[1]].join('.');
          } else {
            return i;
          }
        });
      }
      return v2;
    });
  });
}

export function removeRefOpts(
  refs: Refs,
  param: z.infer<typeof removeRefOptsSchema>,
) {
  const { paths } = param;
  return mapValues(refs, (v1, k1) => {
    let v = mapValues(v1, (v2, k2) => {
      if (v2.ref != null && paths.indexOf(v2.ref) > -1) {
        delete v2.ref;
      }
      if (Array.isArray(v2.ui)) {
        v2.ui = v2.ui
          .map(i => (paths.indexOf(i) > -1 ? null : i))
          .filter(i => i != null) as string[];
      }
      if (!v2.ui?.length) {
        delete v2.ui;
      }
      if (Array.isArray(v2.raw)) {
        v2.raw = v2.raw
          .map(i => (paths.indexOf(i) > -1 ? null : i))
          .filter(i => i != null) as string[];
      }
      if (!v2.raw?.length) {
        delete v2.raw;
      }
      return v2;
    });

    v = omitBy(v, isEmpty);
    return v;
  });
}

export function removeRefOptsPrefix(
  refs: Refs,
  param: z.infer<typeof removeRefOptsPrefixScheam>,
) {
  const { prefix } = param;
  return mapValues(refs, (v, k) => {
    let v2ret = mapValues(v, (v2, k2) => {
      if (v2.ref != null) {
        const v2Ref = v2.ref;
        if (prefix.some(p => v2Ref.startsWith(p))) {
          delete v2.ref;
        }
      }
      if (Array.isArray(v2.ui)) {
        v2.ui = v2.ui
          .map(i => (prefix.some(p => i.startsWith(p)) ? null : i))
          .filter((i): i is string => i !== null);
      }
      if (!v2.ui?.length) {
        delete v2.ui;
      }
      if (Array.isArray(v2.raw)) {
        v2.raw = v2.raw
          .map(i => (prefix.some(p => i.startsWith(p)) ? null : i))
          .filter((i): i is string => i !== null);
      }
      if (!v2.raw?.length) {
        delete v2.raw;
      }
      return v2;
    });
    v2ret = omitBy(v2ret, isEmpty);
    return v2ret;
  });
}

export function getBeforeAndAfterNodes(
  edges: Edges,
  toRemoveEdge: Edge,
): { before: CustomKey[]; after: CustomKey[] } {
  const before = findAncestors(edges, toRemoveEdge.source);
  const after = findDescendants(edges, toRemoveEdge.target);
  return {
    before: before.concat([toRemoveEdge.source]),
    after: after.concat([toRemoveEdge.target]),
  };
}

export function removeEdge(
  refs: Refs,
  param: z.infer<typeof removeEdgeScheam>,
) {
  const { edges, removeEdge } = param;
  const { before, after } = getBeforeAndAfterNodes(edges, removeEdge);

  const prefix = before;

  return mapValues(refs, (v, k) => {
    if (after.indexOf(k as CustomKey) === -1) {
      return v;
    }
    let v2ret = mapValues(v, (v2, k2) => {
      if (v2.ref != null) {
        const v2Ref = v2.ref;
        if (prefix.some(p => v2Ref.startsWith(p))) {
          delete v2.ref;
        }
      }
      if (Array.isArray(v2.ui)) {
        v2.ui = v2.ui
          .map(i => (prefix.some(p => i.startsWith(p)) ? null : i))
          .filter((i): i is string => i !== null);
      }
      if (!v2.ui?.length) {
        delete v2.ui;
      }
      if (Array.isArray(v2.raw)) {
        v2.raw = v2.raw
          .map(i => (prefix.some(p => i.startsWith(p)) ? null : i))
          .filter((i): i is string => i !== null);
      }
      if (!v2.raw?.length) {
        delete v2.raw;
      }
      return v2;
    });
    v2ret = omitBy(v2ret, isEmpty);
    return v2ret;
  });
}

export function duplicateState(
  refs: Refs,
  params: z.infer<typeof duplicateStateSchema>,
) {
  const { stateName, duplicateStateName } = params;
  if (refs[duplicateStateName]) {
    throw new Error(`${duplicateStateName} already exists`);
  }

  if (!isEmpty(refs[stateName])) {
    const ref = cloneDeep(refs[stateName]);
    refs[duplicateStateName] = mapValues(ref, (v, k) => {
      if (v.ref && v.ref.startsWith(stateName)) {
        v.ref = [duplicateStateName, v.ref.split('.')[1]].join('.');
      }

      if (v.raw != null && Array.isArray(v.raw)) {
        v.raw = v.raw.map(i => {
          if (i.startsWith(stateName)) {
            return [duplicateStateName, i.split('.')[1]].join('.');
          } else {
            return i;
          }
        });
      }
      if (v.ui != null && Array.isArray(v.ui)) {
        v.ui = v.ui.map(i => {
          if (i.startsWith(stateName)) {
            return [duplicateStateName, i.split('.')[1]].join('.');
          } else {
            return i;
          }
        });
      }

      return v;
    });
  }
  return refs;
}

export function hanldeRefScene(refs: Refs, evt: HandleRefSceneEvent) {
  switch (evt.scene) {
    case 'set_nodedata_key_val':
      return setNodedataKeyVal(refs, evt.params);

    case 'change_nodedata_mode':
      return changeNodedataKeyMode(refs, evt.params);

    case 'rename_ref_opt':
      return renameRefOpt(refs, evt.params);

    case 'rename_state_name':
      return renameStateName(refs, evt.params);

    case 'remove_ref_opts':
      return removeRefOpts(refs, evt.params);

    case 'remove_ref_opts_prefix':
      return removeRefOptsPrefix(refs, evt.params);

    case 'remove_edge':
      return removeEdge(refs, evt.params);

    case 'duplicate_state':
      return duplicateState(refs, evt.params);
    default:
      // @ts-expect-error
      throw new Error(`Not implemented, ${evt.scene}`);
  }
}