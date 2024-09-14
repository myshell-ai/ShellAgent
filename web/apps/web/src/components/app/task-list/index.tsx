import MagnifyingGlassIcon from '@heroicons/react/24/outline/esm/MagnifyingGlassIcon';
import {
  MaterialListType,
  WidgetItem,
  MaterialItem,
} from '@shellagent/flow-engine';
import {
  Text,
  SearchBar,
  Plus,
  Accordion,
  AccordionItem,
  Spinner,
} from '@shellagent/ui';
import { useHover } from 'ahooks';
import clsx from 'clsx';
import React, { useMemo, useRef, useState } from 'react';

const TreeNode: React.FC<{
  data: WidgetItem;
  onChange: () => void;
}> = ({ data, onChange }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const hover = useHover(nodeRef);

  return (
    <div
      className="w-full bg-surface-default p-1.5 rounded-md hover:bg-surface-hovered"
      onClick={onChange}>
      <div ref={nodeRef} className="!w-full flex items-center !justify-start">
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
    </div>
  );
};

TreeNode.displayName = 'TreeNode';

const CollaspeItem = ({
  data,
  onChange,
}: {
  data: MaterialItem;
  onChange: (value: WidgetItem) => void;
}) => {
  return (
    <div
      key={data?.title}
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
            {data?.title || 'Untitled'}
          </div>
          {data.items?.map(item => (
            <AccordionItem key={item.name} label={item.name} value={item.name}>
              <div className="flex flex-col gap-0.5">
                {item.children?.map(child => (
                  <TreeNode
                    onChange={() => onChange(child)}
                    key={child.name}
                    data={child}
                  />
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col gap-0.5">
          {data.items?.map(item => (
            <TreeNode
              onChange={() => onChange(item)}
              key={item.name}
              data={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TaskList: React.FC<{
  data: MaterialListType;
  loading?: boolean;
  className?: string;
  onChange: (value: WidgetItem) => void;
}> = ({ data = [], loading = true, className, onChange }) => {
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
          const filteredChildren = widgetItem.children?.filter(child =>
            child.name.toLowerCase().includes(lowerCaseSearchValue),
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

  return (
    <div
      className={clsx(
        'h-full w-full bg-surface-default flex flex-col px-3 pt-3 overflow-auto',
        className,
      )}>
      <header className="mb-2 px-1.5 flex-shrink-0">
        <SearchBar
          className="h-7 text-sm"
          placeholder="Search Widgets"
          onSearchChange={handleSearch}
        />
      </header>
      <main className="flex-1 space-y-1.5 overflow-auto no-scrollbar">
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
        {!loading &&
          filteredList.length > 0 &&
          filteredList?.map(item => (
            <CollaspeItem key={item.title} data={item} onChange={onChange} />
          ))}
      </main>
    </div>
  );
};
