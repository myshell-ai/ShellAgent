import { Button, Heading, Text } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

import { DownloadModel } from '../download.model';

export const Completed = observer(() => {
  const [itemType, setItemType] = useState('models');
  const model = useInjection(DownloadModel);

  useEffect(() => {
    if (itemType === 'models' && model.drawer.isOpen) {
      model.getCompletedModels();
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
        {model.completedModels.map((item, idx) => (
          <>
            <Heading size="h4">{item.filename}</Heading>
            <div className="flex pb-2 pt-2">
              <div
                className={cn('w-full flex justify-between items-center pb-2', {
                  'border-b': idx !== model.completedModels.length - 1,
                })}>
                <div>
                  <Text color="subtler">Form {item.source}</Text>
                </div>
                <Text size="sm" color="subtler">
                  {item.finish_time}
                </Text>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
});
