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
import { set } from 'lodash-es';
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

type Config = {
  fieldsModeMap: Record<string, Record<string, TFieldMode>>;
  refs: Refs;
};
@injectable()
export class AppBuilderModel {
  @observable nodeData: Record<string, FieldValues> = {};
  @observable metadata: Metadata = {
    name: '',
    description: '',
  };
  @observable flowInstance: ReactFlowInstance | null = null;

  scopes: Scopes | null = null;

  nodeDataMode: Map<string, string> = new Map();

  refs: Refs = {};

  @observable config: Config = {
    fieldsModeMap: {},
    refs: {},
  };

  @observable userInputs: TValues = {};
  @observable flowList: GetListResponse['data'] = [];
  @observable loading = {
    getReactFlow: false,
    getAutomata: false,
    chatRunning: false,
    fetchFlowList: false,
  };
  @observable transitions: Record<
    string,
    Record<
      'ALWAYS' | 'CHAT' | string,
      {
        target?: string;
        condition?: string;
      }[]
    >
  > = {};
  @observable resetData: Record<string, string | undefined> = {};

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
    } else if (evt.scene === RefSceneEnum.enum.remove_edge) {
    } else if (evt.scene === RefSceneEnum.enum.remove_ref_opts_prefix) {
    } else if (evt.scene === RefSceneEnum.enum.remove_state) {
    }

    this.refs = hanldeRefScene(this.refs, evt);

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
      this.loading.fetchFlowList = true;
      const { data } = await fetchFlowList(params);
      runInAction(() => {
        this.flowList = data;
      });
    } finally {
      runInAction(() => {
        this.loading.fetchFlowList = false;
      });
    }
  }

  @action.bound
  async getAutomata(params: any) {
    try {
      this.loading.getAutomata = true;
      const { data } = await fetchAutomata(params);
      runInAction(() => {
        this.nodeData = genNodeData(data);
      });
    } finally {
      runInAction(() => {
        this.loading.getAutomata = false;
      });
    }
  }

  @action.bound
  async getReactFlow(params: GetAppFlowRequest, instance: ReactFlowInstance) {
    try {
      runInAction(() => {
        this.loading.getReactFlow = true;
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
        this.loading.getReactFlow = false;
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
}
