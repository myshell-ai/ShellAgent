import CheckCircleIcon from '@heroicons/react/24/outline/esm/CheckCircleIcon';
import XCircleIcon from '@heroicons/react/24/outline/esm/XCircleIcon';
import { NodeData, NodeStatusEnum } from '@shellagent/flow-engine';
import { Heading, Text, Spinner } from '@shellagent/ui';
import { useHover } from 'ahooks';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { SchemaProvider } from '@/stores/app/schema-provider';
import { VariableProvider } from '@/stores/app/variable-provider';

import { ContextMenu } from '../context-menu';

const NodeCard: React.FC<
  NodeData & {
    children: React.ReactNode;
    selected?: boolean;
    className?: string;
  }
> = ({
  id,
  children,
  runtime_data,
  selected,
  name,
  display_name,
  type,
  className,
}) => {
  const selectRef = useRef(null);
  const active = useHover(selectRef);
  const fallbackRender = (props: FallbackProps) => (
    <div>
      <Heading size="h2" color="critical">
        Caught an error
      </Heading>
      <Text size="sm" color="subtler">
        {props.error.toString()}
      </Text>
    </div>
  );
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <div
        ref={selectRef}
        className={clsx(
          'w-[500px] min-w-[480px] relative p-3 bg-white rounded-xl shadow flex-col justify-center items-start gap-3 inline-flex border border-transparent',
          className,
          {
            '!border-brand': (active || selected) && !runtime_data?.node_status,
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
            type={type}
            display_name={display_name}
            name={name}
            id={id}
            output={runtime_data?.output}>
            <VariableProvider id={id}>
              <ContextMenu>{children}</ContextMenu>
            </VariableProvider>
          </SchemaProvider>
          {runtime_data?.node_status ? (
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
          ) : null}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default NodeCard;
