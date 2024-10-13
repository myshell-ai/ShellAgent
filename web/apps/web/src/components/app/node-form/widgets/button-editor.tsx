import PlusIcon from '@heroicons/react/24/outline/esm/PlusIcon';
import { Button as ButtonType } from '@shellagent/pro-config';
import { Button, XMark, IconButton, useFormContext } from '@shellagent/ui';
import { useHover } from 'ahooks';
import clsx from 'clsx';
import { useRef } from 'react';

import { useAppState } from '@/stores/app/use-app-state';
import { generateUUID } from '@/utils/common-helper';

export interface IButtonType extends ButtonType {
  id: string;
}
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

  const handleAddButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const id = generateUUID() as Lowercase<string>;
    onChange([
      ...(value || []),
      {
        content: 'Untitled',
        on_click: { event: id, payload: {} },
        id,
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
