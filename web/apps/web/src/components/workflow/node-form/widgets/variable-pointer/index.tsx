import {
  Connection,
  CustomHandle,
  HandleProps,
  NodeIdEnum,
  Position,
  getColor,
} from '@shellagent/flow-engine';
import { useFormContext } from '@shellagent/ui';
import { get } from 'lodash-es';

import { CustomEdgeType } from '@/components/workflow/custom-edge';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { cn } from '@/utils/cn';

import { CustomPoint } from '../variable-node';

const typeMap: Record<string, string> = {
  unknown: 'unknown',
  text: 'string',
  image: 'string',
  audio: 'string',
  video: 'string',
  text_file: 'string',
  file: 'string',
};
interface VariablePointerProps extends HandleProps {
  name: string;
  className?: string;
}

function VariablePointer({
  name,
  type,
  className,
  ...handleProps
}: VariablePointerProps) {
  const isTarget = type === 'target';
  const { flowInstance, fieldTypes, nodeData } = useWorkflowStore(state => ({
    flowInstance: state.flowInstance,
    fieldTypes: state.fieldTypes,
    nodeData: state.nodeData,
  }));
  const { getValues } = useFormContext();
  const colorType: string = getValues(name)?.type
    ? typeMap[getValues(name)?.type]
    : '';

  const onConnect = (connection: Connection, variableType: string) => {
    setTimeout(() => {
      const edges = flowInstance?.getEdges() || [];
      const targetType =
        connection.target && connection.targetHandle
          ? get(fieldTypes, [
              connection.target,
              'inputs',
              connection?.targetHandle,
            ])
          : '';
      let sourceType =
        connection.source && connection.sourceHandle
          ? get(fieldTypes, [
              connection.source,
              'outputs',
              connection?.sourceHandle,
            ])
          : '';
      if (connection.source === NodeIdEnum.start) {
        if (connection.sourceHandle?.startsWith('input.')) {
          sourceType =
            typeMap[
              get(nodeData, [
                connection.source,
                ...connection.sourceHandle.split('.'),
                'type',
              ])
            ];
        } else if (connection.sourceHandle?.startsWith('context.')) {
          sourceType =
            typeMap[
              get(nodeData, [
                connection.source,
                ...connection.sourceHandle
                  .replace('.value', '.type')
                  .split('.'),
              ])
            ];
        }
      }
      const currentIdx = edges.findIndex(
        item =>
          item.target === connection.target &&
          item.targetHandle === connection.targetHandle &&
          item.source === connection.source &&
          item.sourceHandle === connection.sourceHandle,
      );
      if (targetType !== sourceType) {
        const edges = flowInstance?.getEdges() || [];
        const deleteIdx = edges.findIndex(
          item =>
            item.target === connection.target &&
            item.targetHandle === connection.targetHandle &&
            (item.source !== connection.source ||
              item.sourceHandle !== connection.sourceHandle),
        );
        if (edges && deleteIdx !== -1) {
          edges?.splice(deleteIdx, 1);
        }
        edges[currentIdx] = {
          ...edges[currentIdx],
          style: {
            ...edges[currentIdx]?.style,
            stroke: getColor(variableType),
          },
          type: CustomEdgeType,
        };
        flowInstance?.setEdges(edges);
      }
    });
  };

  return (
    <div
      key={`${name}-inputs`}
      className={cn(
        'relative flex w-3 h-7',
        { 'justify-end': !isTarget },
        className,
      )}>
      <CustomHandle
        id={name}
        type={type}
        className={cn(
          '!w-3 !h-3 z-[1] absolute !top-3 pt-px !bg-transparent !rounded-none !outline-none',
          isTarget ? '!left-0' : ' !right-0',
        )}
        onConnect={connection => onConnect(connection, colorType)}
        {...handleProps}>
        <CustomPoint
          style={{
            backgroundColor: getColor(colorType),
          }}
        />
      </CustomHandle>
    </div>
  );
}

interface TargetVariablePointerProps {
  name: string;
}

const TargetVariablePointer = ({ name }: TargetVariablePointerProps) => {
  return <VariablePointer name={name} type="target" position={Position.Left} />;
};

interface SourceVariablePointerProps {
  name: string;
}

const SourceVariablePointer = ({ name }: SourceVariablePointerProps) => {
  return (
    <VariablePointer name={name} type="source" position={Position.Right} />
  );
};

export { TargetVariablePointer, SourceVariablePointer };
