import { CustomEventName, CustomKey } from '@shellagent/pro-config';
import { Scopes } from './protocol';
import {
  changNodedataModeParamSchema,
  duplicateStateSchema,
  Edge,
  Edges,
  HandleRefSceneEvent,
  RefOptionsOutput,
  refOptionsOutputSchema,
  Refs,
  refsSchema,
  RefType,
  removeEdgeScheam,
  removeRefOptsPrefixScheam,
  removeRefOptsSchema,
  removeStateParamSchema,
  renameKeyParamSchema,
  renameRefOptParamSchema,
  renameStateNameParamSchema,
  reorderTaskSchema,
  setNodedataKeyValParamSchema,
} from './scope';
import { reservedStateNameSchema } from '../node';
import {
  cloneDeep,
  find,
  isArray,
  isEmpty,
  isNumber,
  isObject,
  mapKeys,
  mapValues,
  omitBy,
  pickBy,
  set,
  transform,
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
      // assignAncestralStatesOutput();
      assignOtherStatesOutput();
      break;
    }
    case 'state_task': {
      // assignAncestralStatesOutput();
      assignOtherStatesOutput();
      assignCurrentStateInput();
      assignPreviousTasks();
      break;
    }
    case 'state_output': {
      // assignAncestralStatesOutput();
      assignOtherStatesOutput();
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
    case 'state_output_key':
    // noops
    default: {
      // noops
    }
  }

  try {
    return refOptionsOutputSchema.parse(ret);
  } catch (error) {
    console.warn('RefOptionsOutputSchema Zod Validate Error', error);
    return ret;
  }

  function assignStateRender() {
    // assignAncestralStatesOutput();
    assignOtherStatesOutput();
    assignCurrentStateInput();
    assignAllTasks();
    assignCurrentStateOutput();
  }

  function assignButtonsPayload() {
    const state = scopes.scopes.states[stateName];
    if (state == null) throw new Error(`cannot find ${stateName} in scopes`);
    if (refType === 'target_input' && eventKey == null) {
      return;
    }

    const buttons = state.children.outputs.render.buttons;
    ret.local.buttons = pickBy(buttons, button => button?.event === eventKey);
  }

  /**
   * @deprecated Product update. use assignOtherStatesOutput
   */
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

  function assignOtherStatesOutput() {
    Object.keys(scopes.scopes.states).forEach((a: string) => {
      if (a === stateName) return;
      if (a === reservedStateNameSchema.enum.start) return;
      const state = scopes.scopes.states[a as CustomKey];
      if (state == null) throw new Error(`${a} is null, should not happen`);
      ret.global[a as CustomKey] = {
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

export function setNodedataKeyVal(
  refs: Refs,
  param: z.infer<typeof setNodedataKeyValParamSchema>,
): Refs {
  const { stateName, key, newValue, mode } = param;
  const newRefs = { ...refs };

  if (!newRefs[stateName]) {
    newRefs[stateName] = {} as Record<
      string,
      {
        currentMode: 'ref' | 'ui' | 'raw';
        ref?: string;
        ui?: string[];
        raw?: string[];
      }
    >;
  }

  if (mode === 'ref') {
    newRefs[stateName]![key] = {
      currentMode: 'ref',
      ref: newValue as string,
    };
  } else if (mode === 'ui') {
    newRefs[stateName]![key] = {
      currentMode: 'ui',
      ui: newValue as string[],
    };
  } else if (mode === 'raw') {
    newRefs[stateName]![key] = {
      currentMode: 'raw',
      raw: newValue as string[],
    };
  }

  return refsSchema.parse(newRefs);
}

export function changeNodedataKeyMode(
  refs: Refs,
  param: z.infer<typeof changNodedataModeParamSchema>,
): Refs {
  const { stateName, mode, key } = param;
  if (key == undefined)
    throw new Error(`key should not be empty: ${stateName}, ${mode}`);

  set(refs, [stateName, key], {
    ...(refs?.[stateName]?.[key] || {}),
    currentMode: mode,
  });

  const ret = mapValues(refs, (v1, k1) => {
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
          v2.currentMode = mode;
        }
        return v2;
      });
    } else {
      return v1;
    }
  });

  return refsSchema.parse(removeEmptyLeaves(ret));
}

