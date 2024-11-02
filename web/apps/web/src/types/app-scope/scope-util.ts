import { CustomKey } from '@shellagent/pro-config';
import { Buttons, Scopes, Task, Variables } from './protocol';
import { Edges, RefType } from './scope';
import { isEmpty } from 'lodash-es';

export function getRefOptions(
  scopes: Scopes,
  edges: Edges,
  stateName: CustomKey,
  refType: RefType,
  taskName?: string,
) {
  const ret: {
    global: Record<CustomKey, Variables>;
    local: {
      inputs: { variables: Variables };
      tasks: Task[];
      outputs: { variables: Variables };
      buttons: Buttons;
    };
  } = {
    global: {
      context: scopes.scopes.context.variables,
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
    case 'state_output_key': {
      // noops global context already assigned on top function
      break;
    }
    case 'state_render':
    case 'button_payload':
    case 'button_payload_key':
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

  return ret;

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
    const ancestors = findAncestors(edges, stateName);
    ancestors.forEach((a: CustomKey) => {
      const state = scopes.scopes.states[a];
      if (state == null) throw new Error(`${a} is in edges, but not in scopes`);
      ret.global[a] = state.children.outputs.variables;
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
    if (taskName == null)
      throw new Error(`should specify task name if ref type is ${refType}`);
    const tasks = state.children.tasks;
    const taskIdx = tasks.findIndex(t => t.name === taskName);
    if (taskIdx === -1)
      throw new Error(`cannot find ${taskName} in ${stateName} tasks`);

    if (taskIdx === 0) {
      // noops
    } else {
      const prevTasks = tasks.slice(0, taskIdx);
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
