import MicrophoneIcon from '@heroicons/react/24/outline/esm/MicrophoneIcon';
import PlusCircleIcon from '@heroicons/react/24/outline/esm/PlusCircleIcon';
import {
  CustomHandle,
  Position,
  Connection,
  useReactFlowStore,
  getColor,
} from '@shellagent/flow-engine';
import { Button as IButtonType } from '@shellagent/shared/protocol/render-button';
import { IconButton, Button, Text } from '@shellagent/ui';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';

import {
  inputSourceHandle,
  buttonSourceHandle,
} from '@/components/app/constants';
import { EdgeTypeEnum, EdgeDataTypeEnum } from '@/components/app/edges';
import { useSchemaContext } from '@/stores/app/schema-provider';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { useAppState } from '@/stores/app/use-app-state';
import { generateUUID } from '@/utils/common-helper';

const CustomPoint: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => {
  return (
    <div
      style={{
        ...style,
      }}
      className={clsx(
        'w-full h-full pointer-events-none rounded-full',
        className,
      )}
    />
  );
};

const InputPreview = () => {
  const onConnect = useReactFlowStore(state => state.onConnect);
  const id = useSchemaContext(state => state.id);

  const handleId = `${inputSourceHandle}-${id}`;
  const handleConnect = (connection: Connection) => {
    if (connection.source && connection.target) {
      onConnect({
        connect: connection,
        edge: {
          type: EdgeTypeEnum.custom,
          data: {
            id: generateUUID(),
            custom: true,
            type: EdgeDataTypeEnum.CHAT,
            source: connection.source,
            target: connection.target,
            conditions: [],
          },
          style: {
            stroke: getColor(handleId),
          },
        },
      });
    }
  };

  return (
    <div className="relative ">
      <div className="h-10 flex justify-between items-center gap-2 rounded-4xl bg-surface-default border-default border">
        <IconButton
          className="flex-shrink-0"
          variant="ghost"
          color="brand"
          size="md"
          icon={PlusCircleIcon}
        />
        <Text className="flex-1 text-sm text-subtlest">Write a message</Text>
        <IconButton
          className="flex-shrink-0"
          variant="ghost"
          color="brand"
          size="md"
          icon={MicrophoneIcon}
        />
        <CustomHandle
          id={handleId}
          type="source"
          position={Position.Right}
          onConnect={handleConnect}
          className="!w-3 !h-3 z-[99] absolute !bg-transparent !rounded-none !outline-none !border-none">
          <CustomPoint
            style={{
              backgroundColor: getColor(handleId),
            }}
          />
        </CustomHandle>
      </div>
    </div>
  );
};

const ButtonPreview = ({
  index,
  id,
  children,
}: PropsWithChildren<{
  id: string;
  index: number;
}>) => {
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
  const { setInsideSheetOpen } = useAppState(state => state);
  const stateId = useSchemaContext(state => state.id);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setInsideSheetOpen({
      stateId,
      open: true,
      mode: 'button',
      buttonId: id,
    });
  };
  const onConnect = useReactFlowStore(state => state.onConnect);

  const handleId = `${buttonSourceHandle}-${id}#${index}`;

  const handleConnect = (connection: Connection) => {
    if (connection.source && connection.target) {
      const { event: event_key } =
        ((appBuilder.nodeData[stateId]?.render?.buttons as IButtonType[])?.find(
          button => button.id === id,
        )?.on_click as any) || {};

      onConnect({
        connect: connection,
        edge: {
          type: EdgeTypeEnum.custom,
          data: {
            id: generateUUID(),
            custom: true,
            event_key,
            type: EdgeDataTypeEnum.STATE,
            source: connection.source,
            target: connection.target,
            conditions: [],
          },
          style: {
            stroke: getColor(handleId),
          },
        },
      });
    }
  };

  return (
    <Button
      onClickCapture={handleClick}
      variant="outline"
      color="brand"
      size="md"
      className="w-full relative border-default text-subtle">
      <div className="mr-1">{children}</div>
      <CustomHandle
        id={handleId}
        type="source"
        position={Position.Right}
        onConnect={handleConnect}
        className="!w-3 !h-3 absolute right-[-4] translate-x-[-3] z-[99] !bg-transparent !rounded-none !outline-none !border-none">
        <CustomPoint
          style={{
            backgroundColor: getColor(handleId),
          }}
        />
      </CustomHandle>
    </Button>
  );
};

const MessagePreview = () => {
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
  const stateId = useSchemaContext(state => state.id);
  const buttons = (appBuilder.nodeData[stateId]?.render?.buttons ||
    []) as IButtonType[];

  return (
    <div className="flex flex-col gap-3">
      {buttons.length ? (
        <>
          {buttons.map((button, index) => (
            <ButtonPreview key={button.id} id={button.id} index={index}>
              {button.content}
            </ButtonPreview>
          ))}
        </>
      ) : null}
      <InputPreview />
    </div>
  );
};

MessagePreview.displayName = 'MessagePreview';

export { MessagePreview };
