import { CustomKey } from '@shellagent/pro-config';
import { Buttons, Scopes, Task, Variables } from './protocol';
import {
  Edges,
  RefOptionsOutput,
  RefType,
  Refs,
  refOptionsOutputSchema,
} from './scope';
import { isEmpty, mapKeys, mapValues, isNumber } from 'lodash-es';

export function getRefOptions(
  scopes: Scopes,
  // edges: Edges,
  stateName: CustomKey,
  refType: RefType,
  taskIndex?: number,
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

    ret.local.buttons = state.children.outputs.render.buttons;
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

export function convertRefsToAncestors(refOpts: RefOptionsOutput) {
  // todo: Ensure that ⁠value is a fully qualified name, matching the ⁠protocol’s path.
}

export function renameRefKey(
  refs: Refs,
  oldKey: string,
  newKey: string,
): Record<string, string> {
  return mapKeys(refs, (value, key) => {
    return key === oldKey ? newKey : key;
  });
}

export function updateRefValue(
  refs: Refs,
  key: string,
  newValue: string,
): Record<string, string> {
  refs[key] = newValue;
  return refs;
}

export function renameRefer(
  refs: Refs,
  origRefer: string,
  newRefer: string,
): Record<string, string> {
  return mapValues(refs, value => {
    return value === origRefer ? newRefer : value;
  });
}

export function deleteRefer(refs: Refs, refer: string) {
  Object.keys(refs).forEach(k => {
    if (refs[k] === refer) delete refs[k];
  });
}