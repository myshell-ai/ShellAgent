import React, { forwardRef, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from 'react-resizable-panels';
import { ReactFlowProvider } from 'reactflow';

import MemoizedFlowDag from '../components/flow-drag';
import MaterialList from '../components/material-list';
import { FlowStoreProvider } from '../store/flow/provider';
import {
  FlowStateProvider,
  useFlowState,
  CollapseEnum,
} from '../store/flow-state/provider';
import { IFlowDagProps, FlowRef } from '../types';
import 'reactflow/dist/style.css';

const PannelLayout = forwardRef<FlowRef, IFlowDagProps>(
  ({ materialList, listLoading, footerExtra, ...props }, ref) => {
    const siderOpen = useFlowState(state => state.siderOpen);
    const siderRef = useRef<ImperativePanelHandle>(null);

    useEffect(() => {
      if (siderOpen === CollapseEnum.open) {
        siderRef.current?.expand();
      } else {
        siderRef.current?.collapse();
      }
    }, [siderOpen]);

    return (
      <PanelGroup
        direction="horizontal"
        className="h-full w-full flex"
        autoSaveId="flowLayout">
        <Panel
          ref={siderRef}
          collapsible={siderOpen === CollapseEnum.close}
          defaultSize={15}
          minSize={15}
          maxSize={50}
          className="h-full flex-shrink-0 border-r-default border-r">
          <MaterialList
            data={materialList || []}
            loading={listLoading}
            extra={footerExtra}
          />
        </Panel>
        <PanelResizeHandle />
        <Panel
          defaultSize={85}
          className="h-full w-full  flex items-center justify-center flex-1 bg-surface-container-default">
          <MemoizedFlowDag ref={ref} {...props} />
        </Panel>
      </PanelGroup>
    );
  },
);

const FlowEngine = forwardRef<FlowRef, IFlowDagProps>((props, ref) => {
  return (
    <ReactFlowProvider>
      <FlowStoreProvider>
        <FlowStateProvider>
          <DndProvider backend={HTML5Backend}>
            <PannelLayout ref={ref} {...props} />
          </DndProvider>
        </FlowStateProvider>
      </FlowStoreProvider>
    </ReactFlowProvider>
  );
});

FlowEngine.displayName = 'FlowEngine';

export default FlowEngine;
