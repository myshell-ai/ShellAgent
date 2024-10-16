'use client';

import { FlowEngine, FlowRef, NodeTypeEnum } from '@shellagent/flow-engine';
import { IconButton, Lego, Setting } from '@shellagent/ui';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import '../../reflect-metadata-client-side';

import FlowHeader from '@/components/workflow/flow-header';
import { Header } from '@/components/workflow/header';
import { EndNode, StartNode, WidgetNode } from '@/components/workflow/nodes';
import { useGlobalStore } from '@/stores/global/global-provider';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

const nodeTypes = {
  [NodeTypeEnum.start]: StartNode,
  [NodeTypeEnum.end]: EndNode,
  [NodeTypeEnum.widget]: WidgetNode,
};

export default function WorkflowPage() {
  const params = useSearchParams();
  const flowRef = useRef<FlowRef>(null);
  const flowInstance = flowRef.current?.getFlowInstance();
  const conRef = useRef<HTMLDivElement>(null);

  const flowId = params.get('id') as string;
  const version = params.get('version') || undefined;

  const setManagerDialogOpen = useGlobalStore(
    state => state.setManagerDialogOpen,
  );

  const {
    setFlowInstance,
    getWidgetList,
    widgetList,
    getProConfig,
    getReactFlow,
    loading,
  } = useWorkflowStore(
    useShallow(state => ({
      setFlowInstance: state.setFlowInstance,
      getWidgetList: state.getWidgetList,
      widgetList: state.widgetList,
      getProConfig: state.getProConfig,
      getReactFlow: state.getReactFlow,
      loading: state.loading,
    })),
  );

  useEffect(() => {
    getWidgetList({});
  }, []);

  // 初始化reactflow
  useEffect(() => {
    if (flowInstance) {
      setFlowInstance(flowInstance);
      getReactFlow({ flow_id: flowId, version_name: version }, flowInstance);
    }
  }, [flowInstance, flowId]);

  useEffect(() => {
    getProConfig({ flow_id: flowId, version_name: version });
  }, [flowId, version]);

  return (
    <div className="h-full flex flex-col bg-surface">
      <header>
        <Header container={conRef.current} />
      </header>
      <main
        ref={conRef}
        id="workflow"
        style={{ height: 'calc(100vh - 60px)', position: 'relative' }}>
        <FlowEngine
          listLoading={loading.getWidgetList}
          loading={loading.getReactFlow || loading.getProConfig}
          ref={flowRef}
          nodeTypes={nodeTypes}
          materialList={widgetList}
          footerExtra={
            <div className="ml-auto flex gap-1">
              <IconButton
                variant="ghost"
                className="w-9 h-9"
                icon={Lego}
                onClick={() => setManagerDialogOpen(true)}
              />
              <IconButton variant="ghost" className="w-9 h-9" icon={Setting} />
            </div>
          }
          header={<FlowHeader flowId={flowId} version={version} />}
        />
      </main>
    </div>
  );
}
