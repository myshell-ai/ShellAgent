import { CustomKey, CustomEventName } from '@shellagent/pro-config';
import {
  RefType,
  getRefOptions,
  Scopes,
  HandleRefSceneEvent,
  hanldeRefScene,
  Refs,
} from '@shellagent/shared/protocol/app-scope';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { injectable } from 'inversify';
import { set } from 'lodash-es';

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

  nodeDataMode: Map<string, string> = new Map();

  scopes: Scopes | null = null;

  refs: Refs = {};

  nodeData: any = {};

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
    // todo nodeData迁移至mobx
    if (evt.scene === RefSceneEnum.Enum.remove_ref_opts) {
      evt.params.paths.forEach(path => {
        Object.keys(this.refs).forEach(stateKey => {
          const stateRefs = this.refs[stateKey as Lowercase<string>];
          Object.keys(stateRefs || {}).forEach(refPath => {
            // if (stateRefs[refPath]?.currentMode === 'ref') {
            // TODO 暂只支持ref
            this.nodeData = set(
              this.nodeData,
              `${stateKey}.${refPath}`,
              undefined,
            );
            // }
          });
        });
        this.nodeData = set(this.nodeData, path, undefined);
      });
    } else if (evt.scene === RefSceneEnum.Enum.rename_ref_opt) {
      const { oldPath, newPath } = evt.params;
      Object.keys(this.refs).forEach(stateKey => {
        const stateRefs = this.refs[stateKey as Lowercase<string>];
        Object.keys(stateRefs || {}).forEach(refPath => {
          if (stateRefs?.[refPath]?.ref === oldPath) {
            // TODO 暂只支持ref
            this.nodeData = set(
              this.nodeData,
              `${stateKey}.${refPath}`,
              `{{ ${newPath} }}`,
            );
          }
        });
      });
    } else if (evt.scene === RefSceneEnum.enum.change_nodedata_mode) {
      const { key, mode } = evt.params;
      this.nodeDataMode.set(key, mode);
    } else if (evt.scene === RefSceneEnum.enum.remove_ref_opts_prefix) {
      const { prefix } = evt.params;
      Object.keys(this.refs).forEach(stateKey => {
        const stateRefs = this.refs[stateKey as Lowercase<string>];
        Object.keys(stateRefs || {}).forEach(refPath => {
          // 检查是否以任意前缀开头
          const hasMatchingPrefix = prefix.some(p =>
            stateRefs?.[refPath]?.ref?.startsWith(p),
          );
          if (hasMatchingPrefix) {
            // 移除带有指定前缀的引用
            this.nodeData = set(
              this.nodeData,
              `${stateKey}.${refPath}`,
              undefined,
            );
          }
        });
      });
    } else if (evt.scene === RefSceneEnum.enum.remove_state) {
      const { stateName } = evt.params;
      this.nodeData = set(this.nodeData, stateName, undefined);
    }

    this.refs = hanldeRefScene(this.refs, evt);

    console.log('this.refs>>', this.refs, evt);
    console.log('this.nodeData', this.nodeData);
  }
}
