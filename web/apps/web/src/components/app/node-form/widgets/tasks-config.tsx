import { PlusIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { WidgetItem, uuid, NodeTypeEnum } from '@shellagent/flow-engine';
import { Button, useFormContext, Drag } from '@shellagent/ui';
import { useClickAway } from 'ahooks';
import { Dropdown } from 'antd';
import { useState, useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { materialList } from '@/components/app/constants';
import { TaskList } from '@/components/app/task-list';
import { useAppState } from '@/stores/app/use-app-state';
import { generateUUID } from '@/utils/common-helper';

export interface IWorkflowTask {
  type: 'task';
  display_name: string;
  name: string;
  mode: NodeTypeEnum.workflow;
  workflow_id: string;
  key: string;
  inputs: {
    [key: string]: string;
  };
  outputs: {
    [key: string]: string;
  };
}

export interface IWidgetTask {
  type: 'task';
  display_name: string;
  name: string;
  mode: NodeTypeEnum.widget;
  widget_name: string;
  widget_class_name: string;
  key: string;
  inputs: {
    [key: string]: string;
  };
  outputs: {
    [key: string]: string;
  };
}

const TasksConfig = ({
  name,
  onChange,
  draggable,
}: {
  name: string;
  onChange: (value: (IWorkflowTask | IWidgetTask)[]) => void;
  draggable?: boolean;
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { getValues } = useFormContext();
  const values = getValues(name) as (IWorkflowTask | IWidgetTask)[];

  const { currentStateId, setInsideSheetOpen } = useAppState(state => state);

  const handleItemDelete = useCallback(
    (idx: number) => {
      const blocks = values.filter((_, index) => index !== idx);
      onChange(blocks);
    },
    [values, onChange],
  );

  const handleItemClick = useCallback(
    (currentTaskIndex: number) => {
      setInsideSheetOpen({
        stateId: currentStateId,
        open: true,
        mode: values[currentTaskIndex]?.mode,
        currentTaskIndex,
      });
    },
    [currentStateId, setInsideSheetOpen, values],
  );

  useClickAway(() => {
    setOpen(false);
  }, btnRef);

  const handleSelect = useCallback(
    (task: WidgetItem) => {
      setOpen(false);
      const newTask = {
        type: 'task',
        display_name: task.display_name,
        name: uuid(), // 需要是key_xxx，作为ref引用
        mode: task.type,
        workflow_id:
          task.type === NodeTypeEnum.workflow ? generateUUID() : undefined,
        widget_name: task.type === NodeTypeEnum.widget ? task.name : undefined,
        widget_class_name:
          task.type === NodeTypeEnum.widget ? task.name : undefined,
        inputs: {},
        outputs: {},
        custom: task.custom,
      };

      const blocks = Array.isArray(values) ? [...values, newTask] : [newTask];
      onChange(blocks as (IWidgetTask | IWorkflowTask)[]);
    },
    [values, onChange],
  );

  const moveTask = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedTask = values[dragIndex];
      const updatedTasks = [...values];
      updatedTasks.splice(dragIndex, 1);
      updatedTasks.splice(hoverIndex, 0, draggedTask);

      onChange(updatedTasks);
    },
    [values, onChange],
  );

  return (
    <div>
      {values?.length > 0 && (
        <div className="flex flex-col gap-2 mb-1.5">
          {values.map((task, idx) => (
            <TaskItem
              key={task.name}
              name={task.display_name}
              onDelete={() => handleItemDelete(idx)}
              onClick={() => handleItemClick(idx)}
              index={idx}
              moveTask={moveTask}
              draggable={draggable} // 传递draggable参数
            />
          ))}
        </div>
      )}
      <Dropdown
        placement="bottomRight"
        trigger={['click']}
        overlayClassName="shadow-modal-default"
        overlayStyle={{ borderRadius: 12, overflow: 'hidden' }}
        getPopupContainer={() => btnRef.current || document.body}
        open={open}
        overlay={
          <div
            onWheelCapture={e => e.stopPropagation()}
            className="w-[200px] max-h-[349px] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <TaskList
              className="rounded-xl"
              data={materialList.slice(1)}
              loading={false}
              onChange={handleSelect}
            />
          </div>
        }>
        <Button
          ref={btnRef}
          icon={PlusIcon}
          onClick={e => {
            e.stopPropagation();
            setOpen(true);
          }}
          variant="outline"
          size="sm"
          type="button"
          className="rounded-lg w-18 border-default">
          Add
        </Button>
      </Dropdown>
    </div>
  );
};

type DragItem = {
  index: number;
};

const TaskItem = ({
  name,
  onDelete,
  onClick,
  index,
  moveTask,
  draggable, // 新增参数
}: {
  name: string;
  onDelete: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  draggable?: boolean; // 新增参数类型
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem, void>({
    accept: 'TASK',
    hover: (item: DragItem, monitor) => {
      if (!dragRef.current || !draggable) {
        // 添加draggable判断
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      const hoverBoundingRect = dragRef.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset() || { x: 0, y: 0 };
      // eslint-disable-next-line no-unsafe-optional-chaining
      const hoverClientY = clientOffset?.y - hoverBoundingRect.top;

      if (
        dragIndex === hoverIndex ||
        (hoverClientY < hoverMiddleY && dragIndex < hoverIndex) ||
        (hoverClientY > hoverMiddleY && dragIndex > hoverIndex)
      ) {
        return;
      }

      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'TASK',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: draggable,
  });

  if (draggable) {
    drag(drop(dragRef));
    preview(drop(previewRef));
  }

  return (
    <div
      ref={previewRef}
      onClick={e => {
        e.stopPropagation();
        onClick(e);
      }}
      className={`relative group h-8 flex items-center bg-surface-container-default rounded-lg p-2 text-default font-medium cursor-pointer ${isDragging ? 'opacity-50' : ''}`}>
      {draggable && (
        <div
          ref={dragRef}
          className="w-6 h-6 flex items-center justify-center cursor-grab">
          <Drag size="md" color="subtle" />
        </div>
      )}
      {name}
      <XMarkIcon
        className="w-4 h-4 hidden group-hover:block ml-auto"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-1 bg-blue-500"
        style={{ display: isDragging ? 'block' : 'none' }}
      />
    </div>
  );
};

TasksConfig.displayName = 'TasksConfig';

export { TasksConfig };
