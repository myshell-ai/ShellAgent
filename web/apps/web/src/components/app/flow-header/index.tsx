import { IFlow, useReactFlowStore } from '@shellagent/flow-engine';
import { Text } from '@shellagent/ui';
import { useDebounce, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useInjection } from 'inversify-react';
import { isEmpty, pick } from 'lodash-es';
import React, { useCallback, useMemo, useState, useEffect, memo } from 'react';

import { usePasteState } from '@/components/app/nodes/state-node/hook/use-paste-state';
import { saveApp } from '@/services/app';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { genAutomata } from '@/stores/app/utils/data-transformer';
import { isDeepEmpty } from '@/utils/common-helper';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const FlowHeader = ({
  appId,
  versionName,
}: {
  appId: string;
  versionName: string;
}) => {
  const [autoSavedTime, setAutoSavedTime] = useState('');
  const [autoSavedSuccess, setAutoSavedSuccess] = useState(true);

  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const { nodes, edges, viewport } = useReactFlowStore(state => ({
    nodes: state.nodes,
    edges: state.edges,
    viewport: state.viewport,
  }));

  const values = useMemo(() => {
    return {
      appId,
      config: appBuilder.config,
      nodeData: appBuilder.nodeData,
      nodes,
      edges,
      viewport,
    };
  }, [appId, appBuilder.nodeData, appBuilder.config, nodes, edges, viewport]);

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
    const reactflow: IFlow = appBuilder.flowInstance?.toObject() as IFlow;

    if ((!isEmpty(reactflow?.edges) || !isEmpty(reactflow?.nodes)) && appId) {
      const automata = genAutomata(reactflow, appBuilder.nodeData);
      if (!isDeepEmpty(pick(automata, ['blocks', 'context']))) {
        saveData({
          app_id: appId,
          reactflow,
          automata: genAutomata(reactflow, appBuilder.nodeData),
          config: appBuilder.config,
        });
      }
    }
  }, [appId, appBuilder.flowInstance, appBuilder.nodeData, appBuilder.config]);

  useEffect(() => {
    if (
      !versionName &&
      !appBuilder.getAutomataLoading &&
      !appBuilder.fetchFlowListLoading
    ) {
      handleAutoSave();
    }
  }, [debouncedValues, versionName]);

  return (
    <div className="absolute right-3 w-full text-right z-10">
      <div className="h-5">
        {autoSavedTime && !versionName && autoSavedSuccess ? (
          <Text size="sm" color="subtlest">
            Auto Saved {dayjs(autoSavedTime).format('HH:mm:ss')}
          </Text>
        ) : null}
        {!autoSavedSuccess ? (
          <Text size="sm" color="critical">
            Auto Saved Error
          </Text>
        ) : null}
        {versionName ? (
          <Text size="sm" color="subtlest">
            Current preview version: {versionName}
          </Text>
        ) : null}
      </div>
    </div>
  );
};

export default memo(FlowHeader);
