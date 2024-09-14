import Image, { ImageProps } from 'rc-image';
import {
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { GroupConsumerProps } from 'rc-image/lib/PreviewGroup';
import { ToolbarRenderInfoType } from 'rc-image/lib/Preview';
import { cloneElement, useEffect, useState } from 'react';
import { last } from 'lodash-es';

import '../styles/image-group.css';
import { Skeleton } from './skeleton';

const icons = {
  rotateLeft: <ArrowUturnLeftIcon className="w-4.5 h-4.5" />,
  rotateRight: <ArrowUturnRightIcon className="w-4.5 h-4.5" />,
  zoomIn: <MagnifyingGlassPlusIcon className="w-4.5 h-4.5" />,
  zoomOut: <MagnifyingGlassMinusIcon className="w-4.5 h-4.5" />,
  close: <XMarkIcon className="w-4.5 h-4.5" />,
  left: <ChevronLeftIcon className="w-8 h-8" />,
  right: <ChevronRightIcon className="w-8 h-8" />,
  flipX: <ArrowsRightLeftIcon className="w-4.5 h-4.5" />,
  flipY: <ArrowsUpDownIcon className="w-4.5 h-4.5" />,
};

export interface PreviewGroupProps extends GroupConsumerProps {
  images: ImageProps[];
}

async function fetchImageWithRetry(url: string, timeout = 5000, retries = 3) {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      if (retries > 0) {
        return fetchImageWithRetry(url, timeout, retries - 1);
      } else {
        throw new Error('Request timed out after 3 retries');
      }
    } else {
      if (retries > 0) {
        return fetchImageWithRetry(url, timeout, retries - 1);
      } else {
        throw new Error('Request failed after 3 retries');
      }
    }
  }
}

const CustomImage = ({
  src,
  timeout = 5000,
}: {
  src?: string;
  timeout?: number;
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (src) {
      fetchImageWithRetry(src, timeout, 3)
        .then(url => setImageSrc(url))
        .catch(err => setError(err.message));
    }
  }, [src, timeout]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return imageSrc ? (
    <Image src={imageSrc} />
  ) : (
    <Skeleton className="w-full h-60" />
  );
};

const ImageProviewGroup = ({
  images,
  ...previewGroupProps
}: PreviewGroupProps) => {
  const onDownLoad = (info: ToolbarRenderInfoType) => {
    const link = document.createElement('a');
    link.href = info.image.url;
    link.download = last(info.image.url.split('/')) || '';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 1000);
  };

  const toolbarRender = (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType,
  ) => {
    return (
      <div className="rc-image-preview-operations">
        {cloneElement(originalNode, { className: 'flex' })}
        <div
          className="text-lg cursor-pointer p-2.5"
          onClick={() => onDownLoad(info)}>
          <ArrowDownTrayIcon className="w-4.5 h-4.5" />
        </div>
      </div>
    );
  };

  return (
    <Image.PreviewGroup
      icons={icons}
      preview={{
        countRender: (current, total) => `${current} / ${total}`,
        toolbarRender,
        onChange: (current, prev) =>
          console.log(
            `当前第${current}张，上一次第${prev === undefined ? '-' : prev}张`,
          ),
      }}
      {...previewGroupProps}>
      {images?.map(item => <CustomImage key={item.src} {...item} />)}
    </Image.PreviewGroup>
  );
};

export { ImageProviewGroup };
