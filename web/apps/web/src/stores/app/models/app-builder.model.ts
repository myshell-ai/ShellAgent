import type { IFlow, ReactFlowInstance } from '@shellagent/flow-engine';
import type { TFieldMode } from '@shellagent/form-engine';
import { CustomKey, CustomEventName, Automata } from '@shellagent/pro-config';
import {
  RefSceneEnum,
  RefType,
  getRefOptions,
  Scopes,
  HandleRefSceneEvent,
  hanldeRefScene,
  Refs,
} from '@shellagent/shared/protocol/app-scope';
import type { FieldValues } from '@shellagent/ui';
import { injectable, inject } from 'inversify';
import { cloneDeep, isEmpty } from 'lodash-es';
import { action, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchAutomata,
  fetchFlow,
  saveApp,
  releaseApp,
  fetchAppVersionList,
} from '@/services/app';
import type {
  GetAppFlowRequest,
  GetAppVersionListResponse,
} from '@/services/app/type';
import { fetchList as fetchFlowList } from '@/services/home';
import type { GetListRequest, GetListResponse } from '@/services/home/type';
import emitter, { EventType } from '@/stores/app/models/emitter';
import { genNodeData, genAutomata } from '@/stores/app/utils/data-transformer';
import type { NodeDataType, Config, Metadata } from '@/types/app/types';
import { EmitterModel } from '@/utils/emitter.model';

import {
  CascaderOption,
  convertRefOptsToCascaderOpts,
  convetNodeDataToScopes,
} from './app-builder-utils';
import {
  handleRemoveRefOpts,
  handleRemoveRefOptsPrefix,
  handleRenameRefOpt,
  handleRemoveState,
} from './node-data-utils';
import { defaultFlow } from '../../../components/app/constants';

@injectable()
export class AppBuilderModel {
  nodeData: NodeDataType = {};
  metadata: Metadata = {
    name: '',
    description: '',
  };
  flowInstance: ReactFlowInstance | null = null;

  nodeDataMode: Map<string, string> = new Map();

  config: Config = {
    fieldsModeMap: {},
    refs: {},
  };

  selectedStateId: string | null = null;

  flowList: GetListResponse['data'] = [];

  @observable versionName = '';

  @observable getReactFlowLoading = false;
  @observable getAutomataLoading = false;
  @observable chatRunningLoading = false;
  @observable fetchFlowListLoading = false;
  @observable versionData: GetAppVersionListResponse | undefined;
  @observable getVersionLoading = false;
  @observable releaseLoading = false;
  @observable saveLoading = false;
  @observable restoreLoading = false;

  get scopes(): Scopes | null {
    if (!this.flowInstance || !this.nodeData) return null;
    const edges = this.flowInstance.getEdges();
    return convetNodeDataToScopes(this.nodeData, edges);
  }

  get refs(): Refs {
    return this.config.refs;
  }

  constructor(@inject(EmitterModel) private emitter: EmitterModel) {
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
    this.config.refs = newRefs;

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
      this.config = config || {
        fieldsModeMap: {},
        refs: {},
      };
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
    }

    runInAction(() => {
      this.nodeData = updatedNodeData;

      emitter.emit(EventType.STATE_FORM_CHANGE, {
        id: this.selectedStateId as any,
        data: `${new Date().valueOf()}`,
        type: 'StateCard',
      });
    });
  }

  @action.bound
  async getVersionList(app_id: string) {
    try {
      this.getVersionLoading = true;
      const result = await fetchAppVersionList({ app_id });
      runInAction(() => {
        this.versionData = result;
      });
    } catch (error: any) {
      this.emitter.emitter.emit('message.error', error.message);
    } finally {
      runInAction(() => {
        this.getVersionLoading = false;
      });
    }
  }

  @action.bound
  async releaseApp(app_id: string) {
    const reactflow = this.flowInstance?.toObject() as IFlow;
    if (!isEmpty(reactflow)) {
      try {
        this.releaseLoading = true;
        const result = await releaseApp({
          app_id,
          reactflow,
          automata: genAutomata(reactflow, this.nodeData),
          config: this.config,
          version_name: this.versionName,
          metadata: this.metadata,
        });
        if (result.success) {
          await this.getVersionList(app_id);
          this.versionName = '';
          this.emitter.emitter.emit('message.success', 'publish success');
        }
      } catch (error) {
        this.emitter.emitter.emit('message.error', 'publish error');
      } finally {
        runInAction(() => {
          this.releaseLoading = false;
        });
      }
    }
  }

  @action.bound
  async saveApp(app_id: string) {
    const reactflow = this.flowInstance?.toObject() as IFlow;
    if (!isEmpty(reactflow) && app_id) {
      try {
        this.saveLoading = true;
        const result = await saveApp({
          reactflow,
          config: this.config,
          automata: genAutomata(reactflow, this.nodeData),
          app_id,
        });
        if (result.success) {
          this.emitter.emitter.emit('message.success', 'App Saved');
        }
      } catch (error: any) {
        this.emitter.emitter.emit('message.error', error.message);
      } finally {
        runInAction(() => {
          this.saveLoading = false;
        });
      }
    }
  }

  @action.bound
  async restoreApp(app_id: string) {
    const reactflow = this.flowInstance?.toObject() as IFlow;
    if (!isEmpty(reactflow) && app_id) {
      try {
        this.restoreLoading = true;
        const result = await saveApp({
          app_id,
          reactflow,
          automata: genAutomata(reactflow, this.nodeData),
          config: this.config,
        });
        if (result.success) {
          this.emitter.emitter.emit('message.success', 'restore success');
        }
      } catch (error: any) {
        this.emitter.emitter.emit('message.error', 'restore error');
      } finally {
        runInAction(() => {
          this.restoreLoading = false;
        });
      }
    }
  }
}
