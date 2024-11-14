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

// 在类外部定义工具函数
function processNestedObject(
  obj: any,
  processor: (value: any, key: string, parent: any) => void,
) {
  if (!obj || typeof obj !== 'object') return;

  Object.entries(obj).forEach(([key, value]) => {
    processor(value, key, obj);
    if (typeof value === 'object') {
      processNestedObject(value, processor);
    }
  });
}

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

  initNodeData(nodeData: any) {
    this.nodeData = nodeData;
  }

  hanldeRefScene(evt: HandleRefSceneEvent) {
    this.updateNodeData(evt, this.nodeData);
    this.refs = hanldeRefScene(this.refs, evt);

    console.log('this.refs>>', this.refs, evt);
  }

  updateNodeData(evt: HandleRefSceneEvent, nodeData: any) {
    if (evt.scene === RefSceneEnum.Enum.remove_ref_opts) {
      evt.params.paths.forEach(path => {
        const [stateId, varName] = path.split('.');
        const stateNode = nodeData[stateId];
        if (!stateNode) return;

        processNestedObject(stateNode, (value, key, parent) => {
          if (typeof value === 'string') {
            const refRegex = new RegExp(`{{\\s*${varName}\\s*}}`, 'g');
            if (refRegex.test(value)) {
              parent[key] = '';
            }
          }
        });
      });
    } else if (evt.scene === RefSceneEnum.Enum.rename_ref_opt) {
      const { oldPath, newPath } = evt.params;
      const [stateId, oldVarName] = oldPath.split('.');
      const [_, newVarName] = newPath.split('.');

      const stateNode = nodeData[stateId];
      if (!stateNode) return;

      processNestedObject(stateNode, (value, key, parent) => {
        if (typeof value === 'string') {
          const oldRefRegex = new RegExp(`{{\\s*${oldVarName}\\s*}}`, 'g');
          if (oldRefRegex.test(value)) {
            parent[key] = value.replace(oldRefRegex, `{{ ${newVarName} }}`);
          }
        }
      });
    }
  }
}
