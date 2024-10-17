import { IconButton, Setting } from '@shellagent/ui';
import { useInjection } from 'inversify-react';

import { SettingsModel } from '@/components/settings/settings.model';

export const ListFooterExtra = () => {
  const settingsModel = useInjection(SettingsModel);

  const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

  return (
    <div className="ml-auto flex gap-1">
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
