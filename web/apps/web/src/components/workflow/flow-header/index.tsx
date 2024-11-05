import { IFlow, useReactFlowStore } from '@shellagent/flow-engine';
import { Text } from '@shellagent/ui';
import { useDebounce, useRequest, useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty, pick } from 'lodash-es';
import React, { useCallback, useMemo, useState, memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { saveWorkflow } from '@/services/workflow';
import { genWorkflow } from '@/stores/workflow/utils/data-transformer';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { isDeepEmpty } from '@/utils/common-helper';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const FlowHeader: React.FC<{ flowId: string; version_name?: string }> = ({
  flowId,
  version_name,
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
    if (!version_name && !loading.getProConfig && !loading.getReactFlow) {
      handleAutoSave();
    }
  }, [debouncedValues]);

  return (
    <div className="absolute right-3 w-full text-right z-10">
      <div className="h-5">
        {autoSavedTime && !version_name && autoSavedSuccess ? (
          <Text size="sm" color="subtlest">
            Auto Saved {dayjs(autoSavedTime).format('HH:mm:ss')}
          </Text>
        ) : null}
        {!autoSavedSuccess ? (
          <Text size="sm" color="critical">
            Auto Saved Error
          </Text>
        ) : null}
        {version_name ? (
          <Text size="sm" color="subtlest">
            Current preview version: {version_name}
          </Text>
        ) : null}
      </div>
    </div>
  );
};

export default memo(FlowHeader);
