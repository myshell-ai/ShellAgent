import { CustomKey, CustomEventName } from '@shellagent/pro-config';
import type { FieldValues } from '@shellagent/ui';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import {
  RefType,
  getRefOptions,
  Scopes,
  HandleRefSceneEvent,
  hanldeRefScene,
  Refs,
} from '@shellagent/shared/protocol/app-scope';
import { injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import type { IFlow, ReactFlowInstance } from '@shellagent/flow-engine';
import { Automata } from '@shellagent/pro-config';
import { defaultFlow } from './constants';
import type { Metadata } from '@/services/home/type';
import { genNodeData } from '@/stores/app/utils/data-transformer';
import {
  CascaderOption,
  convertRefOptsToCascaderOpts,
  convetNodeDataToScopes,
} from './app-builder-utils';
import type { TValues, TFieldMode } from '@shellagent/form-engine';
import { fetchAutomata, fetchFlow } from '@/services/app';
import { fetchList as fetchFlowList } from '@/services/home';
import type { GetListRequest, GetListResponse } from '@/services/home/type';
import type { GetAppFlowRequest } from '@/services/app/type';

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

type Config = {
  fieldsModeMap: Record<string, Record<string, TFieldMode>>;
  refs: Refs;
};
@injectable()
export class AppBuilderModel {
  nodeData: Record<string, FieldValues> = {};
  metadata: Metadata = {
    name: '',
    description: '',
  };
  flowInstance: ReactFlowInstance | null = null;

  nodeDataMode: Map<string, string> = new Map();

  scopes: Scopes | null = null;

  refs: Refs = {};

  config: Config = {
    fieldsModeMap: {},
    refs: {},
  };

  userInputs: TValues = {};
  flowList: GetListResponse['data'] = [];

  @observable loading = {
    // getReactFlow: false,
    // getAutomata: false,
    // chatRunning: false,
    // fetchFlowList: false,
  };

  @observable getReactFlowLoading = false;
  @observable getAutomataLoading = false;
  @observable chatRunningLoading = false;
  @observable fetchFlowListLoading = false;

  transitions: Record<
    string,
    Record<
      'ALWAYS' | 'CHAT' | string,
      {
        target?: string;
        condition?: string;
      }[]
    >
  > = {};
  resetData: Record<string, string | undefined> = {};

  constructor() {
    makeObservable(this);
  }

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
    const newRefs = hanldeRefScene(this.refs, evt);
    this.updateNodeData(evt, this.nodeData, this.refs, newRefs);
    this.refs = newRefs;

    console.log('this.refs>>', this.refs, evt);
    console.log('this.nodeData', this.nodeData);
  }

  @action.bound
  setNodeData({ id, data }: { id: string; data: FieldValues }) {
    this.nodeData[id] = data;
  }

  @action.bound
  deleteNodeData(id: string) {
    delete this.nodeData[id];
  }

  @action.bound
  setFlowInstance(instance: ReactFlowInstance) {
    this.flowInstance = instance;
  }

  @action.bound
  initAppBuilder({
    reactflow,
    config,
    metadata,
    automata,
  }: {
    reactflow: IFlow;
    config: any;
    metadata: any;
    automata: Automata;
  }) {
    if (this.flowInstance) {
      this.flowInstance.setNodes(
        reactflow?.nodes.length ? reactflow.nodes : defaultFlow.nodes,
      );
      this.flowInstance.setEdges(
        reactflow?.edges.length ? reactflow.edges : defaultFlow.edges,
      );
      this.flowInstance.setViewport(
        reactflow?.viewport || defaultFlow.viewport,
      );
    }

    runInAction(() => {
      this.initRefs(config?.refs || {});
      this.metadata = metadata;
      this.nodeData = genNodeData(automata);
    });
  }

  @action.bound
  setFieldsModeMap({
    id,
    name,
    mode,
  }: {
    id: string;
    name: string;
    mode: TFieldMode;
  }) {
    if (!this.config.fieldsModeMap[id]) {
      this.config.fieldsModeMap[id] = {};
    }
    this.config.fieldsModeMap[id][name] = mode;
  }

  @action.bound
  async getFlowList(params: GetListRequest) {
    try {
      this.fetchFlowListLoading = true;
      const { data } = await fetchFlowList(params);
      runInAction(() => {
        this.flowList = data;
      });
    } finally {
      runInAction(() => {
        this.fetchFlowListLoading = false;
      });
    }
  }

  @action.bound
  async getAutomata(params: any) {
    try {
      this.getAutomataLoading = true;
      const { data } = await fetchAutomata(params);
      runInAction(() => {
        this.nodeData = genNodeData(data);
      });
    } finally {
      runInAction(() => {
        this.getAutomataLoading = false;
      });
    }
  }

  @action.bound
  async getReactFlow(params: GetAppFlowRequest, instance: ReactFlowInstance) {
    try {
      runInAction(() => {
        this.getReactFlowLoading = true;
      });

      const { reactflow, config, metadata } = await fetchFlow(params);

      if (instance) {
        instance.setNodes(
          reactflow?.nodes.length ? reactflow.nodes : defaultFlow.nodes,
        );
        instance.setEdges(
          reactflow?.edges.length ? reactflow.edges : defaultFlow.edges,
        );
        instance.setViewport(reactflow?.viewport || defaultFlow.viewport);
      }

      runInAction(() => {
        this.config = (config as Config) || {
          fieldsModeMap: {},
          refs: {},
        };
        this.metadata = metadata;
      });
    } finally {
      runInAction(() => {
        this.getReactFlowLoading = false;
      });
    }
  }

  @action.bound
  updateMetadata({ metadata }: { metadata: Partial<Metadata> }) {
    this.metadata = {
      ...this.metadata,
      ...metadata,
    };
  }

  updateNodeData(
    evt: HandleRefSceneEvent,
    nodeData: Record<string, FieldValues>,
    refs: Refs,
    newRefs: Refs,
  ) {
    // 计算refs和newRefs的差值

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
    } else if (evt.scene === RefSceneEnum.Enum.remove_ref_opts_prefix) {
      evt.params.prefix.forEach(prefix => {
        const [stateId, varName] = prefix.split('.');
        const stateNode = nodeData[stateId];
        if (!stateNode) return;

        processNestedObject(stateNode, (value, key, parent) => {
          if (typeof value === 'string') {
            const refRegex = new RegExp(`{{\\s*${varName}[\\w.]*\\s*}}`, 'g');
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
    } else if (evt.scene === RefSceneEnum.Enum.remove_state) {
      const { stateName } = evt.params;

      // 遍历所有节点
      Object.entries(nodeData).forEach(([nodeId, node]: [string, any]) => {
        // 跳过被删除的节点和非state类型节点
        if (nodeId === stateName || node.type !== 'state') return;

        // 处理节点中的所有字符串值
        processNestedObject(node, (value, key, parent) => {
          if (typeof value === 'string') {
            // 匹配形如 {{ state_1.xxx }} 的引用
            const refRegex = new RegExp(
              `{{\\s*${stateName}\\.[\\w.]*\\s*}}`,
              'g',
            );
            if (refRegex.test(value)) {
              parent[key] = '';
            }
          }
        });
      });
    } else if (evt.scene === RefSceneEnum.Enum.remove_edge) {
    }
    console.log('nodeData>>', nodeData);
  }
}
