import { IEdge, INode } from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { CustomKey } from '@shellagent/pro-config';
import {
  State,
  Edges,
  RefType,
  getRefOptions,
  Scopes,
} from '@shellagent/shared/protocol/app-scope';
import { injectable } from 'inversify';
import { makeObservable, observable } from 'mobx';

import { getRefNodes } from '@/stores/app/utils/data-transformer';
import {
  getContext,
  getInput,
  getOutput,
  getPayloads,
  getTasks,
  VariableProps,
} from '@/stores/app/variable-provider';

import {
  CascaderOption,
  convertRefOptsToCascaderOpts,
  convetNodeDataToScopes,
} from './app-builder-utils';

@injectable()
export class AppBuilderModel {
  @observable variables: VariableProps | null = null;

  constructor() {
    makeObservable(this);
  }

  @observable scopes: Scopes | null = null;

  getRefOptions(
    stateName: CustomKey,
    refType: RefType,
    taskName?: string,
  ): CascaderOption[] {
    if (this.scopes == null) {
      return [];
    }
    const refOpts = getRefOptions(this.scopes, stateName, refType, taskName);
    const cascaderOpts = convertRefOptsToCascaderOpts(refOpts);
    return cascaderOpts;
  }

  updateScopes(nodeData: any, edges: any = []) {
    this.scopes = convetNodeDataToScopes(nodeData, edges);
  }

  onRefUpdate() {}

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
