import { CustomKey, CustomEventName } from '@shellagent/pro-config';
import {
  RefType,
  getRefOptions,
  Scopes,
  HandleRefSceneEvent,
  hanldeRefScene,
  Refs,
} from '@shellagent/shared/protocol/app-scope';
import { injectable } from 'inversify';

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
    eventKey?: CustomEventName,
  ): CascaderOption[] {
    if (this.scopes == null) {
      return [];
    }
    const refOpts = getRefOptions(
      this.scopes,
      stateName,
      refType,
      taskIndex,
      eventKey,
    );

    const cascaderOpts = convertRefOptsToCascaderOpts(refOpts);
    return cascaderOpts;
  }

  updateScopes(nodeData: any, edges: any = []) {
    this.scopes = convetNodeDataToScopes(nodeData, edges);
  }

  initRefs(refs: Refs) {
    this.refs = refs;
  }

  hanldeRefScene(evt: HandleRefSceneEvent) {
    this.refs = hanldeRefScene(this.refs, evt);
    console.log('this.refs>>', this.refs, evt);
  }
}
