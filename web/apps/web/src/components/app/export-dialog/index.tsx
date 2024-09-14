import { ChevronDownIcon } from '@heroicons/react/16/solid';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  Heading,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Button,
  AlertDialogPortal,
  ExportIcon,
  Text,
  Separator,
} from '@shellagent/ui';
import { useBoolean, useRequest } from 'ahooks';
import { isEmpty, set } from 'lodash-es';
import React, { useState, cloneElement, ReactElement } from 'react';
import { toast } from 'react-toastify';

import { exportApp } from '@/services/app';
import { ExportBotResponse } from '@/services/app/type';
import { cn } from '@/utils/cn';

interface ExportDialogProps {
  id: string;
  name: string;
  children?: ReactElement;
}

interface LackDependency {
  models: {
    [key: string]: string;
  };
  widgets: {
    [key: string]: string;
  };
}

export const ExportDialog = ({ id, name, children }: ExportDialogProps) => {
  const [openDialog, openDialogAction] = useBoolean(false);
  const [isExpand, isExpandAction] = useBoolean(false);
  const [lackDependency, setLackDependency] = useState<LackDependency>();
  const [exportData, setExportData] = useState('');

  const onDownload = (data: string) => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.json`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 1000);
  };

  const checkDependency = (data: ExportBotResponse['data']) => {
    const deps: LackDependency = {
      models: {},
      widgets: {},
    };
    Object.entries(data.dependency.models || {}).forEach(([key, item]) => {
      if (isEmpty(item.urls)) {
        set(deps, ['models', key], item.filename);
      }
    });
    Object.entries(data.dependency.widgets || {}).forEach(([key, item]) => {
      if (isEmpty(item.git) || item.git === 'None') {
        set(deps, ['widgets', key], key);
      }
    });
    return deps;
  };

  const { run: runExportApp, loading } = useRequest(exportApp, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        const deps = checkDependency(result.data);
        const data = JSON.stringify(result || {});
        if (isEmpty(deps.models) && isEmpty(deps.widgets)) {
          onDownload(data);
        } else {
          setExportData(data);
          setLackDependency(deps);
          openDialogAction.setTrue();
        }
      } else {
        toast.error(`Export Error! ${result.message || ''}`, {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onClose = () => {
    openDialogAction.setFalse();
  };

  const onConfirm = () => {
    onDownload(exportData);
    onClose();
  };

  return (
    <>
      {children ? (
        cloneElement(children, {
          onClick: (e: any) => {
            e.preventDefault();
            runExportApp({
              app_id: id,
              version_name: 'latest',
            });
          },
        })
      ) : (
        <Button
          loading={loading}
          onClick={() =>
            runExportApp({
              app_id: id,
              version_name: 'latest',
            })
          }
          className="w-28 px-8 border border-default shadow-button-primary1 ml-3"
          size="md"
          icon={ExportIcon}
          variant="outline">
          Export
        </Button>
      )}
      <AlertDialog open={openDialog}>
        <AlertDialogPortal>
          <AlertDialogContent style={{ width: '380px' }}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex justify-between items-center">
                  <span className="rounded-full p-2 bg-surface-accent-yellow-subtler">
                    <ExclamationTriangleIcon className="w-6 h-6 text-warning" />
                  </span>
                  <div className="w-9 h-9 flex cursor-pointer justify-center items-center focus-visible:outline-0 rounded-full hover:bg-surface-hovered">
                    <XMarkIcon
                      className="w-6 h-6 text-icon-subtle"
                      onClick={onClose}
                    />
                  </div>
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="flex flex-col gap-1.5">
              <Heading size="h2">Warning</Heading>
              <Text size="sm" color="subtle">
                The following items can’t run in MyShell. Please contact our
                team to add them, or replace them with MyShell-supported items.
              </Text>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => isExpandAction.toggle()}>
                <Text size="sm" color="subtler">
                  {isExpand ? 'Show Less' : 'View Detail'}
                </Text>
                <ChevronDownIcon
                  className={cn('w-4 h-4 ml-1.5 text-subtler', {
                    'rotate-180': isExpand,
                  })}
                />
              </div>
              <div
                className={cn(
                  'flex-1 rounded-lg border border-default p-3 w-[340px] max-h-60 overflow-x-hidden',
                  {
                    hidden: !isExpand,
                  },
                )}>
                {Object.entries(lackDependency || {}).map(
                  ([key, item], idx) => {
                    if (isEmpty(item)) {
                      return null;
                    }
                    return (
                      <div>
                        {idx ? <Separator className="my-3" /> : null}
                        <Text size="sm" color="subtler">
                          {key.toLocaleUpperCase()}
                        </Text>
                        <div className="mt-1 gap-2">
                          {Object.values(item).map(v => (
                            <Text size="lg" className="block break-words">
                              {v as string}
                            </Text>
                          ))}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button
                loading={loading}
                className="flex-1"
                color="warning"
                onClick={onConfirm}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </>
  );
};
