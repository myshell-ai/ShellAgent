import { NodeIdEnum } from '@shellagent/flow-engine';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuLabel,
} from '@shellagent/ui';
import React, { PropsWithChildren } from 'react';

import { useSchemaContext } from '@/stores/workflow/schema-provider';

import ConvertInput from './convert-input';
import CopyMenu from './copy-widget';
import ReloadSchema from './reload-memu';

const ContextMenuProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { id, name, inputAllTypes } = useSchemaContext(state => ({
    id: state.id,
    name: state.name,
    inputAllTypes: state.inputAllTypes,
  }));
  if (id === NodeIdEnum.start || id === NodeIdEnum.end) {
    return children;
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {name ? (
          <ContextMenuLabel className="text-xs text-subtlest font-light break-words">
            {name}
          </ContextMenuLabel>
        ) : null}
        <ConvertInput id={id} inputAllTypes={inputAllTypes} />
        {name && <ReloadSchema name={name} />}
        <CopyMenu id={id} />
      </ContextMenuContent>
    </ContextMenu>
  );
};

export { ContextMenuProvider as ContextMenu };
