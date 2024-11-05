import { IEdge, INode } from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { CustomKey } from '@shellagent/pro-config';
import {
  RefType,
  getRefOptions,
  Scopes,
  HandleRefSceneEvent,
  hanldeRefScene,
  Refs,
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
  constructor() {
    // makeObservable(this);
  }

  scopes: Scopes | null = null;

  refs: Refs = {};

  getRefOptions(
    stateName: CustomKey,
    refType: RefType,
    taskIndex?: number,
  ): CascaderOption[] {
    if (this.scopes == null) {
      return [];
    }
    const refOpts = getRefOptions(this.scopes, stateName, refType, taskIndex);

    const cascaderOpts = convertRefOptsToCascaderOpts(refOpts);
    return cascaderOpts;
  }

  updateScopes(nodeData: any, edges: any = []) {
    this.scopes = convetNodeDataToScopes(nodeData, edges);
  }

  hanldeRefScene(evt: HandleRefSceneEvent) {
    hanldeRefScene(this.refs, evt);
  }
}
