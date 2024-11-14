import { EventSourceMessage } from '@microsoft/fetch-event-source';
import {
  IFlow,
  NodeIdEnum,
  ReactFlowInstance,
  NodeStatusEnum,
} from '@shellagent/flow-engine';
import { Automata } from '@shellagent/pro-config';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import { produce, setAutoFreeze } from 'immer';
import { createStore } from 'zustand/vanilla';
import { computed } from 'zustand-computed-state';

import { defaultFlow } from '@/components/app/constants';
import { fetchAutomata, fetchFlow } from '@/services/app';
import { GetAppFlowRequest, GetAutomataRequest } from '@/services/app/type';
import { fetchList as fetchFlowList } from '@/services/home';
import {
  Metadata,
  GetListRequest,
  GetListResponse,
} from '@/services/home/type';
import { genNodeData } from '@/stores/app/utils/data-transformer';
import { Refs } from '@shellagent/shared/protocol/app-scope';
setAutoFreeze(false);

export type AppState = {
  metadata: Metadata;
  config: {
    fieldsModeMap: Record<string, Record<string, TFieldMode>>;
    refs: Refs;
  };
  userInputs: TValues;
  nodeData: Record<string, TValues>;
  flowInstance: ReactFlowInstance | null;
  flowList: GetListResponse['data'];
  loading: {
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

export type ShellAgent = {
  reactflow: IFlow;
  config: AppState['config'];
  metadata: AppState['metadata'];
  automata: Automata;
};

export type AppAction = {
  // 运行用户输入表单
  setUserInputs: (userInputs: TValues) => void;
  getAutomata: (params: GetAutomataRequest) => void;
  getFlowList: (params: GetListRequest) => void;
  updateMetadata: (params: { metadata: Partial<Metadata> }) => void;
  setFieldsModeMap: (params: {
    id: string;
    name: string;
    mode: TFieldMode;
  }) => void;
  setRefs: (refs: Refs) => void;
};

export type AppStore = AppState & AppAction;

export const initState: AppState = {
  config: {
    fieldsModeMap: {},
    refs: {},
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
      setRefs: refs =>
        set(
          produce(state => {
            state.config.refs = refs;
          }),
        ),
      setUserInputs: userInputs =>
        set(
          produce(state => {
            state.userInputs = userInputs;
          }),
        ),
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
    })),
  );
};
