import { create } from 'zustand';

type State = {
  runSheetOpen: boolean;
  editing: boolean;
  currentCopyId: string;
};

type Action = {
  setRunSheetOpen: (open: State['runSheetOpen']) => void;
  setEditing: (editing: State['editing']) => void;
  setCurrentCopyId: (id: string) => void;
};

export const useWorkflowState = create<State & Action>(set => ({
  runSheetOpen: false,
  editing: false,
  importDialogOpen: false,
  currentCopyId: '',
  setRunSheetOpen: runSheetOpen => set(() => ({ runSheetOpen })),
  setEditing: editing => set(() => ({ editing })),
  setCurrentCopyId: (id: string) => set(() => ({ currentCopyId: id })),
}));
