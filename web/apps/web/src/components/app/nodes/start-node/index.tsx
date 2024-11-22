import {
  NodeProps,
  NodeIdEnum,
  StartNode as StartNodeType,
  SourceHandle,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { useInjection } from 'inversify-react';
import React, { useCallback, useMemo } from 'react';

import NodeCard from '@/components/app/node-card';
import NodeForm from '@/components/app/node-form';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';

const StartNode: React.FC<NodeProps<StartNodeType>> = ({
  id,
  selected,
  data,
}) => {
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const edges = useReactFlowStore(state => state.edges);

  const onChange = useCallback(
    (values: TValues) => {
      appBuilder.setNodeData({ id: NodeIdEnum.start, data: values });
    },
    [appBuilder.setNodeData],
  );

  // 只能连接一个state节点
  const isConnectable = useMemo(() => {
    return edges.some(edge => edge.source === id) === false;
  }, [edges]);

  return (
    <>
      <NodeCard selected={selected} {...data}>
        <NodeForm
          loading={appBuilder.getAutomataLoading}
          values={appBuilder.nodeData[data.id] || {}}
          onChange={onChange}
        />
      </NodeCard>
      <SourceHandle isConnectable={isConnectable} id={id} />
    </>
  );
};

export default StartNode;
