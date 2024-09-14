'use client';

import React from 'react';
import { Drawer as AntDrawer, DrawerProps as AntDrawerProps } from 'antd';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ADrawerProps extends Omit<AntDrawerProps, 'children'> {
  children: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  title?: React.ReactNode;
}

const Drawer: React.FC<ADrawerProps> = ({
  children,
  title,
  className,
  placement = 'right',
  maskClosable = true,
  headerClassName,
  contentClassName,
  ...props
}) => {
  return (
    <AntDrawer
      {...props}
      placement={placement}
      maskClosable={maskClosable}
      closeIcon={null}
      className={cn(
        'bg-white transition ease-in-out duration-500 shadow-modal-default',
        className,
      )}
      rootClassName="z-10"
      // style={{ overflow: 'hidden' }}
      styles={{
        wrapper: { backgroundColor: 'transparent', boxShadow: 'none' },
        // mask: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
        header: { display: 'none' },
        body: { padding: '0' },
        content: { padding: '0', overflow: 'hidden' },
      }}>
      <div className="flex flex-col h-full">
        {title && (
          <div
            className={cn(
              'flex justify-between items-center p-3 !pb-0',
              headerClassName,
            )}>
            <div className="text-lg font-semibold">{title}</div>
            <button
              onClick={props.onClose}
              className="w-7 h-7 flex justify-center items-center focus-visible:outline-0 rounded-full hover:bg-surface-hovered">
              <X className="h-4.5 w-4.5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        )}
        <div
          className={cn('flex-grow overflow-auto p-3 !pt-0', contentClassName)}>
          {children}
        </div>
      </div>
    </AntDrawer>
  );
};

export { Drawer };
export type { ADrawerProps };
