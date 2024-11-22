import PlusIcon from '@heroicons/react/24/outline/esm/PlusIcon';
import { useReactFlowStore } from '@shellagent/flow-engine';
import { Button as IButtonType } from '@shellagent/shared/protocol/render-button';
import { getButtonDisplayName, getEventKey } from '@shellagent/shared/utils';
import { Button, XMark, IconButton, useFormContext } from '@shellagent/ui';
import { useHover } from 'ahooks';
import clsx from 'clsx';
import { useRef } from 'react';

import { useAppState } from '@/stores/app/use-app-state';

interface VariableNodeProps {
  name: string;
  onChange: (value: IButtonType[]) => void;
}

const ButtonItem = ({
  data,
  onClick,
  onDelete,
}: {
  data: IButtonType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (id: string) => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hover = useHover(buttonRef);
  return (
    <Button
      ref={buttonRef}
      onClick={onClick}
      variant="outline"
      color="brand"
      size="sm"
      type="button"
      className={clsx(
        'relative border-default text-subtle rounded-full flex space-x-1.5 justify-between items-center',
        {
          '!bg-surface-hovered': hover,
        },
      )}>
      <div>{data.content}</div>
      <IconButton
        size="sm"
        icon={XMark}
        type="button"
        onClick={e => {
          e.stopPropagation();
          onDelete(data.id);
        }}
        className="h-4.5 w-4.5"
        color="brand"
        variant="ghost"
      />
    </Button>
  );
};

const ButtonEditor = ({ name, onChange }: VariableNodeProps) => {
  const { setInsideSheetOpen, currentStateId } = useAppState(state => state);
  const { getValues } = useFormContext();
  const value = getValues(name) as IButtonType[];

  const edges = useReactFlowStore(state => state.edges);
  const onDelEdge = useReactFlowStore(state => state.onDelEdge);

  const handleAddButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const content = getButtonDisplayName(value);
    const event = getEventKey(content);
    onChange([
      ...(value || []),
      {
        content,
        on_click: { event, payload: {} },
        id: event,
        description: '',
      },
    ]);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {value?.map?.(button => (
        <ButtonItem
          data={button}
          key={button.id}
          onClick={e => {
            e.stopPropagation();
            setInsideSheetOpen({
              stateId: currentStateId,
              open: true,
              mode: 'button',
              buttonId: button.id,
            });
          }}
          onDelete={id => {
            edges.forEach(edge => {
              if (
                edge.source === currentStateId &&
                edge.data?.event_key === button.on_click?.event
              ) {
                onDelEdge({ id: edge.id });
              }
            });

            onChange(value.filter(item => item.id !== id));
          }}
        />
      ))}
      <Button
        icon={PlusIcon}
        onClick={handleAddButton}
        variant="outline"
        size="sm"
        type="button"
        className="w-18 border-default rounded-full">
        Add
      </Button>
    </div>
  );
};

ButtonEditor.displayName = 'ButtonEditor';

export { ButtonEditor };
