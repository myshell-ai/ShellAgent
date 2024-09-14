import { ImageProviewGroup } from '@shellagent/ui';
import ReactPlayer from 'react-player';

import { ImageRex, VideoRex, AudioRex } from '@/utils/file-types';

import Audio from '../uploader/display/audio';

const FileRender = ({ url }: { url: string }) => {
  if (ImageRex.test(url)) {
    return (
      <ImageProviewGroup
        images={[
          {
            src: url?.startsWith('data/upload')
              ? `/api/files/${url}`
              : `/api/files/input/${url}`,
            width: '100%',
            height: '100%',
            wrapperClassName:
              'border-0 w-full h-full object-cover rounded-lg overflow-hidden',
          },
        ]}
      />
    );
  }
  if (VideoRex.test(url)) {
    return (
      <ReactPlayer
        url={
          url?.startsWith('data/upload')
            ? `/api/files/${url}`
            : `/api/files/input/${url}`
        }
        width="100%"
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
    );
  }
  if (AudioRex.test(url)) {
    return (
      <div className="p-4 rounded-xl border border-default bg-surface-default shadow-background-default">
        <Audio
          src={
            url?.startsWith('data/upload')
              ? `/api/files/${url}`
              : `/api/files/input/${url}`
          }
          name={url}
          deleteEle={null}
        />
      </div>
    );
  }
  return null;
};

export { FileRender };
