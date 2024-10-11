/** @jsxImportSource @emotion/react */

'use client';

import 'image-canvas/index.css';
import 'image-canvas/assets/react-colors-beauty.css';
import { css } from '@emotion/react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { AButton, Button, useFormContext } from '@shellagent/ui';
import { Modal, theme } from 'antd';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useSelectOptions } from '@/components/app/node-form/widgets/variable-select/use-select-options';
import { OpenImageCanvasModel } from '@/components/image-canvas/open-image-canvas.model';

const ImageCanvas = dynamic(
  () => import('image-canvas').then(module => module.ImageCanvas),
  { ssr: false },
);

export function OpenImageCanvas(props: any) {
  const model = useInjection(OpenImageCanvasModel);
  // eslint-disable-next-line react/destructuring-assignment
  const options = useSelectOptions(props.name);
  const { getValues } = useFormContext();
  useEffect(() => {
    model.fieldProps = props;
    model.getValues = getValues;
    model.imageCanvas.setVariables(options);
    // eslint-disable-next-line react/destructuring-assignment
  }, [props.id]);
  return (
    <Button
      icon={PhotoIcon}
      onClick={() => {
        model.openAndLoad();
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
        model.saveAndClose();
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
