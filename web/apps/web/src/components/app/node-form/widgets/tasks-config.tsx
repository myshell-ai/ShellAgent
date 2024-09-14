import { PlusIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { WidgetItem, uuid } from '@shellagent/flow-engine';
import { Button, useFormContext } from '@shellagent/ui';
import { useClickAway } from 'ahooks';
import { Dropdown } from 'antd';
import { useState, useRef, useCallback } from 'react';

import { materialList } from '@/components/app/constants';
import { TaskList } from '@/components/app/task-list';
import { useAppState } from '@/stores/app/use-app-state';
import { generateUUID } from '@/utils/common-helper';

export interface IWorkflowTask {
  type: 'task';
  display_name: string;
  name: string;
  mode: 'workflow';
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
  mode: 'widget';
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
}: {
  name: string;
  onChange: (value: (IWorkflowTask | IWidgetTask)[]) => void;
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
        mode: task.type === 'workflow' ? 'workflow' : 'widget',
        workflow_id: task.type === 'workflow' ? generateUUID() : undefined,
        widget_name: task.type === 'widget' ? task.name : undefined,
        widget_class_name: task.type === 'widget' ? task.name : undefined,
        inputs: {},
        outputs: {},
      };

      const blocks = Array.isArray(values) ? [...values, newTask] : [newTask];
      onChange(blocks as (IWidgetTask | IWorkflowTask)[]);
    },
    [values, onChange],
  );

  return (
    <>
      {values?.length > 0 && (
        <div className="flex flex-col gap-2 mb-1.5">
          {values.map((task, idx) => (
            <TaskItem
              key={task.name}
              name={task.display_name}
              onDelete={() => handleItemDelete(idx)}
              onClick={() => handleItemClick(idx)}
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
    </>
  );
};

const TaskItem = ({
  name,
  onDelete,
  onClick,
}: {
  name: string;
  onDelete: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        onClick(e);
      }}
      className="group h-8 flex items-center justify-between bg-surface-container-default rounded-lg p-2 text-default font-medium cursor-pointer">
      {name}
      <XMarkIcon
        className="w-4 h-4 hidden group-hover:block"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
      />
    </div>
  );
};

TasksConfig.displayName = 'TasksConfig';

export { TasksConfig };
