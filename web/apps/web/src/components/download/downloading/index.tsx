import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Heading, IconButton, Spinner, Text } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import { DownloadModel } from '@/components/download/download.model';
import { cn } from '@/utils/cn';

export const Downloading = observer(() => {
  const [itemType, setItemType] = useState('models');
  const model = useInjection(DownloadModel);
  useEffect(() => {
    if (itemType === 'models' && model.drawer.isOpen) {
      model.getDownloadingModels();
      model.getProgress();
    }
  }, [itemType, model.drawer.isOpen]);

  return (
    <div>
      <div>
        {/* <Button
          size="sm"
          className="rounded-lg"
          color={itemType === 'widgets' ? 'brand' : 'gray'}
          variant={itemType === 'widgets' ? 'primary' : 'outline'}
          onClick={() => setItemType('widgets')}>
          Widgets
        </Button> */}
        <Button
          size="sm"
          className="ml-3 rounded-lg"
          color={itemType === 'models' ? 'brand' : 'gray'}
          variant={itemType === 'models' ? 'primary' : 'outline'}
          onClick={() => setItemType('models')}>
          Models
        </Button>
      </div>
      <div className="py-3">
        {model.downloadingModels.map((item, idx) => {
          const progress = model.progressMap.get(item.model_id) || 0;
          return (
            <div className="flex px-2 gap-x-1 pt-2">
              <div className="w-5 h-full pt-1">
                {item.error_status === 'failed' ? (
                  <XMarkIcon className="text-error w-4.5 h-4.5" />
                ) : (
                  <Spinner className="text-brand" size="xs" />
                )}
              </div>
              <div
                className={cn(
                  'w-full flex justify-between items-center gap-x-1 pb-2',
                  {
                    'border-b': idx !== model.downloadingModels.length - 1,
                  },
                )}>
                <div>
                  <Heading size="h4">{item.filename}</Heading>
                  {item.error_status !== 'failed' ? (
                    <Text color="subtler">{`${progress}%`}</Text>
                  ) : null}
                </div>
                <div>
                  {item.error_status === 'failed' ? (
                    <IconButton
                      icon={ArrowPathIcon}
                      size="sm"
                      className="text-error"
                      color="default"
                      variant="outline"
                      onClick={() => model.forceInstall(item.model_id)}
                    />
                  ) : null}
                  <IconButton
                    icon={XMarkIcon}
                    size="sm"
                    className="ml-2 hover:border-surface-critical-default hover:text-critical hover:bg-surface-accent-red-subtler"
                    color="default"
                    variant="outline"
                    onClick={() => model.cancelDownload(item.cache_path)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
