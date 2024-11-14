import { CustomKey, CustomEventName } from '@shellagent/pro-config';
import type { FieldValues, FormRef } from '@shellagent/ui';
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
import { defaultFlow } from '../../../components/app/constants';
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
import { cloneDeep } from 'lodash-es';
import {
  handleRemoveRefOpts,
  handleRemoveRefOptsPrefix,
  handleRenameRefOpt,
  handleRemoveState,
} from './node-data-utils';
import type { NodeDataType, Config, Metadata } from '@/types/app/types';
@injectable()
export class AppBuilderModel {
  nodeData: NodeDataType = {};
  metadata: Metadata = {
    name: '',
    description: '',
  };
  flowInstance: ReactFlowInstance | null = null;

  // TODO 收集所有form实例
  formInstance: Map<string, FormRef> = new Map();

  nodeDataMode: Map<string, string> = new Map();

  refs: Refs = {};

  config: Config = {
    fieldsModeMap: {},
    refs: {},
  };

  flowList: GetListResponse['data'] = [];

  @observable getReactFlowLoading = false;
  @observable getAutomataLoading = false;
  @observable chatRunningLoading = false;
  @observable fetchFlowListLoading = false;

  get scopes(): Scopes | null {
    if (!this.flowInstance || !this.nodeData) return null;
    const edges = this.flowInstance.getEdges();
    return convetNodeDataToScopes(this.nodeData, edges);
  }

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

  hanldeRefScene(evt: HandleRefSceneEvent) {
    const newRefs = hanldeRefScene(this.refs, evt);
    this.updateNodeData(evt, this.nodeData, this.refs, newRefs);
    this.refs = newRefs;

    console.log('this.refs>>', this.refs, evt);
    console.log('this.nodeData>>', this.nodeData);
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
      this.refs = config?.refs || {};
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

  // TODO 解决nodeData变化不触发ui变更问题
  updateNodeData(
    evt: HandleRefSceneEvent,
    nodeData: NodeDataType,
    refs: Refs,
    newRefs: Refs,
  ) {
    const updatedNodeData = cloneDeep(nodeData);

    if (evt.scene === RefSceneEnum.Enum.remove_ref_opts) {
      handleRemoveRefOpts(updatedNodeData, evt.params.paths);
    } else if (evt.scene === RefSceneEnum.Enum.remove_ref_opts_prefix) {
      handleRemoveRefOptsPrefix(updatedNodeData, evt.params.prefix);
    } else if (evt.scene === RefSceneEnum.Enum.rename_ref_opt) {
      handleRenameRefOpt(
        updatedNodeData,
        evt.params.oldPath,
        evt.params.newPath,
      );
    } else if (evt.scene === RefSceneEnum.Enum.remove_state) {
      handleRemoveState(updatedNodeData, evt.params.stateName);
    } else if (evt.scene === RefSceneEnum.Enum.remove_edge) {
      // 待实现
    }

    runInAction(() => {
      this.nodeData = updatedNodeData;
    });
  }
}
