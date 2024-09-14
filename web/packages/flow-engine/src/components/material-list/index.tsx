import MagnifyingGlassIcon from '@heroicons/react/24/outline/esm/MagnifyingGlassIcon';
import {
  ArrowLineLeft,
  ArrowLineRight,
  IconButton,
  Text,
  SearchBar,
  Plus,
  Popover,
  Accordion,
  AccordionItem,
  Spinner,
} from '@shellagent/ui';
import { useHover } from 'ahooks';
import clsx from 'clsx';
import React, { useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

import { DRAGGABLE_NODE_ID } from '../../constants';
import { useReactFlowStore } from '../../store/flow/provider';
import { useFlowState, CollapseEnum } from '../../store/flow-state/provider';
import {
  DraggableNodeType,
  MaterialListType,
  WidgetItem,
  MaterialItem,
  NodeTypeEnum,
} from '../../types';
import { getCanvasCenter } from '../../utils';

const DraggableTreeNode: React.FC<{ data: WidgetItem }> = ({ data }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag<DraggableNodeType>(() => ({
    type: DRAGGABLE_NODE_ID,
    item: {
      name: data.name,
      icon: data.icon,
      nodeType: data.type || NodeTypeEnum.widget,
      display_name: data.display_name,
      undraggable: data.undraggable,
    },
  }));

  const { onAddNode, reactFlowWrapper, viewport } = useReactFlowStore(
    state => ({
      onAddNode: state.onAddNode,
      reactFlowWrapper: state.reactFlowWrapper,
      viewport: state.viewport,
    }),
  );

  const hover = useHover(nodeRef);

  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);

  const handleAddNode = () => {
    const position = getCanvasCenter(reactFlowWrapper, viewport);
    if (!data.undraggable) {
      onAddNode({
        type: data.type || NodeTypeEnum.widget,
        position,
        data: {
          name: data.name,
          display_name: data.display_name,
          icon: data.name,
        },
      });
    }
  };

  return (
    <div
      className="w-full bg-surface-default p-1.5 rounded-md hover:bg-surface-hovered"
      ref={dragRef}>
      <Popover
        triggerClassName="w-full"
        open={hover}
        side="right"
        content={data?.desc || data.name}>
        <div
          ref={nodeRef}
          onClick={handleAddNode}
          className="!w-full flex items-center !justify-start">
          {data?.icon && (
            <img
              alt="icon"
              src={data?.icon || ''}
              className="flex-shrink-0 w-8 h-8 rounded-md "
            />
          )}
          <Text
            size="sm"
            weight="regular"
            className="text-ellipsis overflow-hidden whitespace-nowrap">
            {data.display_name}
          </Text>
          <Plus
            className={clsx('h-4.5 w-4.5 hidden ml-auto cursor-pointer', {
              block: hover && !data.undraggable,
            })}
          />
        </div>
      </Popover>
    </div>
  );
};

DraggableTreeNode.displayName = 'DraggableTreeNode';

const CollaspeItem = ({ data }: { data: MaterialItem }) => {
  return (
    <div
      className={clsx('border-b border-default pb-1.5', {
        '!border-none': data.no_border,
        '!pb-0.5': data.no_border,
      })}>
      {!data.plain ? (
        <Accordion
          type="single"
          collapsible
          defaultValue={data.items?.[0]?.name}>
          <div className="p-1.5 w-full text-subtler text-xs text-ellipsis overflow-hidden">
            {data?.title}
          </div>
          {data.items?.map((item, idx) => (
            <AccordionItem
              // eslint-disable-next-line react/no-array-index-key
              key={`${item.name}-item-${idx}`}
              label={item.name}
              value={item.name}>
              <div className="flex flex-col gap-0.5 pl-[18px] pr-1">
                {item.children ? (
                  item.children?.map(child => (
                    <DraggableTreeNode key={child.name} data={child} />
                  ))
                ) : (
                  <DraggableTreeNode data={item} />
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col gap-0.5 pr-1">
          {data?.title ? (
            <div className="p-1.5 w-full text-subtler text-xs text-ellipsis overflow-hidden">
              {data?.title}
            </div>
          ) : null}
          {data.items?.map(item => (
            <DraggableTreeNode key={item.name} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const MaterialList: React.FC<{
  data: MaterialListType;
  loading?: boolean;
  extra: React.ReactNode;
}> = ({ data = [], loading = true, extra }) => {
  const { siderOpen, setSiderOpen } = useFlowState(state => ({
    siderOpen: state.siderOpen,
    setSiderOpen: state.setSiderOpen,
  }));
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredList = useMemo<MaterialListType>(() => {
    if (!searchValue) return data;

    const lowerCaseSearchValue = searchValue.toLowerCase();

    return data.reduce<MaterialListType>((acc, item) => {
      const filteredItems = item.items.reduce<WidgetItem[]>(
        (widgetAcc, widgetItem) => {
          const filteredChildren = widgetItem.children?.filter(
            child =>
              child.name.toLowerCase().includes(lowerCaseSearchValue) ||
              child.display_name?.toLowerCase()?.includes(lowerCaseSearchValue),
          );

          if (filteredChildren && filteredChildren.length > 0) {
            widgetAcc.push({ ...widgetItem, children: filteredChildren });
          } else if (
            widgetItem.name.toLowerCase().includes(lowerCaseSearchValue)
          ) {
            widgetAcc.push(widgetItem);
          }

          return widgetAcc;
        },
        [],
      );

      if (filteredItems.length > 0) {
        acc.push({ ...item, items: filteredItems });
      }

      return acc;
    }, []);
  }, [data, searchValue]);

  if (siderOpen === CollapseEnum.close) {
    return (
      <IconButton
        variant="outline"
        icon={ArrowLineRight}
        onClick={() => setSiderOpen(CollapseEnum.open)}
        className="w-9 h-9 fixed left-4 top-1/2 transform -translate-y-1/2  border-none bg-surface-default z-50 active:shadow-none"
      />
    );
  }

  return (
    <div className="h-full w-full bg-surface-default flex flex-col px-3 pt-3">
      <div className="mb-2 px-1.5 flex-shrink-0">
        <SearchBar
          className="h-7 text-sm"
          placeholder="Search Widgets"
          onSearchChange={handleSearch}
        />
      </div>
      <div className="flex-1 space-y-1.5 overflow-auto no-scrollbar">
        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner className="text-brand" />
          </div>
        )}
        {!loading && filteredList.length === 0 && (
          <div className="flex flex-col items-center text-center py-16">
            <div className="mb-2">
              <MagnifyingGlassIcon className="h-8 w-8 text-subtlest" />
            </div>
            <div className="mb-1">
              <Text weight="semibold">Nothing found</Text>
            </div>
            <Text size="sm" color="subtlest">
              We couldn&apos;t find anything with this criteria
            </Text>
          </div>
        )}
        {!loading && filteredList.length > 0
          ? filteredList?.map((item, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <CollaspeItem key={`${item.title}-${idx}`} data={item} />
            ))
          : null}
      </div>
      <footer className="flex items-center flex-shrink-0 h-12 py-3">
        <IconButton
          variant="ghost"
          className="w-9 h-9"
          size="md"
          icon={ArrowLineLeft}
          onClick={() => setSiderOpen(CollapseEnum.close)}
        />
        {extra}
      </footer>
    </div>
  );
};

export default MaterialList;
