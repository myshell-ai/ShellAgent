/** @jsxImportSource @emotion/react */

import { PhotoIcon } from '@heroicons/react/24/outline';
import { AButton, Button } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { OpenImageCanvasModel } from '@/components/image-canvas/open-image-canvas.model';
import { observer } from 'mobx-react-lite';
import { ImageCanvas } from 'image-canvas';
import 'image-canvas/index.css';
import 'image-canvas/assets/react-colors-beauty.css';
import { Modal, theme } from 'antd';
import { css } from '@emotion/react';

export function OpenImageCanvas() {
  const model = useInjection(OpenImageCanvasModel);
  return (
    <Button
      icon={PhotoIcon}
      onClick={() => {
        model.open();
      }}
      css={css`
        box-shadow: unset !important;
      `}
      variant="link"
      size="sm"
      type="button"
      className="w-18 border-default rounded-full">
      Open Image Canvas
    </Button>
  );
}

function OkButton() {
  const model = useInjection(OpenImageCanvasModel);
  return (
    <AButton
      size="large"
      type="primary"
      onClick={() => {
        model.close();
      }}>
      Save
    </AButton>
  );
}

export const ImageCanvasDialog = observer(() => {
  const model = useInjection(OpenImageCanvasModel);
  const { token } = theme.useToken();
  return (
    <Modal
      style={{ top: 16 }}
      width="90%"
      open={model.isOpen}
      styles={{
        header: {
          padding: 16,
          marginBottom: 0,
          borderBottom: `1px solid ${token.colorBorder}`,
        },
        footer: {
          marginTop: 0,
          padding: 16,
          borderTop: `1px solid ${token.colorBorder}`,
        },
        content: {
          padding: 0,
        },
        body: {
          padding: 0,
          height: 'calc(100vh - 24px - 16px * 6 - 35px)',
        },
      }}
      title="Image Canvas Editor"
      onCancel={() => model.close()}
      footer={[<OkButton />]}>
      <ImageCanvas />
    </Modal>
  );
});
