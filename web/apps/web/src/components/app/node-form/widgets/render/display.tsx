import { CaretDown, ImageProviewGroup, JSONView, Text } from '@shellagent/ui';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';

import { cn } from '@/utils/cn';

const ImageRex = /.(jpg|jpeg|png|apng|gif|bmp|tiff|webp)$/;
const VideoRex = /.(mp4|avi|mov|wmv|flv)$/;

interface CollapseProps {
  header: React.ReactNode;
  content: React.ReactNode;
  defaultExpand?: boolean;
  className?: string;
}

const Collapse = ({
  header,
  content,
  defaultExpand,
  className,
}: CollapseProps) => {
  const [isExpand, setIsExpand] = useState(defaultExpand);
  return (
    <div
      className={cn(
        'grid gap-1.5 mt-2 px-2 py-1.5 border border-subtle bg-surface-hovered rounded-lg',
        className,
      )}>
      <div className="flex items-center">
        <div
          className="w-6 h-6 flex items-center justify-center cursor-pointer mr-1"
          onClick={() => setIsExpand(!isExpand)}>
          <CaretDown
            size="2xs"
            color="subtlest"
            rotate={!isExpand ? '-90' : undefined}
          />
        </div>
        {header}
      </div>
      <div
        className={cn('flex-1', {
          hidden: !isExpand,
        })}>
        {content}
      </div>
    </div>
  );
};

interface ImageLayoutProps {
  images: string[];
  field: string;
}

const ImageLayout = ({ field, images }: ImageLayoutProps) => {
  const generateImageConfig = (src: string) => ({
    src: `/api/files/output/${src}`,
    wrapperClassName: 'rounded-lg overflow-hidden',
  });
  return (
    <Collapse
      defaultExpand
      header={
        <Text size="sm" weight="medium">
          {field}
        </Text>
      }
      content={
        <div
          className={cn('grid gap-1.5', {
            'grid-cols-1': images.length === 1,
            'grid-cols-2': [2, 3, 4].includes(images.length),
            'grid-cols-3': images.length > 4,
          })}>
          <ImageProviewGroup images={images.map(generateImageConfig)} />
        </div>
      }
    />
  );
};

interface VideoLayoutProps {
  videos: string[];
  field: string;
}

const VideoLayout = ({ field, videos }: VideoLayoutProps) => {
  return (
    <Collapse
      defaultExpand
      header={
        <Text size="sm" weight="medium">
          {field}
        </Text>
      }
      content={
        <ReactPlayer
          url={videos.map(url => `/api/files/${url}`)}
          width="100%"
        />
      }
    />
  );
};

interface ObjectLayoutProps {
  value: object;
  field: string;
}

const ObjectLayout = ({ field, value }: ObjectLayoutProps) => {
  return (
    <Collapse
      header={
        <Text size="sm" weight="medium">
          {field}
        </Text>
      }
      content={value === null ? 'null' : <JSONView defaultValue={value} />}
    />
  );
};

interface TextLayoutProps {
  field: string;
  value: any;
}

const TextLayout = ({ field, value }: TextLayoutProps) => {
  const isError = field === 'error_message';
  const color = isError ? 'critical' : 'default';
  return (
    <Collapse
      defaultExpand={isError}
      header={
        <Text weight="medium" size="sm" color={color}>
          {field}
        </Text>
      }
      content={
        <Text color={color} size="sm" className="break-all">
          {value?.toString()}
        </Text>
      }
    />
  );
};

interface DisplayProps {
  outputs: object;
  className?: string;
}

const Display = ({ outputs, className }: DisplayProps) => {
  return (
    <div className={className}>
      {Object.entries(outputs).map(([key, value]) => {
        if (typeof value === 'string' && ImageRex.test(value)) {
          return <ImageLayout images={[value]} field={key} />;
        }
        if (Array.isArray(value) && ImageRex.test(value[0])) {
          return <ImageLayout images={value} field={key} />;
        }
        if (typeof value === 'string' && VideoRex.test(value)) {
          return <VideoLayout videos={[value]} field={key} />;
        }
        if (Array.isArray(value) && VideoRex.test(value[0])) {
          return <VideoLayout videos={value} field={key} />;
        }
        if (typeof value === 'object') {
          return <ObjectLayout value={value} field={key} />;
        }
        return <TextLayout value={value} field={key} />;
      })}
    </div>
  );
};

export { Display, Collapse };
