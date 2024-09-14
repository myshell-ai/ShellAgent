import {
  Connection,
  CustomHandle,
  HandleProps,
  NodeIdEnum,
  Position,
  getColor,
} from '@shellagent/flow-engine';
import { Text } from '@shellagent/ui';
import { entries, get, map } from 'lodash-es';

import { CustomEdgeType } from '@/components/workflow/custom-edge';
import { useSchemaContext } from '@/stores/workflow/schema-provider';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';
import { cn } from '@/utils/cn';

interface ICustomPoint {
  className?: string;
  style?: React.CSSProperties;
}

export const CustomPoint: React.FC<ICustomPoint> = ({ className, style }) => {
  return (
    <div
      className={`w-3 h-3 rounded-full pointer-events-none ${className}`}
      style={style}
    />
  );
};

interface RenderListProps extends Omit<HandleProps, 'onConnect'> {
  id: string;
  variable: object;
  onConnect: (connection: Connection, type: string) => void;
}

const RenderList = ({
  id,
  variable,
  onConnect,
  ...handleProps
}: RenderListProps) => {
  const isTarget = handleProps.position === Position.Left;
  return (
    <div className="h-full w-1/2">
      {map(entries(variable), ([name, value]) => {
        return (
          <div
            key={`${id}-${name}-inputs`}
            className={cn('relative flex', { 'justify-end': !isTarget })}>
            <CustomHandle
              id={name}
              className={cn(
                '!w-3 !h-3 z-[1] absolute !top-3 !bg-transparent !rounded-none !outline-none',
                isTarget ? '!left-0' : ' !right-0',
              )}
              onConnect={connection => onConnect(connection, value)}
              {...handleProps}>
              <CustomPoint
                style={{
                  backgroundColor: getColor(value),
                }}
              />
            </CustomHandle>
            <Text className={cn(isTarget ? 'ml-6' : 'mr-6')}>{name}</Text>
          </div>
        );
      })}
    </div>
  );
};

function VariableNode() {
  const { flowInstance, fieldTypes } = useWorkflowStore(state => ({
    fieldTypes: state.fieldTypes,
    flowInstance: state.flowInstance,
  }));
  const { id, inputRefTypes, outputRefTypes } = useSchemaContext(state => ({
    id: state.id,
    inputRefTypes: state.inputRefTypes,
    outputRefTypes: state.outputRefTypes,
  }));
  const isValidConnection = (connection: Connection) => {
    if (connection.source === connection.target) {
      return false;
    }
    return true;
  };
  const onConnect = (connection: Connection, type: string) => {
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
      const sourceType =
        connection.source && connection.sourceHandle
          ? get(fieldTypes, [
              connection.source,
              'outputs',
              connection?.sourceHandle,
            ])
          : '';

      const currentIdx = edges.findIndex(
        item =>
          item.target === connection.target &&
          item.targetHandle === connection.targetHandle &&
          item.source === connection.source &&
          item.sourceHandle === connection.sourceHandle,
      );

      if (targetType !== sourceType && connection.target !== NodeIdEnum.end) {
        edges?.splice(currentIdx, 1);
        flowInstance?.setEdges(edges);
      } else {
        edges[currentIdx] = {
          ...edges[currentIdx],
          style: {
            ...edges[currentIdx]?.style,
            stroke: getColor(type),
          },
          type: CustomEdgeType,
        };
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
        flowInstance?.setEdges(edges);
      }
    });
  };
  return (
    <div className="w-full h-full flex justify-between">
      <RenderList
        id={id}
        type="target"
        position={Position.Left}
        variable={inputRefTypes}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      />
      <RenderList
        id={id}
        type="source"
        position={Position.Right}
        variable={outputRefTypes}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      />
    </div>
  );
}
export { VariableNode };
