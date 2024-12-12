import {
  NodeIdEnum,
  type IFlow,
  type ReactFlowInstance,
} from '@shellagent/flow-engine';
import type { TFieldMode } from '@shellagent/form-engine';
import { CustomKey, CustomEventName, Automata } from '@shellagent/pro-config';
import {
  RefSceneEnum,
  RefType,
  getRefOptions,
  Scopes,
  HandleRefSceneEvent,
  handleRefScene,
  Refs,
} from '@shellagent/shared/protocol/app-scope';
import type { FieldValues } from '@shellagent/ui';
import { injectable, inject } from 'inversify';
import { isEmpty, set } from 'lodash-es';
import { action, makeObservable, observable, runInAction } from 'mobx';

import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
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
  fieldsModeMap2Refs,
} from './app-builder-utils';
import {
  handleRemoveRefOpts,
  handleRemoveRefOptsPrefix,
  handleRenameRefOpt,
  handleRemoveState,
  handleReorderTask,
} from './node-data-utils';
import { defaultFlow } from '../../../components/app/constants';

@injectable()
export class AppBuilderModel {
  nodeData: NodeDataType = {};
  @observable metadata: Metadata = {
    name: '',
    description: '',
  };
  flowInstance: ReactFlowInstance | null = null;

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
  @observable versionData: GetAppVersionListResponse = { data: [] };
  @observable getVersionLoading = false;
  @observable releaseLoading = false;
  @observable saveLoading = false;
  @observable restoreLoading = false;

  copyNodeData: FieldValues = {};

  get scopes(): Scopes | null {
    if (!this.flowInstance || !this.nodeData) return null;
    const edges = this.flowInstance.getEdges();
    return convetNodeDataToScopes(this.nodeData, edges);
  }

  get refs(): Refs {
    return this.config.refs || {};
  }

