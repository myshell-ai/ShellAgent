import { PhotoIcon } from '@heroicons/react/24/outline';
import { Button } from '@shellagent/ui';

export function OpenImageCanvas() {
  return (
    <Button
      icon={PhotoIcon}
      onClick={() => {
        console.log('clicked open image canvas');
      }}
      variant="link"
      size="sm"
      type="button"
      className="w-18 border-default rounded-full">
      Open Image Canvas
    </Button>
  );
}
