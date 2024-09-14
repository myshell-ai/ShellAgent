import CheckCircleIcon from '@heroicons/react/24/outline/esm/CheckCircleIcon';
import XCircleIcon from '@heroicons/react/24/outline/esm/XCircleIcon';
import { NodeData, NodeStatusEnum } from '@shellagent/flow-engine';
import { Heading, Spinner, Text } from '@shellagent/ui';
import { useHover } from 'ahooks';
import clsx from 'clsx';
import React, { useRef } from 'react';

import { SchemaProvider } from '@/stores/workflow/schema-provider';

import { ContextMenu } from '../context-menu';

const NodeCard: React.FC<
  NodeData & {
    children: React.ReactNode;
    selected?: boolean;
    mode?: string;
  }
> = ({ id, children, runtime_data, selected, name, display_name, mode }) => {
  const selectRef = useRef(null);
  const active = useHover(selectRef);
  const isUndefined = mode === 'undefined';

  return (
    <div
      ref={selectRef}
      className={clsx(
        'w-[500px] min-w-[480px] relative p-3 bg-white rounded-xl shadow flex-col justify-center items-start gap-3 inline-flex border border-transparent',
        {
          '!border-brand': (active || selected) && !runtime_data?.node_status,
        },
        {
          '!border-success':
            runtime_data?.node_status === NodeStatusEnum.succeeded,
        },
        {
          '!border-critical':
            runtime_data?.node_status === NodeStatusEnum.failed || isUndefined,
        },
        {
          '!border-brand': runtime_data?.node_status === NodeStatusEnum.start,
        },
        {
          '!bg-surface-critical-subtle-default': isUndefined,
        },
      )}>
      <main className="w-full h-full">
        <SchemaProvider
          id={id}
          name={name}
          display_name={display_name}
          output={runtime_data?.output}>
          <ContextMenu>
            {isUndefined ? (
              <div className="pb-2">
                <Heading size="h1" color="critical">
                  Undefined Widget
                </Heading>
                <Text color="critical">
                  Replace it with installed widgets, or contact us to add it to
                  the standard environment.
                </Text>
              </div>
            ) : null}
            {children}
          </ContextMenu>
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
  );
};

export default NodeCard;
