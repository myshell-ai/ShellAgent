'use client';

import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  CardFooter,
  CardHeader,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Heading,
  Text,
  Button,
  Image,
  Separator,
} from '@shellagent/ui';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { ExportDialog } from '@/components/app/export-dialog';
import { duplicateItem } from '@/services/home';
import { Metadata, Type } from '@/services/home/type';
import { cn } from '@/utils/cn';

import { DeleteDialog } from '../delete-dialog';
import { SaveTemplateDialog } from '../save-template-dialog';
import { EditDialog } from '../edit-dialog';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

interface FlowCardProps {
  id: string;
  metadata: Metadata & {
    create_time: string;
    update_time: string;
  };
  onSuccess: () => void;
  type: Type;
}

export const FlowCard = ({ id, metadata, onSuccess, type }: FlowCardProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openSaveTempDialog, setOpenSaveTempDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const onEdit = (e: any) => {
    e.stopPropagation();
    setOpenEditDialog(true);
  };

  const { run: runDuplicate } = useRequest(duplicateItem, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success(
          <div className="w-full flex justify-between items-center">
            <Text>File duplicated</Text>
            <Separator orientation="vertical" />
            <Link href={`/${type}/detail?id=${id}`}>
              <Button size="sm" variant="outline" color="default">
                Open
              </Button>
            </Link>
          </div>,
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          },
        );
        onSuccess();
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onDuplicate = () => {
    runDuplicate({ name: `${metadata.name} copy`, id, type });
  };
  // const onExport = () => {
  //   toast.success(<Text>Exporting {metadata.name}...</Text>, {
  //     toastId: id,
  //     position: 'top-center',
  //     autoClose: 3000,
  //     hideProgressBar: true,
  //     isLoading: true,
  //     pauseOnHover: true,
  //     closeButton: false,
  //   });
  //   setTimeout(() => {
  //     toast.update(id, {
  //       type: 'success',
  //       isLoading: false,
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       render: 'success',
  //     });
  //   }, 3000);
  // };
  const onDelete = () => {
    setOpenDeleteDialog(true);
  };
  return (
    <>
      <Card className="w-full border-0 shadow-none group/menu">
        <Link href={`/${type}/detail?id=${id}`}>
          <CardHeader className="p-0 rounded-xl border border-hovered overflow-hidden">
            <Image
              width="100%"
              className="aspect-[3/2]"
              src={metadata.avatar || '/workflow-thumbnail.png'}
              alt="workflow-thumbnail.png"
            />
          </CardHeader>
        </Link>
        <CardFooter className="flex justify-between items-center p-0 pt-3 w-full">
          <Link href={`/${type}/detail?id=${id}`} className="w-3/4">
            <Heading size="h4" className="w-full truncate">
              {metadata.name || 'Untitled'}
            </Heading>
            <Text color="subtler" size="xs">
              Edited {dayjs(metadata.update_time).fromNow()}
            </Text>
          </Link>
          <DropdownMenu onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger>
              <div
                className={cn(
                  'flex-shrink-0 w-7 h-7 items-center justify-center rounded-full hidden md:group-hover/menu:flex hover:bg-surface-pressed',
                  {
                    'flex bg-surface-pressed': openDropdown,
                  },
                )}>
                <EllipsisVerticalIcon className="w-4.5 h-4.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="w-64 group/menu">
              <DropdownMenuItem onClick={onEdit}>
                <PencilSquareIcon className="w-5 h-5 mr-1.5 text-icon" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <DocumentDuplicateIcon className="w-5 h-5 mr-1.5 text-icon" />
                Duplicate
              </DropdownMenuItem>
              {type === 'app' ? (
                <>
                  <ExportDialog id={id} name={metadata.name}>
                    <DropdownMenuItem>
                      <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-1.5 text-icon" />
                      Export
                    </DropdownMenuItem>
                  </ExportDialog>
                  <DropdownMenuItem onClick={() => setOpenSaveTempDialog(true)}>
                    <DocumentPlusIcon className="w-5 h-5 mr-1.5 text-icon" />
                    Save As Template(Beta)
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuItem className="text-error" onClick={onDelete}>
                <TrashIcon className="w-5 h-5 mr-1.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
      <DeleteDialog
        type={type}
        id={id}
        name={metadata.name}
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSuccess={onSuccess}
      />
      <SaveTemplateDialog
        id={id}
        open={openSaveTempDialog}
        onClose={() => setOpenSaveTempDialog(false)}
      />
      <EditDialog
        type={type}
        id={id}
        metadata={metadata}
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSuccess={onSuccess}
      />
    </>
  );
};
