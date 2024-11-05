import { IEdge, INode } from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { CustomKey } from '@shellagent/pro-config';
import {
  State,
  Edges,
  RefType,
  getRefOptions,
  Scopes,
  renameRefKey,
  updateRefValue,
  renameRefer,
  deleteRefer,
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

  refs: Record<string, string> = {};

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

  /*
  addRef('state_2.ouput.untitled', 'state_1.untitled_1')
  */
  addRef(nodeDataKeyPath: string, refOptValuePath: string) {
    this.refs[nodeDataKeyPath] = refOptValuePath;
  }

  deleteRef(nodeDataKeyPath: string, refOptValuePath: string) {
    delete this.refs[nodeDataKeyPath];
  }

  renameNodeDataKey(oldKey: string, newKey: string) {
    this.refs = renameRefKey(this.refs, oldKey, newKey);
  }

  updateNodeDataValue(nodeDataKey: string, newValue: string) {
    this.refs = updateRefValue(this.refs, nodeDataKey, newValue);
  }

  renameRefOptValue(origRefOptVal: string, newRefOptVal: string) {
    this.refs = renameRefer(this.refs, origRefOptVal, newRefOptVal);
  }

  deleteRefOptValue(refOptVal: string) {
    deleteRefer(this.refs, refOptVal);
  }
}
