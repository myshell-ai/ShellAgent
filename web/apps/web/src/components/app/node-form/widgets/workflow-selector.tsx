import MagnifyingGlassIcon from '@heroicons/react/24/outline/esm/MagnifyingGlassIcon';
import { Text, SearchBar, Spinner } from '@shellagent/ui';
import { Menu } from 'antd';
import { MenuItemType } from 'antd/es/menu/interface';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';

export const WorkflowSelect: React.FC<{
  data: MenuItemType[];
  loading?: boolean;
  className?: string;
}> = ({ data = [], loading = true, className }) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  // 修正 filteredList 方法
  const filteredList = useMemo(() => {
    if (!searchValue) return data;

    const lowerCaseSearchValue = searchValue.toLowerCase();
    return data.filter(item =>
      (item.label as string)?.toLowerCase().includes(lowerCaseSearchValue),
    );
  }, [data, searchValue]);

  return (
    <div
      className={clsx(
        'h-full w-full bg-surface-default flex flex-col px-2 pt-2 overflow-auto',
        className,
      )}>
      <header className="mb-2 flex-shrink-0">
        <SearchBar
          className="h-7 text-sm"
          placeholder="Search Widgets"
          onSearchChange={handleSearch}
        />
      </header>
      <main
        style={{ maxHeight: 300 }}
        className="flex-1 space-y-1.5 overflow-auto">
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
        {!loading && filteredList.length > 0 && (
          <Menu
            onWheel={e => e.stopPropagation()}
            inlineIndent={0}
            className="w-full h-full text-left !p-0"
            items={filteredList?.map(item => ({
              label: item.label,
              key: item.key,
            }))}
          />
        )}
      </main>
    </div>
  );
};
