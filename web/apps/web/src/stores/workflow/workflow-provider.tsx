'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import { type WorkflowStore, createWorkflowStore } from './workflow-store';

export type WorkflowStoreApi = ReturnType<typeof createWorkflowStore>;

export const WorkflowStoreContext = createContext<WorkflowStoreApi | undefined>(
  undefined,
);

export interface WorkflowStoreProviderProps {
  children: ReactNode;
}

export const WorkflowStoreProvider = ({
  children,
}: WorkflowStoreProviderProps) => {
  const storeRef = useRef<WorkflowStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createWorkflowStore();
  }

  return (
    <WorkflowStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkflowStoreContext.Provider>
  );
};

export const useWorkflowStore = <T,>(
  selector: (store: WorkflowStore) => T,
): T => {
  const workflowStoreContext = useContext(WorkflowStoreContext);

  if (!workflowStoreContext) {
    throw new Error(
      `useWorkflowStore must be used within WorkflowStoreProvider`,
    );
  }

  return useStore(workflowStoreContext, selector);
};
