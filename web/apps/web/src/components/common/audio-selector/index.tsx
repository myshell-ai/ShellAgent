import {
  Button,
  ISelectProps,
  Label,
  Select,
  ArrowUpTray,
} from '@shellagent/ui';
import React, { useState } from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import { upload } from '@/services/common';
import { ENABLE_MIME } from '@/utils/file-types';

import { FileRender } from '../file-render';

interface AudioSelectorProps {
  title?: string;
  value: string;
  defaultValue: string;
  triggerClassName?: string;
  disabled?: boolean;
  options: ISelectProps['options'];
  onChange: (value?: string) => void;
}

const accept = ENABLE_MIME.audio;

export default function AudioSelector(props: AudioSelectorProps) {
  const {
    title,
    defaultValue,
    disabled,
    value,
    options,
    triggerClassName,
    onChange,
  } = props;
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState<string>(value || defaultValue);
  const [customOptions, setCustomOptions] = useState(
    !audio || options?.find(item => item.value === audio)
      ? options
      : [
          ...(options || []),
          {
            label: audio,
            value: audio,
          },
        ],
  );

  const onAudioChange = (value: string) => {
    if (value) {
      onChange(value);
      setAudio(value);
    }
  };

  const onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => Promise<void> = async (acceptedFiles, fileRejections) => {
    // 如果有被拒绝的文件，按序生成报错信息
    if (fileRejections.length) {
      toast.error(fileRejections[0]?.errors?.[0]?.message);
      return;
    }

    if (acceptedFiles.length) {
      setLoading(true);
      const resp = await upload(acceptedFiles[0]);
      if (resp.url) {
        const fileUrl = resp.url.replace('input/', '');
        if (!customOptions?.find(item => item.value === fileUrl)) {
          setCustomOptions([
            ...(customOptions || []),
            {
              label: fileUrl,
              value: fileUrl,
            },
          ]);
        }
        onAudioChange(fileUrl);
      }
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    minSize: 0,
    // maxSize: 5 * 1024 * 1024,
    accept,
    disabled,
  });

  return (
    <div className="flex flex-col gap-y-1.5">
      <div className="flex items-center">
        <Label className="w-36 mr-2 break-all">{title}</Label>
        <Select
          value={value || audio}
          options={customOptions}
          triggerClassName={triggerClassName}
          onValueChange={onAudioChange}
        />
      </div>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Button
          icon={ArrowUpTray}
          loading={loading}
          size="sm"
          variant="static"
          color="default"
          className="w-full rounded-lg">
          Click to upload or select audio
        </Button>
      </div>
      <FileRender url={audio} />
    </div>
  );
}
