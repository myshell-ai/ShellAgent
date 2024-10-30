import { injectable } from 'inversify';
import { makeObservable, observable } from 'mobx';
import {
  getContext,
  getInput,
  getOutput,
  getPayloads,
  getTasks,
  VariableProps,
} from '@/stores/app/variable-provider';
import { IEdge, INode } from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { getRefNodes } from '@/stores/app/utils/data-transformer';
import { State } from '@/types/app-scope/protocol';

@injectable()
export class AppBuilderModel {
  @observable variables: VariableProps | null = null;

  constructor() {
    makeObservable(this);
  }

  setVariables(
    id: string,
    eventKey: string | undefined,
    deps: {
      edges: IEdge;
      nodes: INode;
      nodeData: Record<string, TValues>;
    },
  ) {
    const input = getInput(deps.nodeData, id);
    const output = getOutput(deps.nodeData, id);
    const tasks = getTasks(deps.nodeData, id);
    const context = getContext(deps.nodeData);

    const states = getRefNodes({
      edges: deps.edges,
      id,
      nodes: deps.nodes,
      nodeData: deps.nodeData,
    });
    const payloads = getPayloads(deps.nodeData, id, eventKey);
    this.variables = {
      input,
      output,
      context,
      states,
      tasks,
      payloads,
    };
  }
}

function copyState(state: State) {}
