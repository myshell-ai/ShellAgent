import PlusIcon from '@heroicons/react/24/outline/esm/PlusIcon';
import { useReactFlowStore } from '@shellagent/flow-engine';
import { Button as IButtonType } from '@shellagent/shared/protocol/render-button';
import { getButtonDisplayName } from '@shellagent/shared/utils';
import { Button, XMark, IconButton, useFormContext } from '@shellagent/ui';
import { useHover } from 'ahooks';
import clsx from 'clsx';
import { useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useAppState } from '@/stores/app/use-app-state';
import { generateUUID } from '@/utils/common-helper';

interface VariableNodeProps {
  name: string;
  onChange: (value: IButtonType[]) => void;
}

const ButtonItem = ({
  data,
  index,
  onClick,
  onDelete,
  onButtonMove,
}: {
  index: number;
  data: IButtonType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (id: string) => void;
  onButtonMove: (startIndex: number, endIndex: number) => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isHovered = useHover(buttonRef);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'BUTTON',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: true,
  });

  const [, drop] = useDrop<DragItem, void>({
    accept: 'BUTTON',
    hover: (item: DragItem, monitor) => {
      if (!buttonRef.current) {
        // 添加draggable判断
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onButtonMove(dragIndex, hoverIndex);
      console.log(dragIndex, hoverIndex, isDragging);
      item.index = hoverIndex;
    },
  });

  drag(drop(buttonRef));
  preview(drop(buttonRef));

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(data.id);
  };

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
        { '!bg-surface-hovered': isHovered },
      )}>
      <div>{data.content}</div>
      <IconButton
        size="sm"
        icon={XMark}
        type="button"
        onClick={handleDelete}
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

  const { edges, onDelEdge } = useReactFlowStore(state => ({
    edges: state.edges,
    onDelEdge: state.onDelEdge,
  }));

  const handleButtonClick = useCallback(
    (buttonId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setInsideSheetOpen({
        stateId: currentStateId,
        open: true,
        mode: 'button',
        buttonId,
      });
    },
    [currentStateId, setInsideSheetOpen],
  );

  const handleDeleteButton = useCallback(
    (button: IButtonType) => {
      edges.forEach(edge => {
        if (
          edge.source === currentStateId &&
          edge.data?.event_key === button.on_click?.event
        ) {
          onDelEdge({ id: edge.id });
        }
      });
      onChange(value.filter(item => item.id !== button.id));
    },
    [currentStateId, edges, onDelEdge, onChange, value],
  );

  const handleAddButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const content = getButtonDisplayName(value);
      const id = generateUUID() as Lowercase<string>;
      onChange([
        ...(value || []),
        {
          content,
          on_click: { event: id, payload: {} },
          id,
          description: '',
        },
      ]);
    },
    [value, onChange],
  );

  const onButtonMove = useCallback(
    (startIndex: number, endIndex: number) => {
      const result = Array.from(value);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      console.log('value: ', value, startIndex, endIndex, result);
      onChange(result);
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {value?.map?.((button, index) => (
        <ButtonItem
          key={button.id}
          data={button}
          index={index}
          onClick={handleButtonClick(button.id)}
          onDelete={() => handleDeleteButton(button)}
          onButtonMove={onButtonMove}
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

type DragItem = {
  index: number;
};

ButtonEditor.displayName = 'ButtonEditor';

export { ButtonEditor };
