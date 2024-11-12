import { Bot, Drawer, IconButton } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { AssistantModel } from '@/components/assistant-help/model';
import { AssistantBot } from '@/components/assistant-help/bot';

export const Assistant = observer(() => {
  const model = useInjection(AssistantModel);
  return (
    <div className="fixed right-6 bottom-8">
      <IconButton
        icon={Bot}
        variant="outline"
        className="w-9 h-9 text-brand bg-white shadow-button-basic"
        color="default"
        size="md"
        onClick={model.drawer.open}
        autoFocus={false}
      />
      <Drawer
        width={380}
        style={{
          width: '380px',
          height: '90vh',
        }}
        className="rounded-lg fixed right-6 bottom-[72px]"
        headerClassName="px-4 !py-3 bg-surface-container-default"
        contentClassName="!p-0"
        onClose={model.drawer.close}
        getContainer="body"
        maskClosable
        title="Assistant"
        open={model.drawer.isOpen}>
        <AssistantBot />
      </Drawer>
    </div>
  );
});
