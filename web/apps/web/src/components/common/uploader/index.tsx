import { useCallback, useState, useMemo } from 'react';

import Display from '@/components/common/uploader/display';
import UploadError from '@/components/common/uploader/display/upload-error';
import Uploading from '@/components/common/uploader/display/uploading';
import FileUploaderDropZone, {
  FileUploaderDropZoneProps,
} from '@/components/common/uploader/drop-zone';
import { upload } from '@/services/common';
import { cn } from '@/utils/cn';

export enum FileStatus {
  Uploading = 'Uploading',
  Error = 'Error',
  Uploaded = 'Uploaded',
}

export type FileWithId = { file: File; id: string };

export type FileInfo = {
  url?: string;
  file?: FileWithId;
  status: FileStatus;
};

interface FileUploaderProps
  extends Omit<FileUploaderDropZoneProps, 'onFileChange'> {
  // onChange: (fileInfo: FileInfo) => void;
  onChange: (resourceUrl?: string | string[]) => void;
  value: string | string[];
  defaultValue: string | string[];
}

export default function FileUploader(props: FileUploaderProps) {
  const { onChange, maxSize, accept, value, defaultValue, ...rest } = props;

  const defaultList = useMemo(() => {
    const data = value || defaultValue;
    if (Array.isArray(data)) {
      return data.map(item => ({
        url: item,
        status: FileStatus.Uploaded,
      }));
    }
    if (typeof data === 'string' && data) {
      return [
        {
          url: data,
          status: FileStatus.Uploaded,
        },
      ];
    }
    return [];
  }, [value, defaultValue]);

  const [fileList, setFileList] = useState<FileInfo[]>(defaultList);

  const onValueChange = (data: FileInfo[]) => {
    const fileInfo = data?.[0];
    onChange(fileInfo?.url);
  };

  // 上传
  const batchUpload = async (files: FileWithId[]) => {
    try {
      // 这里等待了所有的文件并行上传完成后一次性更新状态，因目前只支持单文件上传，暂时不考虑多文件并行上传的情况
      // 后续如需支持多文件并行上传，可以使用 fileInfo 中的 file id 作为唯一标识符更新数组数据
      const data: FileInfo[] = await Promise.all(
        files.map(async file => {
          const { url } = await upload(file.file);
          return {
            file,
            url,
            status: url ? FileStatus.Uploaded : FileStatus.Error,
          };
        }),
      );
      // 上传完后更新状态
      setFileList(
        data.map(item => ({
          ...item,
          resourceUrl: undefined,
        })),
      );
      onValueChange(data);
    } catch {
      const data = files.map(file => ({
        file,
        status: FileStatus.Error,
      }));
      // 失败后更新状态
      setFileList(data);
      onValueChange(data);
    }
  };

  const onFileChange = async (files: FileWithId[]) => {
    setFileList(files.map(file => ({ file, status: FileStatus.Uploading })));

    await batchUpload(files);
  };

  const onRetry = async (file?: FileWithId) => {
    if (!file?.id) {
      return;
    }
    const index = fileList.findIndex(f => f?.file?.id === file.id);

    setFileList(prevState => {
      const newFileList = [...prevState];
      newFileList[index] = {
        ...fileList[index],
        status: FileStatus.Uploading,
      };

      return newFileList;
    });

    const { url } = await upload(file.file);

    setFileList(prevState => {
      const newFileList = [...prevState];
      newFileList[index] = {
        ...fileList[index],
        url,
        status: url ? FileStatus.Uploaded : FileStatus.Error,
      };

      onValueChange(newFileList);

      return newFileList.map(item => ({ ...item, resourceUrl: '' }));
    });
  };

  // 删除
  const onDelete = useCallback(
    (fileId: string) => {
      const index = fileList.findIndex(file => file?.file?.id === fileId);

      setFileList(prevState => {
        const newFileList = [...prevState];
        newFileList.splice(index, 1);

        onValueChange(newFileList);

        return newFileList;
      });
    },
    [fileList],
  );

  if (fileList.length) {
    return (
      <>
        {fileList.map(item => {
          let content;
          if (item.status === FileStatus.Error) {
            content = (
              <UploadError
                name={item?.file?.file?.name || ''}
                onRetry={() => onRetry(item?.file)}
                onDelete={() => onDelete(item?.file?.id || '')}
              />
            );
          } else if (item.status === FileStatus.Uploading) {
            content = <Uploading />;
          } else {
            content = (
              <Display
                file={item.url || item?.file?.file || ''}
                onDelete={() => onDelete(item?.file?.id || '')}
              />
            );
          }
          return (
            <div
              className={cn(
                'min-h-[82px] w-full overflow-hidden flex items-center p-4 rounded-xl border border-default bg-surface-default shadow-background-default space-x-3',
                item.status === FileStatus.Error && 'border-critical',
              )}>
              {content}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <FileUploaderDropZone
      {...rest}
      accept={accept}
      maxSize={maxSize}
      onFileChange={onFileChange}
    />
  );
}
