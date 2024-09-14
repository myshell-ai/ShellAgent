import { EventSourceMessage } from '@microsoft/fetch-event-source';
import {
  IFlow,
  NodeId,
  NodeIdEnum,
  ReactFlowInstance,
  NodeStatusEnum,
} from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import { Workflow } from '@shellagent/pro-config';
import { setAutoFreeze, produce } from 'immer';
import { createStore } from 'zustand/vanilla';
import { computed } from 'zustand-computed-state';

import { defaultFlow } from '@/components/workflow/constants';
import { Metadata } from '@/services/home/type';
import {
  fetchWidgetSchema,
  fetchFlow,
  fetchProConfig,
  fetchWidgetList,
} from '@/services/workflow';
import {
  GetWidgetSchemaRequest,
  GetWidgetSchemaResponse,
  GetFlowRequest,
  GetProconfigRequest,
  GetWidgetListRequest,
  GetWidgetListResponse,
  RunWorkflowResponse,
  EventStatusEnum,
} from '@/services/workflow/type';
import {
  genNodeData,
  genReactFlow,
  genWorkflowData,
} from '@/stores/workflow/utils/data-transformer';

setAutoFreeze(false);

export type WorkflowState = {
  widgetList: GetWidgetListResponse['widget_list'];
  metadata: Metadata;
  config: {
    fieldsModeMap: Record<string, Record<string, TFieldMode>>;
    schemaModeMap: Record<string, string>;
  };
  userInputs: TValues;
  nodeData: Record<string, TValues>;
  fieldTypes: {
    [id: string]: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
  widgetSchema: Record<string, GetWidgetSchemaResponse>;
  flowInstance: ReactFlowInstance | null;
  loading: {
    getWidgetList?: boolean;
    getWidgetSchema?: Record<string, boolean>;
    getReactFlow?: boolean;
    getProConfig?: boolean;
    workflowRunning?: boolean;
  };
  resetData: Record<string, TValues>;
  reloadSchemaMap: Record<string, boolean>;
};

export type WorkflowAction = {
  initReactFlow: (reactflow: IFlow) => void;
  initNodeData: (nodeData: Record<string, TValues>) => void;
  // 运行用户输入表单
  setUserInputs: (userInputs: TValues) => void;
  setFieldTypes?: (
    id: string,
    fieldTypes: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    },
  ) => void;
  setNodeData: (params: { id: NodeId; data: TValues }) => void;
  setFlowInstance: (instance: ReactFlowInstance) => void;
  getWidgetList: (params: GetWidgetListRequest) => void;
  getWidgetSchema: (
    params: GetWidgetSchemaRequest & { id?: string },
    reload?: boolean,
  ) => void;
  getReactFlow: (params: GetFlowRequest, instance: ReactFlowInstance) => void;
  getProConfig: (params: GetProconfigRequest) => void;
  onWorkflowMessage: (params: EventSourceMessage) => void;
  clearRuntimeData: () => void;
  importWorkflow: (params: { workflow: Workflow; comfyui: any }) => void;
  updateMetadata: (params: { metadata: Partial<Metadata> }) => void;
  setSchemaModeMap: (params: { id: string; mode: string }) => void;
  setFieldsModeMap: (params: {
    id: string;
    name: string;
    mode: TFieldMode;
  }) => void;
  setResetData: (data: { path: string; value?: string }) => void;
  clearResetData: (path: string) => void;
  delConfigMap: (id: string) => void;
  setRunLoading: (loading: boolean) => void;
};

export type WorkflowStore = WorkflowState & WorkflowAction;

export const initState: WorkflowState = {
  widgetList: [],
  config: {
    fieldsModeMap: {},
    // node schema mode
    schemaModeMap: {},
  },
  metadata: {
    name: '',
    description: '',
  },
  userInputs: {},
  widgetSchema: {},
  fieldTypes: {},
  nodeData: {
    [NodeIdEnum.start]: {},
    [NodeIdEnum.end]: {},
  },
  flowInstance: null,
  loading: {
    getWidgetList: false,
    getWidgetSchema: {},
    getProConfig: false,
    getReactFlow: false,
    workflowRunning: false,
  },
  resetData: {},
  // reload
  reloadSchemaMap: {},
};

