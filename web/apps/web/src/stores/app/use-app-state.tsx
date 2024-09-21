import { Node } from '@shellagent/flow-engine';
import { create } from 'zustand';

import { EdgeDataTypeEnum, CustomEdgeData } from '@/components/app/edges';

type State = {
  editing: boolean;
  currentStateId: string;
  stateConfigSheetOpen: boolean;
  insideSheetOpen: boolean;
  insideSheetMode: 'button' | 'workflow' | 'widget' | '';
  transitionSheetOpen: boolean;
  runDrawerWidth: number;
  selectedNode: Node | undefined;
  currentTaskIndex?: number;
  currentButtonId: string;
  currentTransitionSource: string;
  currentTransitionSourceHandle: string;
  currentEdegData: CustomEdgeData;
  targetInputsSheetOpen: boolean;
  // 当前copy的id
  currentCopyId?: string;
};

type Action = {
  setEditing: (editing: State['editing']) => void;
  setStateConfigSheetOpen: (stateId: string, open: boolean) => void;
  setSelectedNode: (node: Node) => void;
  setInsideSheetOpen: (params: {
    stateId: string;
    open: boolean;
    mode?: State['insideSheetMode'];
    buttonId?: string;
    currentTaskIndex?: number;
  }) => void;
  setTransitionSheetOpen: (params: {
    open: boolean;
    source: string;
    sourceHandle: string;
    data?: CustomEdgeData;
  }) => void;
  setTargetInputsSheetOpen: (open: State['targetInputsSheetOpen']) => void;
  setRunDrawerWidth: (width: number) => void;
  resetState: () => void;
  setCurrentCopyId: (id: string) => void;
};

const initialState: State = {
  editing: false,
  stateConfigSheetOpen: false,
  targetInputsSheetOpen: false,
  selectedNode: undefined,
  currentStateId: '',
  currentButtonId: '',
  insideSheetOpen: false,
  insideSheetMode: '',
  currentTransitionSource: '',
  currentTransitionSourceHandle: '',
  runDrawerWidth: 715,
  transitionSheetOpen: false,
  currentCopyId: '',
  currentEdegData: {
    id: '',
    custom: true,
    event_key: '',
    type: EdgeDataTypeEnum.ALWAYS,
    target: '',
    conditions: [],
  },
};

export const useAppState = create<State & Action>(set => ({
  ...initialState,
  resetState: () => set(() => initialState),
  setEditing: editing => set(() => ({ editing })),
  setRunDrawerWidth: runDrawerWidth => set(() => ({ runDrawerWidth })),
  setSelectedNode: selectedNode => set(() => ({ selectedNode })),
  setCurrentCopyId: (id: string) => set(() => ({ currentCopyId: id })),
  setStateConfigSheetOpen: (stateId, open) =>
    set(state => {
      if (open && state.currentStateId !== stateId) {
        return {
          stateConfigSheetOpen: true,
          currentStateId: stateId,
          insideSheetOpen: false,
          insideSheetMode: '',
          transitionSheetOpen: false,
          currentTransitionSource: '',
          currentTransitionSourceHandle: '',
          currentEdegData: undefined,
          targetInputsSheetOpen: false,
        };
      }
      if (!open && state.currentStateId === stateId) {
        return {
          stateConfigSheetOpen: false,
          currentStateId: '',
          insideSheetOpen: false,
          insideSheetMode: '',
          transitionSheetOpen: false,
          currentTransitionSource: '',
          currentTransitionSourceHandle: '',
          currentEdegData: undefined,
        };
      }
      return state;
    }),
  setTransitionSheetOpen: ({ open, source, sourceHandle, data }) => {
    set(() => {
      if (open) {
        return {
          transitionSheetOpen: true,
          currentTransitionSource: source,
          currentTransitionSourceHandle: sourceHandle,
          currentEdegData: data || undefined,
          stateConfigSheetOpen: false,
          currentStateId: '',
          insideSheetOpen: false,
          insideSheetMode: '',
          currentButtonId: '',
          currentTaskIndex: undefined,
        };
      }
      return {
        transitionSheetOpen: false,
        currentTransitionSource: '',
        currentTransitionSourceHandle: '',
        currentEdegData: undefined,
        targetInputsSheetOpen: false,
      };
    });
  },
  setInsideSheetOpen: ({ stateId, open, mode, buttonId, currentTaskIndex }) =>
    set(state => {
      if (open) {
        return {
          stateConfigSheetOpen: true,
          currentStateId: stateId,
          insideSheetOpen: true,
          insideSheetMode: mode || '',
          currentButtonId: mode === 'button' ? buttonId : '',
          currentTaskIndex,
          transitionSheetOpen: false,
          currentTransitionSource: '',
          currentTransitionSourceHandle: '',
          currentEdegData: undefined,
          targetInputsSheetOpen: false,
        };
      }
      return {
        ...state,
        insideSheetOpen: false,
        insideSheetMode: '',
        currentButtonId: '',
        currentTaskIndex: undefined,
        transitionSheetOpen: false,
        currentTransitionSource: '',
        currentTransitionSourceHandle: '',
        currentEdegData: undefined,
      };
    }),
  setTargetInputsSheetOpen: (open: boolean) =>
    set(state => ({
      ...state,
      targetInputsSheetOpen: open,
    })),
}));
