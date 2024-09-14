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
  const { type, id } = useSchemaContext(state => ({
    type: state.type,
    id: state.id,
  }));

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      {type === NodeTypeEnum.state && id && (
        <ContextMenuContent className="w-48">
          <CopyMenu id={id} />
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export { ContextMenuProvider as ContextMenu };
