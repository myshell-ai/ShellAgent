import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import { CheckDialog } from '@/components/common/check-dialog';
import { ManagerDialog } from '@/components/manager';
import { SettingsDialog } from '@/components/settings/settings';

export enum ManagerTypeEnum {
  widget = 'widget',
  model = 'model',
}

export enum BaseTypeEnum {
  marketplace = 'marketplace',
  installed = 'installed',
}

export type GlobalState = {
  managerDialogOpen: boolean;
  checkDialogOpen: boolean;
  managerType: ManagerTypeEnum;
  baseType: BaseTypeEnum;
};

export type GlobalAction = {
  setManagerDialogOpen: (open: GlobalState['managerDialogOpen']) => void;
  setCheckDialogOpen: (open: GlobalState['checkDialogOpen']) => void;
  setManagerType: (type: GlobalState['managerType']) => void;
  setBaseType: (type: GlobalState['baseType']) => void;
};

export type GlobalStore = GlobalState & GlobalAction;

export const initState: GlobalState = {
  managerDialogOpen: false,
  checkDialogOpen: false,
  managerType: ManagerTypeEnum.widget,
  baseType: BaseTypeEnum.marketplace,
};

export const createGlobalStore = () => {
  return createStore<GlobalStore>()(set => ({
    ...initState,
    setManagerDialogOpen: managerDialogOpen =>
      set(() => ({ managerDialogOpen })),
    setCheckDialogOpen: checkDialogOpen => set(() => ({ checkDialogOpen })),
    setManagerType: managerType => set(() => ({ managerType })),
    setBaseType: baseType => set(() => ({ baseType })),
  }));
};

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(
  undefined,
);

export interface GlobalStoreProviderProps {
  children: ReactNode;
}

export const GlobalStoreProvider = ({ children }: GlobalStoreProviderProps) => {
  const storeRef = useRef<GlobalStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createGlobalStore();
  }
  return (
    <GlobalStoreContext.Provider value={storeRef.current}>
      {children}
      <ManagerDialog />
      <SettingsDialog />
      <CheckDialog />
    </GlobalStoreContext.Provider>
  );
};

export const useGlobalStore = <T,>(selector: (store: GlobalStore) => T): T => {
  const globalStoreContext = useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`);
  }

  return useStore(globalStoreContext, selector);
};
