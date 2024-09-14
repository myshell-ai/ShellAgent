import { create } from 'zustand';

type State = {
  runSheetOpen: boolean;
  editing: boolean;
};

type Action = {
  setRunSheetOpen: (open: State['runSheetOpen']) => void;
  setEditing: (editing: State['editing']) => void;
};

export const useWorkflowState = create<State & Action>(set => ({
  runSheetOpen: false,
  editing: false,
  importDialogOpen: false,
  setRunSheetOpen: runSheetOpen => set(() => ({ runSheetOpen })),
  setEditing: editing => set(() => ({ editing })),
}));
