import { IFlow, useReactFlowStore } from '@shellagent/flow-engine';
import { Text } from '@shellagent/ui';
import { useDebounce, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useInjection } from 'inversify-react';
import { isEmpty, pick } from 'lodash-es';
import React, { useCallback, useMemo, useState, useEffect, memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { AppBuilderModel } from '@/components/app/app-builder.model';
import { usePasteState } from '@/components/app/nodes/state-node/hook/use-paste-state';
import { saveApp } from '@/services/app';
import { useAppStore } from '@/stores/app/app-provider';
import { genAutomata } from '@/stores/app/utils/data-transformer';
import { isDeepEmpty } from '@/utils/common-helper';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const FlowHeader: React.FC<{ appId: string; version_name: string }> = ({
  appId,
  version_name,
}) => {
  const [autoSavedTime, setAutoSavedTime] = useState('');
  const [autoSavedSuccess, setAutoSavedSuccess] = useState(true);
  const { config, nodeData, flowInstance, loading, setRefs } = useAppStore(
    useShallow(state => ({
      config: state.config,
      nodeData: state.nodeData,
      flowInstance: state.flowInstance,
      loading: state.loading,
      setRefs: state.setRefs,
    })),
  );

  const appBuilder = useInjection(AppBuilderModel);

  const { nodes, edges, viewport } = useReactFlowStore(state => ({
    nodes: state.nodes,
    edges: state.edges,
    viewport: state.viewport,
  }));

  useEffect(() => {
    (window as any).nodeData = nodeData;
    appBuilder.updateScopes(nodeData, edges);
  }, [nodeData, edges]);

  useEffect(() => {
    setRefs(appBuilder.refs);
  }, [appBuilder.refs]);

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
  const isDev = process.env.NEXT_PUBLIC_DEVELOPMENT === 'yes';
  const debouncedValues = useDebounce(values, {
    wait: isDev ? 120 * 1000 : 1500,
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
    if (!version_name && !loading.getAutomata && !loading.getReactFlow) {
      handleAutoSave();
    }
  }, [debouncedValues, version_name]);

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
