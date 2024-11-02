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
import { Scopes, State } from '@/types/app-scope/protocol';
import { Edges, RefType } from '@/types/app-scope/scope';

@injectable()
export class AppBuilderModel {
  @observable variables: VariableProps | null = null;

  constructor() {
    makeObservable(this);
  }

  @observable scopes: Scopes | null = null;

  refs: Record<string, string> = {
    'state#1.outputs.outputs1-1': 'context.global_111',
    'state#1.outputs.outputs21': 'context.global_111',
    'state#2.message.text': 'state#1.outputs.output1',
  };

  // context.global_aa -> context.global_111
  onRefUpdate() {
    const origName = 'context.desc';
    const name = 'context.a';
    Object.keys(this.refs).forEach(k => {
      if (this.refs[k] === origName) {
        this.refs[k] = name;
      }
    });
  }

  updateNodeData(origName: string, name: string) {}

  setState(name: string, state: State) {}

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
