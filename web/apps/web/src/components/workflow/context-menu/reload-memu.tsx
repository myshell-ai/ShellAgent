import { ContextMenuSub, ContextMenuSubTrigger, Spinner } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import React from 'react';
import { toast } from 'react-toastify';

import { realoadWorkflow } from '@/services/workflow';
import { useWorkflowStore } from '@/stores/workflow/workflow-provider';

const ReloadSchema: React.FC<{ name: string }> = ({ name }) => {
  const { getWidgetSchema } = useWorkflowStore(state => ({
    getWidgetSchema: state.getWidgetSchema,
  }));
  const { run, loading } = useRequest(realoadWorkflow, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        getWidgetSchema({ widget_name: name }, true);
      }
    },
    onError: () => {
      toast.error('reload error', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    },
  });

  const handleReload = () => {
    run({ widget_name: name });
  };

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger
        onClick={handleReload}
        noArrow
        className="cursor-pointer">
        <div className="flex w-full">
          <div>Reload</div>
          <div className="ml-auto">
            {loading && <Spinner className="text-brand" size="sm" />}
          </div>
        </div>
      </ContextMenuSubTrigger>
    </ContextMenuSub>
  );
};

export default ReloadSchema;
