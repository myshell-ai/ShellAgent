import CheckCircleIcon from '@heroicons/react/24/outline/esm/CheckCircleIcon';
import XCircleIcon from '@heroicons/react/24/outline/esm/XCircleIcon';
import {
  NodeData,
  SourceHandle,
  TargetHandle,
  NodeStatusEnum,
} from '@shellagent/flow-engine';
import { Spinner } from '@shellagent/ui';
import { useHover } from 'ahooks';
import clsx from 'clsx';
import React, { useRef } from 'react';

import { SchemaProvider } from '@/stores/workflow/schema-provider';
import { VariableProvider } from '@/stores/workflow/variable-provider';

const NodeCard: React.FC<
  NodeData & {
    targetHandle?: string;
    sourceHandle?: string;
    children: React.ReactNode;
    selected?: boolean;
  }
> = ({
  id,
  children,
  targetHandle,
  sourceHandle,
  runtime_data,
  selected,
  name,
  display_name,
}) => {
  const selectRef = useRef(null);
  const active = useHover(selectRef);

  return (
    <div
      ref={selectRef}
      className={clsx(
        'w-[500px] min-w-[480px] relative p-3 bg-white rounded-xl shadow flex-col justify-center items-start gap-3 inline-flex border border-transparent',
        {
          '!border-hovered': (active || selected) && !runtime_data?.node_status,
        },
        {
          '!border-success':
            runtime_data?.node_status === NodeStatusEnum.succeeded,
        },
        {
          '!border-critical':
            runtime_data?.node_status === NodeStatusEnum.failed,
        },
        {
          '!border-brand': runtime_data?.node_status === NodeStatusEnum.start,
        },
      )}>
      <main className="w-full h-full">
        <SchemaProvider
          display_name={display_name}
          name={name}
          id={id}
          output={runtime_data?.output}>
          <VariableProvider id={id}>{children}</VariableProvider>
        </SchemaProvider>
        <div className="absolute top-4 right-3 z-50 w-4 h-4">
          {runtime_data?.node_status === NodeStatusEnum.succeeded && (
            <CheckCircleIcon className="text-icon-success" />
          )}
          {runtime_data?.node_status === NodeStatusEnum.failed && (
            <XCircleIcon className="text-critical" />
          )}
          {runtime_data?.node_status === NodeStatusEnum.start && (
            // TODO joe 进度条
            // runtime_data?.progress ? (
            //   <div>{runtime_data?.progress}</div>
            // ) : <Spinner size="sm" className="text-brand" />
            <Spinner size="sm" className="text-brand" />
          )}
        </div>
        {sourceHandle && <SourceHandle id={sourceHandle} />}
        {targetHandle && <TargetHandle id={targetHandle} />}
      </main>
    </div>
  );
};

export default NodeCard;
