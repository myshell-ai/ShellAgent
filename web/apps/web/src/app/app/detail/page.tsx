'use client';

import '../../reflect-metadata-client-side';
import { FlowEngine, FlowRef } from '@shellagent/flow-engine';
import { customSnakeCase } from '@shellagent/shared/utils';
import { enableMapSet } from 'immer';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { edgeTypes, materialList, nodeTypes } from '@/components/app/constants';
import FlowHeader from '@/components/app/flow-header';
import { Header } from '@/components/app/header';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { ListFooterExtra } from '@/components/common/list-footer-extra';
import { ImageCanvasDialog } from '@/components/image-canvas/open-image-canvas';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { useAppState } from '@/stores/app/use-app-state';

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

interface FlowEngineWrapperProps {
  appId: string;
  versionName: string;
}

const FlowEngineWrapper = observer(
  ({ appId, versionName }: FlowEngineWrapperProps) => {
    const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
    const flowRef = useRef<FlowRef>(null);
    const appBuilderChatModel = useInjection(AppBuilderChatModel);
    const flowInstance = flowRef?.current?.getFlowInstance();

    const { resetState } = useAppState();

    useEffect(() => {
      appBuilderChatModel.closeRunDrawer();
    }, [appId]);

    // 退出页面初始化状态
    useEffect(() => {
      appBuilder.getFlowList({ type: 'workflow' });
      return () => {
        resetState();
      };
    }, []);

    useEffect(() => {
      if (flowInstance) {
        appBuilder.initAppBuilder(flowInstance, appId, versionName);
      }
    }, [flowInstance, appId, versionName]);

    const onDoubleClick: React.MouseEventHandler<HTMLDivElement> = e => {
      if ((e.target as any).className === 'react-flow__pane') {
        const name = 'State';
        const index = Object.values(appBuilder.nodeData).filter(node =>
          node.name?.startsWith(name),
        )?.length;
        const displayName = `${name}${index > 0 ? `#${index + 1}` : '#1'}`;
        const newId = customSnakeCase(displayName) as Lowercase<string>;
        flowInstance?.addNodes({
          id: newId,
          type: 'state',
          position: flowInstance?.project({
            x: e.clientX - 300,
            y: e.clientY - 100,
          }),
          data: {
            id: newId,
            type: 'state',
            name: displayName,
            display_name: displayName,
          },
        });
      }
    };

    return (
      <FlowEngine
        listLoading={false}
        loading={
          appBuilder.initAppBuilderLoading || appBuilder.fetchFlowListLoading
        }
        ref={flowRef}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        materialList={materialList}
        footerExtra={<ListFooterExtra />}
        header={
          <div onDoubleClick={e => e.stopPropagation()}>
            <FlowHeader appId={appId} versionName={versionName} />
            <StateConfigSheet />
            <TransitionSheet />
          </div>
        }
        onDoubleClick={onDoubleClick}
      />
    );
  },
);

export default function AppBuilderDetail() {
  const params = useSearchParams();

  const appId = params.get('id') as string;
  const versionName = params.get('version_name') as string;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col bg-surface">
        <header>
          <Header />
        </header>
        <main
          id="workflow"
          style={{ height: 'calc(100vh - 60px)', position: 'relative' }}>
          <FlowEngineWrapper appId={appId} versionName={versionName} />
          <ChatSheet />
          <ImageCanvasDialog />
        </main>
      </div>
    </DndProvider>
  );
}
