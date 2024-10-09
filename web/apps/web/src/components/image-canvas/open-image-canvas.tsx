import { PhotoIcon } from '@heroicons/react/24/outline';
import { AButton, AModal, Button } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { ImageCanvasModel } from '@/components/image-canvas/image-canvas.model';
import { observer } from 'mobx-react-lite';

export function OpenImageCanvas() {
  const model = useInjection(ImageCanvasModel);
  return (
    <Button
      icon={PhotoIcon}
      onClick={() => {
        model.open();
      }}
      variant="link"
      size="sm"
      type="button"
      className="w-18 border-default rounded-full">
      Open Image Canvas
    </Button>
  );
}

export function OkButton() {
  return (
    <AButton
      size="large"
      type="primary"
      style={{ width: '100%' }}
      onClick={() => {
        console.log('clicked ok button');
      }}>
      Run
    </AButton>
  );
}

export const ImageCanvasDialog = observer(() => {
  const model = useInjection(ImageCanvasModel);
  return (
    <AModal
      width="80%"
      open={model.isOpen}
      title="Image Canvas Editor"
      hideCancelButton
      onCancel={() => model.close()}
      okDisabled={false}
      okButton={<OkButton />}>
      Hello
    </AModal>
  );
});
