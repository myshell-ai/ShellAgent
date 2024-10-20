import { IconButton, Lego, Setting } from '@shellagent/ui';
import { useInjection } from 'inversify-react';

import { SettingsModel } from '@/components/settings/settings.model';
import { useGlobalStore } from '@/stores/global/global-provider';

export const ListFooterExtra = () => {
  const setManagerDialogOpen = useGlobalStore(
    state => state.setManagerDialogOpen,
  );
  const settingsModel = useInjection(SettingsModel);

  const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

  return (
    <div className="ml-auto flex gap-1">
      <IconButton
        variant="ghost"
        className="w-9 h-9"
        icon={Lego}
        size="md"
        onClick={() => setManagerDialogOpen(true)}
      />
      <IconButton
        variant="ghost"
        className="w-9 h-9"
        size="md"
        icon={Setting}
        disabled={settingsDisabled}
        onClick={() => {
          if (settingsDisabled) return;
          settingsModel.modal.open();
        }}
      />
    </div>
  );
};
