'use client';

import { ChevronUpIcon, PlusIcon } from '@heroicons/react/24/outline';
import { TValues } from '@shellagent/form-engine';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
  Heading,
  ButtonProps,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  CreateBlank,
  CreateTemplate,
  Spinner,
} from '@shellagent/ui';
import { useBoolean, useRequest } from 'ahooks';
import { capitalize } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { createItem, getTemplateList } from '@/services/home';
import { Type } from '@/services/home/type';
import { cn } from '@/utils/cn';

import DetailForm from '../detail-form';
import { TemplateCard } from '../template-card';

interface CreateDialogProps {
  size?: ButtonProps['size'];
  onSuccess: () => void;
  type: Type;
}

export const CreateDialog: React.FC<CreateDialogProps> = ({
  size,
  onSuccess,
  type,
}) => {
  const [open, openAction] = useBoolean();
  const [openTemplate, openTemplateAction] = useBoolean();
  const [openDrapdown, openDrapdownAction] = useBoolean();
  const [templateId, setTemplateId] = useState('');
  const [data, setData] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: '',
  });
  const router = useRouter();

  const {
    loading: getTemplateLoading,
    run: getTemplate,
    data: templateList,
  } = useRequest(getTemplateList, {
    manual: true,
    onError: error => {
      toast.error(error.message);
    },
  });

  const onOpenChange = (value: boolean) => {
    openAction.set(value);
    if (!value) {
      setTemplateId('');
    }
  };

  const { loading, run } = useRequest(createItem, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        onSuccess();
        if (result.data.id) {
          router.push(`/${type}/detail?id=${result.data.id}`);
        }
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onConfirm = async () => {
    run({ ...data, type, template_id: templateId });
  };

  const onChange = (values: TValues) => {
    setData(values as { name: string; description: string });
  };

  const onUseTemplate = (id: string) => {
    setTemplateId(id);
    onOpenChange(true);
  };

  return (
    <>
      <DropdownMenu onOpenChange={openDrapdownAction.set}>
        <DropdownMenuTrigger className="border-none" autoFocus={false}>
          <Button size={size || 'md'} icon={PlusIcon}>
            Create
            <ChevronUpIcon
              className={cn(
                'w-4.5 h-4.5 text-inherit text-sm ml-1.5',
                openDrapdown ? '' : 'rotate-180',
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" sideOffset={10} align="end">
          <DropdownMenuItem onClick={() => onOpenChange(true)}>
            <CreateBlank className="w-4.5 h-4.5 text-inherit text-sm mr-1.5" />
            Create a Blank
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              openTemplateAction.setTrue();
              getTemplate({ type });
            }}
            disabled={type === 'workflow'}>
            <CreateTemplate className="w-4.5 h-4.5 text-inherit text-sm mr-1.5" />
            Create from Template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog modal open={open} onOpenChange={onOpenChange}>
        <DialogContent onClose={() => onOpenChange(false)} className="w-96">
          <DialogHeader>
            <DialogTitle>
              <Heading size="h2">Create a New {capitalize(type)}</Heading>
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <DialogDescription className="px-4 py-3">
            <DetailForm type={type} values={data} onChange={onChange} />
          </DialogDescription>
          <Separator />
          <DialogFooter className="gap-x-4 flex">
            <Button
              type="button"
              className="flex-1"
              variant="outline"
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={!data.name}
              loading={loading}
              onClick={onConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog modal open={openTemplate} onOpenChange={openTemplateAction.set}>
        <DialogContent
          onClose={() => openTemplateAction.setFalse()}
          className="w-[720px] max-w-[720px] ">
          <DialogHeader>
            <DialogTitle>
              <Heading size="h2">Create from Template</Heading>
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <DialogDescription
            className={cn(
              'min-h-80 max-h-[70vh] overflow-scroll !px-5 !py-3 grid gap-3',
              getTemplateLoading ? '' : 'grid-cols-2',
            )}>
            {getTemplateLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Spinner className="w-4.5 h-4.5 text-brand" />
              </div>
            ) : (
              templateList?.data?.map(item => (
                <TemplateCard {...item} onUseTemplate={onUseTemplate} />
              ))
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