  constructor(
    @inject(EmitterModel) private emitter: EmitterModel,
    @inject(AppBuilderChatModel) public chatModel: AppBuilderChatModel,
  ) {
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

  handleRefScene(evt: HandleRefSceneEvent) {
    const newRefs = handleRefScene(this.refs, evt);
    this.updateNodeData(evt, this.nodeData);
    this.config.refs = newRefs;
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
    config: Config;
    metadata: any;
    automata: Automata;
  }) {
    this.resetData();

    setTimeout(() => {
      if (this.flowInstance) {
        const nodes = reactflow?.nodes || defaultFlow.nodes;
        const edges = Array.isArray(reactflow?.edges)
          ? reactflow.edges
          : defaultFlow.edges;
        const viewport = reactflow?.viewport || defaultFlow.viewport;

        this.flowInstance.setNodes(nodes);
        this.flowInstance.setEdges(edges);
        this.flowInstance.setViewport(viewport);
      }

      runInAction(() => {
        this.config = {
          fieldsModeMap: config.fieldsModeMap,
          refs: config.refs || fieldsModeMap2Refs(config.fieldsModeMap),
        };
        this.metadata = metadata;
        this.nodeData = genNodeData(automata);

        emitter.emit(EventType.FORM_CHANGE, {
          id: this.selectedStateId as any,
          data: `${new Date().valueOf()}`,
          type: 'StateCard',
        });
      });
      this.emitter.emitter.emit('message.success', 'import success!');
    });
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

      const {
        reactflow,
        config = {} as Config,
        metadata,
      } = await fetchFlow(params);
      if (instance) {
        const edges = reactflow?.edges.length
          ? reactflow.edges
          : defaultFlow.edges;
        const initialState = edges?.find(
          item => item.source === NodeIdEnum.start,
        )?.target;

        instance.setNodes(
          reactflow?.nodes.length
            ? reactflow.nodes.map(item => {
                if (
                  item.id === initialState &&
                  item.type !== NodeIdEnum.intro
                ) {
                  set(item, 'type', NodeIdEnum.intro);
                  set(item, 'data.type', NodeIdEnum.intro);
                }
                return item;
              })
            : defaultFlow.nodes,
        );
        instance.setEdges(edges);
        instance.setViewport(reactflow?.viewport || defaultFlow.viewport);
      }

      runInAction(() => {
        this.config = {
          fieldsModeMap: config.fieldsModeMap,
          refs: config.refs || fieldsModeMap2Refs(config.fieldsModeMap),
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

  updateNodeData(evt: HandleRefSceneEvent, nodeData: NodeDataType) {
    let updatedNodeData: Record<string, FieldValues> = {};
    let isUpdated = true;

    switch (evt.scene) {
      case RefSceneEnum.Enum.remove_ref_opts:
        updatedNodeData = handleRemoveRefOpts(nodeData, evt.params.paths);
        break;
      case RefSceneEnum.Enum.remove_ref_opts_prefix:
        updatedNodeData = handleRemoveRefOptsPrefix(
          nodeData,
          evt.params.prefix,
        );
        break;
      case RefSceneEnum.Enum.rename_ref_opt:
        updatedNodeData = handleRenameRefOpt(
          nodeData,
          evt.params.oldPath,
          evt.params.newPath,
          evt.params.byPrefix,
        );
        break;
      case RefSceneEnum.Enum.remove_state:
        updatedNodeData = handleRemoveState(nodeData, evt.params.stateName);
        break;
      case RefSceneEnum.Enum.reorder_task:
        updatedNodeData = handleReorderTask(
          nodeData,
          evt.params.stateName,
          evt.params.currentTasks,
          evt.params.previousTasks,
        );
        break;
      default:
        isUpdated = false;
    }

    if (isUpdated) {
      runInAction(() => {
        this.nodeData = updatedNodeData;
        emitter.emit(EventType.FORM_CHANGE, {
          id: this.selectedStateId as any,
          data: `${new Date().valueOf()}`,
          type: 'StateCard',
        });
      });
    }
  }

  @action.bound
  async getVersionList(app_id: string) {
    try {
      this.getVersionLoading = true;
      const result = await fetchAppVersionList({ app_id });
      runInAction(() => {
        this.versionData = {
          ...result,
          data: [...(result.data || [])],
        };
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
          this.emitter.emitter.emit('message.success', 'Publish Success');
        } else {
          this.emitter.emitter.emit('message.error', 'Publish Error');
        }
      } catch (error) {
        this.emitter.emitter.emit('message.error', 'Publish Error');
      } finally {
        runInAction(() => {
          this.releaseLoading = false;
        });
      }
    }
  }

  @action.bound
  async saveApp(app_id: string, showMessage = true) {
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
          if (showMessage) {
            this.emitter.emitter.emit('message.success', 'App Saved');
          }
        } else {
          this.emitter.emitter.emit(
            'message.error',
            result.message || 'Save Error',
          );
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
          this.emitter.emitter.emit('message.success', 'Restore Success');
        } else {
          this.emitter.emitter.emit(
            'message.error',
            result.message || 'Restore Error',
          );
        }
      } catch (error: any) {
        this.emitter.emitter.emit('message.error', 'Restore Error');
      } finally {
        runInAction(() => {
          this.restoreLoading = false;
        });
      }
    }
  }

  @action.bound
  setCopyData(id: string, display_name: string) {
    this.copyNodeData = {
      ...(this.nodeData[id] || {}),
      display_name,
      name: 'State',
    };
  }

  @action.bound
  resetData() {
    // 重置 reactflow 画布
    if (this.flowInstance) {
      this.flowInstance.setNodes(defaultFlow.nodes);
      this.flowInstance.setEdges(defaultFlow.edges);
      this.flowInstance.setViewport(defaultFlow.viewport);
    }

    this.nodeData = {};
    this.metadata = {
      name: '',
      description: '',
    };
    this.config = {
      fieldsModeMap: {},
      refs: {},
    };

    this.chatModel.closeRunDrawer();

    emitter.emit(EventType.RESET_FORM, {
      data: `${new Date().valueOf()}`,
    });
  }

  @action.bound
  setVersionName(versionName: string) {
    runInAction(() => {
      this.versionName = versionName;
    });
  }

  @action.bound
  setEdgeDataByEventKey(prevEventKey: string, newEdgeKey: string) {
    const setEdges = this.flowInstance?.setEdges;

    setEdges?.(state => {
      const targetEdge = state.find(
        edge => edge.data?.event_key === prevEventKey,
      );

      if (targetEdge) {
        // 创建新的边数组，将目标边的 event_key 更新为新值
        return state.map(edge => {
          if (edge.data?.event_key === prevEventKey) {
            return {
              ...edge,
              data: {
                ...edge.data,
                event_key: newEdgeKey,
              },
            };
          }
          return edge;
        });
      }

      return state;
    });
  }
}
