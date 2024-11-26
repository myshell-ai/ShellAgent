'use client';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Automata } from '@shellagent/pro-config';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { useState } from 'react';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { ShellAgent } from '@/types/app/types';
import { cn } from '@/utils/cn';

import ImportModal from './import-modal';

export const ExtraActions = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const onConfirm = (data: ShellAgent) => {
    return new Promise(resolve => {
      appBuilder.initAppBuilder(data);
      resolve(true);
    });
  };

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
        <DropdownMenuContent side="bottom" sideOffset={10} align="end">
          <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
            Import
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ImportModal
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onConfirm={onConfirm}
      />
    </>
  );
};
