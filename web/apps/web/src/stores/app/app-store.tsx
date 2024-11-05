import { EventSourceMessage } from '@microsoft/fetch-event-source';
import {
  IFlow,
  NodeIdEnum,
  ReactFlowInstance,
  NodeStatusEnum,
} from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import { produce, setAutoFreeze } from 'immer';
import { createStore } from 'zustand/vanilla';
import { computed } from 'zustand-computed-state';

import { defaultFlow } from '@/components/app/constants';
import { fetchAutomata, fetchFlow } from '@/services/app';
import {
  GetAppFlowRequest,
  GetAutomataRequest,
  EventStatusEnum,
  RunAppResponse,
} from '@/services/app/type';
import { fetchList as fetchFlowList } from '@/services/home';
import {
  Metadata,
  GetListRequest,
  GetListResponse,
} from '@/services/home/type';
import { genNodeData } from '@/stores/app/utils/data-transformer';

setAutoFreeze(false);

export type AppState = {
  metadata: Metadata;
  config: {
    fieldsModeMap: Record<string, Record<string, TFieldMode>>;
    schemaModeMap: Record<string, string>;
  };
  userInputs: TValues;
  nodeData: Record<string, TValues>;
  flowInstance: ReactFlowInstance | null;
  flowList: GetListResponse['data'];
  loading: {
    getReactFlow: boolean;
    getAutomata: boolean;
    chatRunning: boolean;
    fetchFlowList: boolean;
  };
  transitions: Record<
    string,
    Record<
      'ALWAYS' | 'CHAT' | string,
      {
        target?: string;
        condition?: string;
      }[]
    >
  >;
};

export type AppAction = {
  initReactFlow: (reactflow: IFlow) => void;
  initNodeData: (nodeData: Record<string, TValues>) => void;
  // 运行用户输入表单
  setUserInputs: (userInputs: TValues) => void;
  setNodeData: (params: { id: string; data: TValues }) => void;
  setFlowInstance: (instance: ReactFlowInstance) => void;
  getAutomata: (params: GetAutomataRequest) => void;
  getFlowList: (params: GetListRequest) => void;
  getReactFlow: (
    params: GetAppFlowRequest,
    instance: ReactFlowInstance,
  ) => void;
  onChatMessage: (params: EventSourceMessage) => void;
  clearRuntimeData: () => void;
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
  delNodeData: (id: string) => void;
  setTransitions: (params: {
    id: string;
    transitions: Record<
      'ALWAYS' | 'CHAT' | string,
      {
        target?: string;
        condition?: string;
      }[]
    >;
  }) => void;
};

export type AppStore = AppState & AppAction;

export const initState: AppState = {
  config: {
    fieldsModeMap: {},
    // node schema mode
    schemaModeMap: {},
  },
  metadata: {
    name: '',
    description: '',
  },
  flowList: [],
  userInputs: {},
  nodeData: {
    [NodeIdEnum.start]: {},
  },
  flowInstance: null,
  // TODO 看看后续能不能拆出来
  loading: {
    getReactFlow: false,
    getAutomata: false,
    chatRunning: false,
    fetchFlowList: false,
  },
  transitions: {},
};

export const createAppStore = () => {
  return createStore<AppStore>()(
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
      setNodeData: ({ id, data }) => {
        set(
          produce(state => {
            state.nodeData[id] = data;
          }),
        );
      },
      getFlowList: async params => {
        try {
          set(
            produce(state => {
              state.loading.fetchFlowList = true;
            }),
          );
          const { data } = await fetchFlowList(params);
          set(
            produce(state => {
              state.flowList = data;
            }),
          );
        } finally {
          set(
            produce(state => {
              state.loading.fetchFlowList = false;
            }),
          );
        }
      },
      getAutomata: async params => {
        try {
          set(
            produce(state => {
              state.loading.getAutomata = true;
            }),
          );
          const { data } = await fetchAutomata(params);
          set(
            produce(state => {
              state.nodeData = genNodeData(data);
            }),
          );
        } finally {
          set(
            produce(state => {
              state.loading.getAutomata = false;
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
      // 处理chat消息
      onChatMessage(event) {
        const type = event.event;
        const data = JSON.parse(event.data || '{}') as RunAppResponse['data'];
        if (type === EventStatusEnum.app_start) {
          get().flowInstance?.fitView();
          set(
            produce(state => {
              state.loading.chatRunning = true;
            }),
          );
        }
        if (type === EventStatusEnum.app_end) {
          get().flowInstance?.fitView();
          set(
            produce(state => {
              state.loading.chatRunning = false;
            }),
          );
        }
        if (type === EventStatusEnum.state_start) {
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
        if (type === EventStatusEnum.state_exit) {
          // TODO @shane addMessage
          // get().flowInstance?.setNodes(nodes =>
          //   nodes.map(node =>
          //     node.id === data?.node_id
          //       ? {
          //           ...node,
          //           data: {
          //             ...node.data,
          //             runtime_data: {
          //               ...node.data.runtime_data,
          //               progress: data?.outputs?.progress,
          //             },
          //           },
          //         }
          //       : node,
          //   ),
          // );
        }
        if (type === EventStatusEnum.state_end) {
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
                state.loading.chatRunning = false;
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
      delNodeData(id) {
        set(
          produce(state => {
            delete state.nodeData[id];
          }),
        );
      },
      setTransitions({ id, transitions }) {
        set(
          produce(state => {
            state.transitions[id] = transitions;
          }),
        );
      },
    })),
  );
};
