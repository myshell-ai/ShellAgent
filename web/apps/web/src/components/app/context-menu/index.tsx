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
  const { type, id, name } = useSchemaContext(state => ({
    type: state.type,
    id: state.id,
    name: state.name,
  }));

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      {type === NodeTypeEnum.state && id && (
        <ContextMenuContent className="w-48">
          <CopyMenu id={id} name={name} />
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export { ContextMenuProvider as ContextMenu };
