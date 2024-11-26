import { Bot, Drawer, IconButton } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

import { AssistantModel } from '@/components/assistant/model';
import { AssistantBot } from '@/components/assistant/bot';

const Assistant = observer(() => {
  const model = useInjection(AssistantModel);
  const [drawerSize, setDrawerSize] = useState<{
    width: string | number;
    height: string | number;
  }>({ width: 380, height: window.innerHeight * 0.9 });
  const [position, setPosition] = useState({
    x:
      typeof window !== 'undefined'
        ? window.innerWidth - Number(drawerSize.width) - 24
        : 0, // 计算初始 x 位置
    y:
      typeof window !== 'undefined'
        ? window.innerHeight - Number(drawerSize.height) - 72
        : 0, // 计算初始 y 位置
  });

  return (
    <>
      <div className="fixed right-6 bottom-8">
        <IconButton
          icon={() => <Bot className="w-9 h-9" />}
          variant="outline"
          className="w-9 h-9 text-brand bg-white shadow-button-basic"
          color="default"
          onClick={model.drawer.open}
          autoFocus={false}
        />
      </div>
      {model.drawer.isOpen ? (
        <Rnd
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '72px',
            // display: model.drawer.isOpen ? 'block' : 'none',
          }}
          minWidth="380"
          minHeight="380"
          size={{ width: drawerSize.width, height: drawerSize.height }}
          position={{ x: position.x, y: position.y }}
          dragHandleClassName="rnd-drag-header"
          onDragStop={(e, d) => {
            setPosition({ x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setDrawerSize({
              width: ref.style.width,
              height: ref.style.height,
            });
            setPosition(position);
          }}>
          <Drawer
            width="100%"
            height="100%"
            className="rounded-lg"
            headerClassName="px-4 !py-3 bg-surface-container-default rnd-drag-header cursor-move"
            contentClassName="!p-0"
            onClose={model.drawer.close}
            getContainer={false}
            maskClosable
            mask={false}
            title="Assistant(Beta)"
            open={model.drawer.isOpen}>
            <AssistantBot />
          </Drawer>
        </Rnd>
      ) : null}
    </>
  );
});

export default Assistant;