export const createWorkflowStore = () => {
  return createStore<WorkflowStore>()(
    computed((set, get) => ({
      ...initState,
      initReactFlow: (reactflow: IFlow) => {
        const { setEdges, setNodes, setViewport } = get().flowInstance || {};
        setNodes?.(reactflow.nodes || defaultFlow.nodes);
        setEdges?.(reactflow.edges || defaultFlow.edges);
        setViewport?.(reactflow.viewport || defaultFlow.viewport);
      },
      initNodeData: nodeData => {
        set(
          produce(state => {
            state.nodeData = nodeData;
          }),
        );
      },
      setFlowInstance: instance =>
        set(
          produce(state => {
            state.flowInstance = instance;
          }),
        ),
      setSchemaModeMap: ({ id, mode }) => {
        set(
          produce(state => {
            if (!state.config?.schemaModeMap) {
              state.config.schemaModeMap = {};
            }
            state.config.schemaModeMap[id] = mode;
          }),
        );
      },
      setFieldsModeMap: ({ id, name, mode }) => {
        set(
          produce(state => {
            if (!state.config?.fieldsModeMap) {
              state.config.fieldsModeMap = {};
            }
            if (!state.config?.fieldsModeMap?.[id]) {
              state.config.fieldsModeMap[id] = {};
            }
            state.config.fieldsModeMap[id][name] = mode;
          }),
        );
      },
      setUserInputs: userInputs =>
        set(
          produce(state => {
            state.userInputs = userInputs;
          }),
        ),
      setFieldTypes: (id, fieldTypes) =>
        set(
          produce(state => {
            state.fieldTypes[id] = fieldTypes;
          }),
        ),
      setNodeData: ({ id, data }) => {
        set(
          produce(state => {
            state.nodeData[id] = data;
          }),
        );
      },
      getWidgetList: async params => {
        try {
          set(
            produce(state => {
              state.loading.getWidgetList = true;
            }),
          );
          const response = await fetchWidgetList(params);
          set(
            produce(state => {
              state.widgetList = response.widget_list;
            }),
          );
        } finally {
          set(
            produce(state => {
              state.loading.getWidgetList = false;
            }),
          );
        }
      },
      getWidgetSchema: async (params, reload) => {
        set(
          produce(state => {
            state.loading.getWidgetSchema[params.widget_name] = true;
          }),
        );
        if (reload) {
          set(
            produce(state => {
              state.reloadSchemaMap[params.widget_name] = true;
            }),
          );
        }
        const { nodeData } = get();
        let response = {};
        try {
          response = await fetchWidgetSchema({
            widget_name: params.widget_name,
          });
          if (
            params.id &&
            nodeData[params.id].mode === 'undefined' &&
            response
          ) {
            set(
              produce(state => {
                state.nodeData[params.id!] = {
                  input: nodeData[params.id!].input,
                  name: nodeData[params.id!].name,
                  output: nodeData[params.id!].output,
                };
              }),
            );
          }
        } catch (error) {
          if (nodeData[params.id!]?.mode === 'undefined') {
            const { input_names, input_types, output_names, output_types } =
              nodeData[params.id!];
            response = {
              input_schema: {
                properties: input_names.reduce(
                  (memo: any, field: string, idx: number) => {
                    memo[field] = {
                      title: field,
                      type: input_types[idx],
                    };
                    return memo;
                  },
                  {},
                ),
                title: 'InputsSchema',
                type: 'object',
              },
              multi_input_schema: false,
              output_schema: {
                properties: output_names.reduce(
                  (memo: any, field: string, idx: number) => {
                    memo[field] = {
                      title: field,
                      type: output_types[idx],
                    };
                    return memo;
                  },
                  {},
                ),
                title: 'OutputsSchema',
                type: 'object',
              },
            };
          }
        }

        set(
          produce(state => {
            state.widgetSchema[params.widget_name] = response;
            state.loading.getWidgetSchema[params.widget_name] = false;
          }),
        );

        if (reload) {
          set(
            produce(state => {
              state.reloadSchemaMap[params.widget_name] = false;
            }),
          );
        }
      },
      getReactFlow: async (params, instance) => {
        try {
          set(
            produce(state => {
              state.loading.getReactFlow = true;
            }),
          );
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
          set(
            produce(state => {
              state.config = config || initState.config;
              state.metadata = metadata;
            }),
          );
        } finally {
          set(
            produce(state => {
              state.loading.getReactFlow = false;
            }),
          );
        }
      },
      getProConfig: async params => {
        try {
          set(
            produce(state => {
              state.loading.getProConfig = true;
            }),
          );
          const response = await fetchProConfig(params);
          set(
            produce(state => {
              state.nodeData = genNodeData(response.data);
              state.loading.getProConfig = false;
            }),
          );
        } finally {
          set(
            produce(state => {
              state.loading.getProConfig = false;
            }),
          );
        }
      },
      setRunLoading(loading) {
        set(
          produce(state => {
            state.loading.workflowRunning = loading;
          }),
        );
      },
      onWorkflowMessage(event) {
        const type = event.event;
        let data: any = null;
        try {
          data = JSON.parse(event.data || '{}') as RunWorkflowResponse['data'];
        } catch (e) {
          // noop
          console.log('err json', event.data);
        }
        if (data === null) {
          return;
        }
        if (type === EventStatusEnum.workflow_start) {
          get().flowInstance?.fitView();
          set(
            produce(state => {
              state.loading.workflowRunning = true;
            }),
          );
        }
        if (type === EventStatusEnum.workflow_end) {
          get().flowInstance?.fitView();
          set(
            produce(state => {
              state.loading.workflowRunning = false;
            }),
          );
        }
        if (type === EventStatusEnum.node_start) {
          get().flowInstance?.fitView({
            minZoom: 0.5,
            maxZoom: 1,
            nodes: [{ id: data?.node_id as string }],
            padding: 400,
          });
          get().flowInstance?.setNodes(nodes =>
            nodes.map(node =>
              node.id === data?.node_id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      runtime_data: data,
                    },
                  }
                : node,
            ),
          );
        }
        if (type === EventStatusEnum.node_running) {
          get().flowInstance?.setNodes(nodes =>
            nodes.map(node =>
              node.id === data?.node_id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      runtime_data: {
                        ...node.data.runtime_data,
                        progress: data?.output?.progress,
                      },
                    },
                  }
                : node,
            ),
          );
        }
        if (type === EventStatusEnum.node_end) {
          get().flowInstance?.setNodes(nodes => {
            const node = nodes.find(node => node.id === data?.node_id);
            if (node) {
              node.data = {
                ...node.data,
                runtime_data: data,
              };
            }
            return nodes;
          });
          if (data?.node_status === NodeStatusEnum.failed) {
            set(
              produce(state => {
                state.loading.workflowRunning = false;
              }),
            );
          }
        }
      },
      clearRuntimeData() {
        get().flowInstance?.setNodes(nodes => {
          nodes.forEach(node => {
            node.data = {
              ...node.data,
              runtime_data: {},
            };
          });
          return nodes;
        });
      },
      updateMetadata({ metadata }) {
        set(
          produce(state => {
            state.metadata = {
              ...state.metadata,
              ...metadata,
            };
          }),
        );
      },
      importWorkflow({ workflow, comfyui }) {
        workflow = genWorkflowData(workflow);
        const { setNodeData, setFieldsModeMap } = get();
        set(
          produce(state => {
            state.config = initState.config;
            state.nodeData = initState.nodeData;
            state.widgetSchema = initState.widgetSchema;
          }),
        );
        // 先清空
        get().initReactFlow({
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 },
        });
        setTimeout(() => {
          const reactflow = genReactFlow(
            workflow,
            setNodeData,
            setFieldsModeMap,
            comfyui,
          );
          get().initReactFlow(reactflow);
        });
      },
      setResetData(data) {
        set(
          produce(state => {
            state.resetData[data.path] = data.value;
          }),
        );
      },
      clearResetData(path) {
        set(
          produce(state => {
            delete state.resetData[path];
          }),
        );
      },
      delConfigMap(id) {
        set(
          produce(state => {
            delete state.config.fieldsModeMap?.[id];
            delete state.config.schemaModeMap?.[id];
          }),
        );
      },
    })),
  );
};