export function renameRefOpt(
  refs: Refs,
  param: z.infer<typeof renameRefOptParamSchema>,
): Refs {
  const { oldPath, newPath, stateName, byPrefix } = param;
  const refs2 = refsSchema.parse(
    removeEmptyLeaves(
      mapValues(refs, (v, k) => {
        return mapValues(v, (v2, k2) => {
          if (byPrefix) {
            if (v2.ref && v2.ref.startsWith(oldPath)) {
              v2.ref = newPath + v2.ref.replace(oldPath, '');
            }
            if (v2.raw != null && Array.isArray(v2.raw)) {
              v2.raw = v2.raw.map(i => {
                return i.startsWith(oldPath)
                  ? newPath + i.replace(oldPath, '')
                  : i;
              });
            }
            if (v2.ui != null && Array.isArray(v2.ui)) {
              v2.ui = v2.ui.map(i => {
                return i.startsWith(oldPath)
                  ? newPath + i.replace(oldPath, '')
                  : i;
              });
            }
          } else {
            if (v2.ref && v2.ref === oldPath) {
              v2.ref = newPath;
            }
            if (v2.raw != null && Array.isArray(v2.raw)) {
              v2.raw = v2.raw.map(i => (i === oldPath ? newPath : i));
            }
            if (v2.ui != null && Array.isArray(v2.ui)) {
              v2.ui = v2.ui.map(i => (i === oldPath ? newPath : i));
            }
          }
          return v2;
        });
      }),
    ),
  );
  if (stateName) {
    return renameKeyPrefix(refs2, {
      stateName,
      oldKey: oldPath.replace(`${stateName}.`, ''),
      newKey: newPath.replace(`${stateName}.`, ''),
    });
  }

  return refs2;
}

export function renameStateName(
  refs: Refs,
  param: z.infer<typeof renameStateNameParamSchema>,
): Refs {
  const { oldName, newName } = param;
  return refsSchema.parse(
    removeEmptyLeaves(
      mapValues(refs, (v, k) => {
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
      }),
    ),
  );
}

export function removeRefOpts(
  refs: Refs,
  param: z.infer<typeof removeRefOptsSchema>,
) {
  const { paths, stateName } = param;
  const refs2 = refsSchema.parse(
    removeEmptyLeaves(
      mapValues(refs, (v1, k1) => {
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
      }),
    ),
  );
  if (stateName) {
    return refsSchema.parse(
      removeEmptyLeaves(
        mapValues(refs2, (v1, k1) => {
          if (k1 === stateName && v1) {
            Object.keys(v1).forEach(k2 => {
              if (
                paths.some(p => k2.startsWith(p.replace(`${stateName}.`, '')))
              ) {
                delete v1[k2];
              }
            });
            return v1;
          } else {
            return v1;
          }
        }),
      ),
    );
  }
  return refs2;
}

