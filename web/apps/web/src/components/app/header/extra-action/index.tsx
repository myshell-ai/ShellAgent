'use client';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shellagent/ui';
import { Automata } from '@shellagent/pro-config';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app/app-provider';
import { ShellAgent } from '@/stores/app/app-store';

import ImportModal from './import-modal';

export const ExtraActions = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { initAppBuilder } = useAppStore(
    useShallow(state => ({
      initAppBuilder: state.initAppBuilder,
    })),
  );

  const onConfirm = (data: ShellAgent) => {
    return new Promise((resolve, reject) => {
      initAppBuilder({
        reactflow: {
          nodes: [],
          edges: [],
          viewport: {
            x: 0,
            y: 0,
            zoom: 0,
          },
        },
        config: {
          fieldsModeMap: {},
          schemaModeMap: {},
        },
        metadata: data.metadata,
        automata: {} as Automata,
      });
      setTimeout(() => {
        try {
          initAppBuilder(data);
          toast.success(`import success!`, {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
          resolve('success');
        } catch (error: any) {
          toast.error(`import error: ${error?.message}`, {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
          resolve('failed');
        }
      });
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
