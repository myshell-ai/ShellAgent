import { NodeTypeEnum } from '@shellagent/flow-engine';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@shellagent/ui';
import React, { PropsWithChildren } from 'react';

import { useSchemaContext } from '@/stores/app/schema-provider';

import CopyMenu from './copy-menu';

const ContextMenuProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { type, id, displayName } = useSchemaContext(state => ({
    type: state.type,
    id: state.id,
    displayName: state.displayName,
  }));

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      {type === NodeTypeEnum.state && id && (
        <ContextMenuContent className="w-48">
          <CopyMenu id={id} displayName={displayName} />
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export { ContextMenuProvider as ContextMenu };
