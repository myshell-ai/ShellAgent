import { IFlow, useReactFlowStore } from '@shellagent/flow-engine';
import { Text } from '@shellagent/ui';
import { useDebounce, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty, pick } from 'lodash-es';
import React, { useCallback, useMemo, useState, useEffect, memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { usePasteState } from '@/components/app/nodes/state-node/hook/use-paste-state';
import PerformanceMonitor from '@/components/common/performance-monitor';
import { saveApp } from '@/services/app';
import { useAppStore } from '@/stores/app/app-provider';
import { genAutomata } from '@/stores/app/utils/data-transformer';
import { isDeepEmpty } from '@/utils/common-helper';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const FlowHeader: React.FC<{ appId: string }> = ({ appId }) => {
  const [autoSavedTime, setAutoSavedTime] = useState('');
  const [autoSavedSuccess, setAutoSavedSuccess] = useState(true);
  const { config, nodeData, flowInstance, loading } = useAppStore(
    useShallow(state => ({
      config: state.config,
      nodeData: state.nodeData,
      flowInstance: state.flowInstance,
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
      appId,
      config,
      nodeData,
      nodes,
      edges,
      viewport,
    };
  }, [appId, nodeData, config, nodes, edges, viewport]);

  usePasteState({ enabeKeyboard: true });

  const debouncedValues = useDebounce(values, {
    wait: 1500,
  });

  const { run: saveData } = useRequest(saveApp, {
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

  const handleAutoSave = useCallback(async () => {
    const reactflow: IFlow = flowInstance?.toObject() as IFlow;

    if ((!isEmpty(reactflow?.edges) || !isEmpty(reactflow?.nodes)) && appId) {
      const automata = genAutomata(reactflow, nodeData);
      if (!isDeepEmpty(pick(automata, ['blocks', 'context']))) {
        saveData({
          app_id: appId,
          reactflow,
          automata: genAutomata(reactflow, nodeData),
          config,
        });
      }
    }
  }, [appId, flowInstance, nodeData, config]);

  useEffect(() => {
    if (!loading.getAutomata && !loading.getReactFlow) {
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
          {autoSavedTime && autoSavedSuccess ? (
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
