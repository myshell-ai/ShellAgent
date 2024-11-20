'use client';

import '../../reflect-metadata-client-side';
import { FlowEngine, FlowRef } from '@shellagent/flow-engine';
import { enableMapSet } from 'immer';
import { useInjection } from 'inversify-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useShallow } from 'zustand/react/shallow';

import { edgeTypes, materialList, nodeTypes } from '@/components/app/constants';
import FlowHeader from '@/components/app/flow-header';
import { Header } from '@/components/app/header';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { ListFooterExtra } from '@/components/common/list-footer-extra';
import { ImageCanvasDialog } from '@/components/image-canvas/open-image-canvas';
import { useAppStore } from '@/stores/app/app-provider';
import { useAppState } from '@/stores/app/use-app-state';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

enableMapSet();

const StateConfigSheet = dynamic(
  () => import('@/components/app/state-config-sheet'),
  {
    ssr: false,
  },
);

const TransitionSheet = dynamic(
  () => import('@/components/app/transition-sheet'),
  {
    ssr: false,
  },
);

const ChatSheet = dynamic(() => import('@/components/app/chat-sheet'), {
  ssr: false,
});

export default function AppBuilderDetail() {
  const params = useSearchParams();
  const flowRef = useRef<FlowRef>(null);
  const flowInstance = flowRef.current?.getFlowInstance();
  const appBuilderChatModel = useInjection(AppBuilderChatModel);

  const appId = params.get('id') as string;
  const version_name = params.get('version_name') as string;

  const { setFlowInstance, getReactFlow, loading, getAutomata, getFlowList } =
    useAppStore(
      useShallow(state => ({
        setFlowInstance: state.setFlowInstance,
        getReactFlow: state.getReactFlow,
        loading: state.loading,
        getAutomata: state.getAutomata,
        getFlowList: state.getFlowList,
      })),
    );

  const getWidgetList = useWorkflowStore(state => state.getWidgetList);

  const { resetState } = useAppState();

  // 初始化reactflow
  useEffect(() => {
    if (flowInstance) {
      setFlowInstance(flowInstance);
      getReactFlow({ app_id: appId, version_name }, flowInstance);
    }
  }, [flowInstance, appId, version_name]);

  useEffect(() => {
    appBuilderChatModel.closeRunDrawer();
  }, [appId]);

  useEffect(() => {
    getAutomata({ app_id: appId, version_name });
    getWidgetList({});
    getFlowList({ type: 'workflow' });
  }, [appId, version_name]);

  // 退出页面初始化状态
  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col bg-surface">
        <header>
          <Header />
        </header>
        <main
          id="workflow"
          style={{ height: 'calc(100vh - 60px)', position: 'relative' }}>
          <FlowEngine
            listLoading={false}
            loading={loading.getAutomata || loading.getReactFlow}
            ref={flowRef}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            materialList={materialList}
            footerExtra={<ListFooterExtra />}
            header={
              <>
                <FlowHeader appId={appId} version_name={version_name} />
                <StateConfigSheet />
                <TransitionSheet />
              </>
            }
          />
          <ChatSheet />
          <ImageCanvasDialog />
        </main>
      </div>
    </DndProvider>
  );
}
