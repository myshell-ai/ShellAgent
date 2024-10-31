'use client';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shellagent/ui';
import { useState } from 'react';

import { cn } from '@/utils/cn';

import ImportModal from './import-modal';

export const ExtraActions = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="border-none" autoFocus={false}>
          <div
            className={cn(
              'flex flex-shrink-0 w-7 h-7 ml-3 items-center justify-center rounded-full hover:bg-surface-pressed',
            )}>
            <EllipsisVerticalIcon className="w-4.5 h-4.5" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          sideOffset={10}
          align="end"
          className="w-56">
          <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
            Import from ShellAgent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ImportModal open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </>
  );
};
