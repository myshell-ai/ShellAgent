import XMarkIcon from '@heroicons/react/24/outline/esm/XMarkIcon';
import { IconButton } from '@shellagent/ui';
import { last } from 'lodash-es';
import { ReactNode, useMemo } from 'react';

import Audio from '@/components/common/uploader/display/audio';
import Image from '@/components/common/uploader/display/image';
import Other from '@/components/common/uploader/display/other';
import Video from '@/components/common/uploader/display/video';
import { ENABLE_PREVIEW_FILE, getLocalTypeBySuffix } from '@/utils/file-types';

type DisplayType = 'audio' | 'video' | 'image' | 'other';

type DisplayProps = {
  file: File | string;
};

export type SpecificDisplayProps = {
  name: string;
  size?: string;
  deleteEle: ReactNode;
  src?: string;
};

type DeleteEleProps = {
  onDelete: () => void;
};

function DeleteEle({ onDelete }: DeleteEleProps) {
  return (
    <IconButton
      className="shrink-0"
      size="sm"
      variant="ghost"
      icon={XMarkIcon}
      onClick={onDelete}
    />
  );
}

export default function Display({
  file,
  onDelete,
}: DisplayProps & DeleteEleProps) {
  const [src, name, type, size] = useMemo(() => {
    if (typeof file === 'string') {
      const [filename, suffix] = last(file.split('/'))?.split('.') || [];
      const filetype = getLocalTypeBySuffix(suffix);
      const fileurl = file.startsWith('http') ? file : `/api/files/${file}`;
      return [fileurl, filename, filetype];
    }
    const { name, size, type } = file;
    const displaySize =
      size < 1024 * 1024
        ? `${Math.ceil(size / 1024)}kb`
        : `${Math.ceil(size / (1024 * 1024))}mb`;
    const mimeTypePrefix = type?.split('/')?.[0];
    const filetype = (
      ENABLE_PREVIEW_FILE.includes(mimeTypePrefix) ? mimeTypePrefix : 'other'
    ) as DisplayType;
    const previewUrl = ENABLE_PREVIEW_FILE.includes(mimeTypePrefix)
      ? URL.createObjectURL(file)
      : undefined;
    return [previewUrl, name, filetype, displaySize];
  }, [file]);

  if (type === 'audio') {
    return (
      <Audio
        name={name}
        size={size}
        src={src}
        deleteEle={<DeleteEle onDelete={onDelete} />}
      />
    );
  }
  if (type === 'video') {
    return (
      <Video
        name={name}
        size={size}
        src={src}
        deleteEle={<DeleteEle onDelete={onDelete} />}
      />
    );
  }
  if (type === 'image') {
    return (
      <Image
        name={name}
        size={size}
        src={src}
        deleteEle={<DeleteEle onDelete={onDelete} />}
      />
    );
  }

  return (
    <Other
      name={name}
      size={size}
      deleteEle={<DeleteEle onDelete={onDelete} />}
    />
  );
}
