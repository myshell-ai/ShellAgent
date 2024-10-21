'use client';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shellagent/ui';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { cn } from '@/utils/cn';

const ImportModal = dynamic(
  () => import('@/components/workflow/import-modal'),
  {
    ssr: false,
  },
);

export const ExtraActions = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div
            className={cn(
              'flex flex-shrink-0 w-7 h-7 items-center justify-center rounded-full hover:bg-surface-pressed',
            )}>
            <EllipsisVerticalIcon className="w-4.5 h-4.5" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          sideOffset={10}
          align="end"
          className="w-52">
          <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
            Import from ComfyUI
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ImportModal open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </>
  );
};
