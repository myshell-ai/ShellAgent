import { useLocalStorageState } from 'ahooks';
import React, { type ReactNode, useMemo } from 'react';
import { useContextSelector, createContext } from 'use-context-selector';

export enum CollapseEnum {
  open = 1,
  close = 0,
}

export type FlowState = {
  siderOpen?: CollapseEnum;
};

export type FlowAction = {
  setSiderOpen: (open: CollapseEnum) => void;
};

export type FlowStore = FlowState & FlowAction;

export interface FlowStateProviderProps {
  children: ReactNode;
}

export const EMPTY = (): void => undefined;

export const FlowStateContext = createContext<FlowStore>({
  siderOpen: CollapseEnum.open,
  setSiderOpen: EMPTY,
});

export const FlowStateProvider = ({ children }: FlowStateProviderProps) => {
  const [siderOpen, setSiderOpen] = useLocalStorageState(
    'materialListCollapse',
    {
      defaultValue: CollapseEnum.open,
    },
  );

  const storeValue = useMemo<FlowStore>(
    () => ({
      siderOpen,
      setSiderOpen,
    }),
    [siderOpen, setSiderOpen],
  );

  return (
    <FlowStateContext.Provider value={storeValue}>
      {children}
    </FlowStateContext.Provider>
  );
};

export const useFlowState = <T,>(selector: (store: FlowStore) => T): T => {
  return useContextSelector(FlowStateContext, selector);
};
