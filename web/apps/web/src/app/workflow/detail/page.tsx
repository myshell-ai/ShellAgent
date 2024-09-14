'use client';

import { FlowEngine, FlowRef, NodeTypeEnum } from '@shellagent/flow-engine';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import '../../reflect-metadata-client-side';

import { ListFooterExtra } from '@/components/common/list-footer-extra';
import CustomEdge, { CustomEdgeType } from '@/components/workflow/custom-edge';
import FlowHeader from '@/components/workflow/flow-header';
import { Header } from '@/components/workflow/header';
import { EndNode, StartNode, WidgetNode } from '@/components/workflow/nodes';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

const nodeTypes = {
  [NodeTypeEnum.start]: StartNode,
  [NodeTypeEnum.end]: EndNode,
  [NodeTypeEnum.widget]: WidgetNode,
};

const edgeTypes = {
  [CustomEdgeType]: CustomEdge,
};

const RunSheet = dynamic(() => import('@/components/workflow/run-sheet'), {
  ssr: false,
});

export default function WorkflowDetail() {
  const router = useRouter();
  const params = useSearchParams();
  const flowRef = useRef<FlowRef>(null);
  const flowInstance = flowRef.current?.getFlowInstance();

  const flowId = params.get('id') as string;
  const version = params.get('version') || undefined;

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

  if (!flowId) {
    router.push('/');
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      <header>
        <Header />
      </header>
      <main
        id="workflow"
        style={{ height: 'calc(100vh - 60px)', position: 'relative' }}>
        <FlowEngine
          listLoading={loading.getWidgetList}
          loading={loading.getReactFlow || loading.getProConfig}
          ref={flowRef}
          nodeTypes={nodeTypes}
          materialList={widgetList}
          edgeTypes={edgeTypes}
          footerExtra={<ListFooterExtra />}
          header={
            <>
              <FlowHeader flowId={flowId} version={version} />
              <RunSheet />
            </>
          }
        />
      </main>
    </div>
  );
}
