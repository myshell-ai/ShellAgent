'use client';

import '../../reflect-metadata-client-side';
import { FlowEngine, FlowRef } from '@shellagent/flow-engine';
import { enableMapSet } from 'immer';
import { useInjection } from 'inversify-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { materialList, nodeTypes, edgeTypes } from '@/components/app/constants';
import FlowHeader from '@/components/app/flow-header';
import { Header } from '@/components/app/header';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { ListFooterExtra } from '@/components/common/list-footer-extra';
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
      getReactFlow({ app_id: appId }, flowInstance);
    }
  }, [flowInstance, appId]);

  useEffect(() => {
    appBuilderChatModel.closeRunDrawer();
  }, [appId]);

  useEffect(() => {
    getAutomata({ app_id: appId });
    getWidgetList({});
    getFlowList({ type: 'workflow' });
  }, [appId]);

  // 退出页面初始化状态
  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  return (
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
              <FlowHeader appId={appId} />
              <StateConfigSheet />
              <TransitionSheet />
            </>
          }
        />
        <ChatSheet />
      </main>
    </div>
  );
}