export function removeRefOptsPrefix(
  refs: Refs,
  param: z.infer<typeof removeRefOptsPrefixScheam>,
) {
  const { prefix, stateName } = param;
  const refs2 = refsSchema.parse(
    removeEmptyLeaves(
      mapValues(refs, (v, k) => {
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
      }),
    ),
  );

  if (stateName) {
    return refsSchema.parse(
      removeEmptyLeaves(
        mapValues(refs2, (v1, k1) => {
          if (k1 === stateName && v1) {
            Object.keys(v1).forEach(k2 => {
              if (
                prefix.some(p => k2.startsWith(p.replace(`${stateName}.`, '')))
              ) {
                delete v1[k2];
              }
            });
            return v1;
          } else {
            return v1;
          }
        }),
      ),
    );
  }

  return refs2;
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

/**
 * @deprecated remove edge affect nothing
 * keep function, but nowhere ref
 * @param refs
 * @param param
 * @returns
 */
export function removeEdge(
  refs: Refs,
  param: z.infer<typeof removeEdgeScheam>,
) {
  const { edges, removeEdge } = param;
  const { before, after } = getBeforeAndAfterNodes(edges, removeEdge);

  const prefix = before;

  return refsSchema.parse(
    removeEmptyLeaves(
      mapValues(refs, (v, k) => {
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
      }),
    ),
  );
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
  return refsSchema.parse(removeEmptyLeaves(refs));
}

export function removeState(
  refs: Refs,
  params: z.infer<typeof removeStateParamSchema>,
) {
  // TODO 补充测试用例
  delete refs[params.stateName];
  refs = removeRefOptsPrefix(refs, {
    prefix: [params.stateName],
  });
  return refsSchema.parse(removeEmptyLeaves(refs));
}

export function handleRefScene(refs: Refs, evt: HandleRefSceneEvent) {
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
      // PRODUCT UPDATE: remove edge affect nothing
      return refs;
    // return removeEdge(refs, evt.params);

    case 'duplicate_state':
      return duplicateState(refs, evt.params);
    case 'remove_state':
      return removeState(refs, evt.params);
    case 'reorder_task':
      return reorderTasks(refs, evt.params);
    default:
      // @ts-expect-error
      throw new Error(`Not implemented, ${evt.scene}`);
  }
}

export function removeEmptyLeaves(obj: Record<string, unknown>) {
  return transform(
    obj,
    (result: Record<string, unknown>, value, key) => {
      if (isObject(value) && !isArray(value)) {
        const cleanedValue = removeEmptyLeaves(
          value as Record<string, unknown>,
        );
        if (!isEmpty(cleanedValue)) {
          result[key] = cleanedValue;
        }
      } else if (!isEmpty(value)) {
        result[key] = value;
      }
    },
    {},
  );
}

export function findMissingPrevious(orig: string[], cur: string[]) {
  const missingItems = cur.map(item => {
    const origIndex = orig.indexOf(item);
    const curIndex = cur.indexOf(item);
    const missing = orig
      .slice(0, origIndex)
      .filter(i => cur.slice(0, curIndex).indexOf(i) === -1);
    return { item, missing };
  });
  return missingItems;
}

export function reorderTasks(
  refs: Refs,
  params: z.infer<typeof reorderTaskSchema>,
) {
  const prefix = 'blocks';
  const { stateName, currentTasks, previousTasks } = params;
  const missingItems = findMissingPrevious(previousTasks, currentTasks);
  const ret = mapValues(refs, (v1, k1) => {
    if (k1 === stateName) {
      return mapValues(v1, (v2, k2) => {
        const s = find(missingItems, a => {
          return k2.startsWith(`${prefix}.${a.item}`) && a.missing.length > 0;
        });
        if (s) {
          s.missing.forEach(m => {
            const p = `${stateName}.${prefix}.${m}`;
            if (typeof v2.ref === 'string' && v2.ref.startsWith(p)) {
              delete v2.ref;
            }
            if (Array.isArray(v2.ui)) {
              v2.ui = v2.ui
                .map(i => {
                  if (i.startsWith(p)) {
                    return undefined;
                  }
                  return i;
                })
                .filter((i): i is string => i !== undefined);
            }

            if (Array.isArray(v2.raw)) {
              v2.raw = v2.raw
                .map(i => {
                  if (i.startsWith(p)) {
                    return undefined;
                  }
                  return i;
                })
                .filter((i): i is string => i !== undefined);
            }
          });
        }
        return v2;
      });
    } else {
      return v1;
    }
  });
  return ret;
}

export function renameKeyPrefix(
  refs: Refs,
  params: z.infer<typeof renameKeyParamSchema>,
) {
  const { stateName, newKey, oldKey } = params;
  const refs2 = refsSchema.parse(
    removeEmptyLeaves(
      mapValues(refs, (v1, k1) => {
        if (k1 === stateName) {
          return mapKeys(v1, (v2, k2) => {
            if (k2.startsWith(oldKey)) {
              return `${newKey}${k2.replace(oldKey, '')}`;
            }
            return k2;
          });
        } else {
          return v1;
        }
      }),
    ),
  );
  return refs2;
}
