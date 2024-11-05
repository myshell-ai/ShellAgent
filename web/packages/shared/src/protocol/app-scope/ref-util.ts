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
  removeNodeKeySchema,
  removeRefOptsSchema,
  renameNodedataKeyParamSchema,
  renameRefOptParamSchema,
  renameStateNameParamSchema,
  renameStateOutputParamSchema,
  setNodedataKeyValParamSchema,
} from './scope';
import {
  isEmpty,
  isNumber,
  mapKeys,
  mapValues,
  omit,
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

    const buttons = state.children.outputs.render.buttons;
    if (eventKey) {
      ret.local.buttons = pickBy(buttons, button => button?.event === eventKey);
    }
  }

  function assignAncestralStatesOutput() {
    const ancestors = findAncestors(scopes.scopes.edges, stateName);
    ancestors.forEach((a: CustomKey) => {
      if (a === '@@@start') return;
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

export function renameNodedataKey(
  refs: Refs,
  params: z.infer<typeof renameNodedataKeyParamSchema>,
): Refs {
  const { stateName, oldKey, newKey } = params;
  return mapValues(refs, (value, key) => {
    if (key === stateName) {
      return mapKeys(value, (v, k) => {
        return k === oldKey ? newKey : k;
      });
    } else {
      return value;
    }
  });
}

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

export function deleteRefer(refs: Refs, stateName: string, refer: string) {
  return mapValues(refs, (v1, k1) => {
    if (k1 === stateName) {
      return mapValues(v1, (v2, k2) => {
        if (v2.ref === refer) {
          delete v2.ref;
        }
        if (Array.isArray(v2.ui)) {
          v2.ui = v2.ui
            .map(i => (i === refer ? null : i))
            .filter(i => i != null) as string[];
        }
        if (!v2.ui?.length) {
          delete v2.ui;
        }
        if (Array.isArray(v2.raw)) {
          v2.raw = v2.raw
            .map(i => (i === refer ? null : i))
            .filter(i => i != null) as string[];
        }
        if (!v2.raw?.length) {
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

export function renameStateOutput(
  refs: Refs,
  param: z.infer<typeof renameStateOutputParamSchema>,
): Refs {
  const { stateName, oldOutputName, newOutputName } = param;
  return renameRefOpt(refs, {
    oldPath: [stateName, oldOutputName].join('.'),
    newPath: [stateName, newOutputName].join('.'),
  });
}

export function removeNodeKey(
  refs: Refs,
  param: z.infer<typeof removeNodeKeySchema>,
) {
  const { stateName, key } = param;
  return mapValues(refs, (v, k) => {
    if (k === stateName) {
      return omit(v, key);
    } else {
      return v;
    }
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

export function removeButton(
  refs: Refs,
  param: z.infer<typeof removeRefOptsPrefixScheam>,
) {
  const { prefix } = param;
  return mapValues(refs, (v, k) => {
    let v2ret = mapValues(v, (v2, k2) => {
      if (v2.ref && v2.ref.startsWith(prefix)) {
        delete v2.ref;
      }
      if (Array.isArray(v2.ui)) {
        v2.ui = v2.ui
          .map(i => (i.startsWith(prefix) ? null : i))
          .filter(i => i != null) as string[];
      }
      if (!v2.ui?.length) {
        delete v2.ui;
      }
      if (Array.isArray(v2.raw)) {
        v2.raw = v2.raw
          .map(i => (i.startsWith(prefix) ? null : i))
          .filter(i => i != null) as string[];
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

export function hanldeRefScene(refs: Refs, evt: HandleRefSceneEvent) {}
