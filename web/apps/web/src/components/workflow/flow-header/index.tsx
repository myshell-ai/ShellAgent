import { IFlow, useReactFlowStore } from '@shellagent/flow-engine';
import { Text } from '@shellagent/ui';
import { useDebounce, useRequest, useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty, pick } from 'lodash-es';
import React, { useCallback, useMemo, useState, memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import PerformanceMonitor from '@/components/common/performance-monitor';
import { saveWorkflow } from '@/services/workflow';
import { genWorkflow } from '@/stores/workflow/utils/data-transformer';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { isDeepEmpty } from '@/utils/common-helper';

import { usePasteState } from '../nodes/widget-node/hook/use-paste-state';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const FlowHeader: React.FC<{ flowId: string; version?: string }> = ({
  flowId,
  version,
}) => {
  const [autoSavedTime, setAutoSavedTime] = useState('');
  const [autoSavedSuccess, setAutoSavedSuccess] = useState(true);
  const { config, nodeData, flowInstance, widgetSchema, loading } =
    useWorkflowStore(
      useShallow(state => ({
        config: state.config,
        nodeData: state.nodeData,
        flowInstance: state.flowInstance,
        widgetSchema: state.widgetSchema,
        loading: state.loading,
      })),
    );

  const { nodes, edges, viewport } = useReactFlowStore(state => ({
    nodes: state.nodes,
    edges: state.edges,
    viewport: state.viewport,
  }));

  const values = useMemo(() => {
    return {
      flowId,
      config,
      nodeData,
      nodes,
      edges,
      viewport,
    };
  }, [flowId, nodeData, config, nodes, edges, viewport]);

  usePasteState({ enabeKeyboard: true });

  const debouncedValues = useDebounce(values, {
    wait: 1500,
  });

  const { run: saveData } = useRequest(saveWorkflow, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        setAutoSavedSuccess(true);
        setAutoSavedTime(dayjs().valueOf());
      } else {
        setAutoSavedSuccess(false);
      }
    },
    onError: () => {
      setAutoSavedSuccess(false);
    },
  });

  // 保存
  const handleAutoSave = useCallback(async () => {
    const reactflow = flowInstance?.toObject() as IFlow;
    const workflow = genWorkflow(
      reactflow,
      nodeData,
      widgetSchema,
      config?.schemaModeMap,
    );

    if (
      !isEmpty(reactflow) &&
      flowId &&
      !isDeepEmpty(pick(workflow, ['blocks', 'context', 'inputs', 'outputs']))
    ) {
      saveData({
        flow_id: flowId,
        reactflow,
        workflow,
        config,
      });
    }
  }, [flowId, flowInstance, nodeData, widgetSchema, config]);

  useUpdateEffect(() => {
    if (!version && !loading.getProConfig && !loading.getReactFlow) {
      handleAutoSave();
    }
  }, [debouncedValues]);

  return (
    <>
      <div className="absolute left-0 bottom-[120px] m-[15px] z-10">
        <PerformanceMonitor />
      </div>
      <div className="absolute right-3 w-full text-right z-10">
        <div className="h-5">
          {autoSavedTime && !version && autoSavedSuccess ? (
            <Text size="sm" color="subtlest">
              Auto Saved {dayjs(autoSavedTime).format('HH:mm:ss')}
            </Text>
          ) : null}
          {!autoSavedSuccess ? (
            <Text size="sm" color="critical">
              Auto Saved Error
            </Text>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default memo(FlowHeader);
