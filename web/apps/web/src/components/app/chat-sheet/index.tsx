/** @jsxImportSource @emotion/react */

'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { NodeIdEnum } from '@shellagent/flow-engine';
import { getDefaultValueBySchema, TValues } from '@shellagent/form-engine';
import { Drawer } from '@shellagent/ui';
import { usePrevious } from 'ahooks';
import { useInjection } from 'inversify-react';
import { difference, isEmpty, isEqual, keys, omit } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Resizable } from 'react-resizable';

import { AppBuilderChat } from '@/components/chat/app-builder-chat';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { useAppState } from '@/stores/app/use-app-state';
import { getSchemaByInputs } from '@/stores/workflow/utils/get-run-schema';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

import 'react-resizable/css/styles.css';

const RunSheet: React.FC<{}> = () => {
  const appBuilderChatModel = useInjection(AppBuilderChatModel);

  const { userInputs, setUserInputs, nodeData, loading } = useWorkflowStore(
    state => ({
      userInputs: state.userInputs,
      setUserInputs: state.setUserInputs,
      nodeData: state.nodeData,
      loading: state.loading,
    }),
  );
  const { runDrawerWidth, setRunDrawerWidth } = useAppState(state => ({
    runDrawerWidth: state.runDrawerWidth,
    setRunDrawerWidth: state.setRunDrawerWidth,
  }));

  const inputs = nodeData[NodeIdEnum.start]?.inputs as Record<string, TValues>;
  const runSchema = getSchemaByInputs(inputs);
  const prevInputs = usePrevious(inputs);

  useEffect(() => {
    if (!isEqual(prevInputs, inputs)) {
      const diffKeys = difference(keys(inputs), keys(prevInputs));
      setUserInputs(omit(userInputs, diffKeys));
    }
  }, [inputs, prevInputs]);

  useEffect(() => {
    const defaultValues = getDefaultValueBySchema(runSchema, false);
    if (
      !isEmpty(defaultValues) &&
      isEmpty(userInputs) &&
      !(loading.getProConfig || loading.getReactFlow) &&
      appBuilderChatModel.runOpen
    ) {
      setUserInputs(defaultValues);
    }
  }, [appBuilderChatModel.runOpen, runSchema, loading]);

  return (
    <Resizable
      css={css`
        .resizable-drawer-container {
          position: relative;
          height: 100%;
        }

        .resize-handle {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          cursor: col-resize;
          background-color: transparent;
          transition: background-color 0.3s ease;
        }

        .resize-handle:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .resizable-drawer {
          height: 100%;
        }
      `}
      axis="x"
      width={runDrawerWidth}
      onResize={e => {
        setRunDrawerWidth(
          document.body.offsetWidth - (e as unknown as MouseEvent).clientX,
        );
      }}
      minConstraints={[375, Infinity]}
      maxConstraints={[800, Infinity]}
      handle={<div className="resize-handle" />}>
      <Drawer
        style={{
          transform: 'translateX(-12px) translateY(12px)',
          height: 'calc(100% - 24px)',
        }}
        className="rounded-lg"
        placement="right"
        width={runDrawerWidth}
        mask={false}
        getContainer={false}
        title={
          <span className="flex items-center gap-2">
            Run
            {appBuilderChatModel.previousTasksNumber > 0 && (
              <span className="text-sm text-gray-500">
                (queuing, {appBuilderChatModel.previousTasksNumber} task
                {appBuilderChatModel.previousTasksNumber > 1 ? 's' : ''} ahead)
              </span>
            )}
            {appBuilderChatModel.isRunLoading ? <LoadingOutlined /> : null}
          </span>
        }
        onClose={appBuilderChatModel.closeRunDrawer}
        onClick={(e: any) => e.stopPropagation()}
        open={appBuilderChatModel.runOpen}
        autoFocus={false}
        push={false}>
        <AppBuilderChat />
      </Drawer>
    </Resizable>
  );
};

export default observer(RunSheet);
