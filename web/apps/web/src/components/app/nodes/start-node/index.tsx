import {
  NodeProps,
  NodeIdEnum,
  StartNode as StartNodeType,
  SourceHandle,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import React, { useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import NodeCard from '@/components/app/node-card';
import NodeForm from '@/components/app/node-form';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';

const StartNode: React.FC<NodeProps<StartNodeType>> = observer(
  ({ id, selected, data }) => {
    const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

    const edges = useReactFlowStore(state => state.edges);

    const onChange = useCallback(
      (values: TValues) => {
        appBuilder.setNodeData({ id: NodeIdEnum.start, data: values });
      },
      [appBuilder.setNodeData],
    );

    const onModeChange = useCallback(
      (name: string, mode: TFieldMode) => {
        appBuilder.setFieldsModeMap({ id, name, mode });
      },
      [id, appBuilder.setFieldsModeMap],
    );

    // 只能连接一个state节点
    const isConnectable = useMemo(() => {
      return edges.some(edge => edge.source === id) === false;
    }, [edges]);

    return (
      <>
        <NodeCard selected={selected} {...data}>
          <NodeForm
            loading={appBuilder.loading.getAutomata}
            values={appBuilder.nodeData[data.id] || {}}
            onChange={onChange}
            onModeChange={onModeChange}
            modeMap={appBuilder.config.fieldsModeMap?.[data.id] || {}}
          />
        </NodeCard>
        <SourceHandle isConnectable={isConnectable} id={id} />
      </>
    );
  },
);

export default StartNode;
