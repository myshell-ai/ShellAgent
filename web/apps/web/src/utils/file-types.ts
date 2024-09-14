import { Accept } from 'react-dropzone';

export const ENABLE_MIME: {
  [key: string]: Accept;
} = {
  audio: {
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/ogg': ['.ogg'],
    'audio/x-ms-wma': ['.wma'],
    'audio/flac': ['.flac'],
    'audio/ape': ['.ape'],
  },
  video: {
    'video/mp4': ['.mp4'],
    'video/x-msvideo': ['.avi'],
    'video/quicktime': ['.mov'],
    'video/x-ms-wmv': ['.wmv'],
    'video/x-flv': ['.flv'],
  },
  other: {
    'application/rtf': ['.rtf'],
    'text/markdown': ['.markdown', '.md'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'application/msword': ['.doc'],
    'text/plain': ['.txt'],
    'text/csv': ['.csv'],
  },
  image: {
    'image/apng': ['.apng'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpeg'],
    'image/jpg': ['.jpg'],
    'image/webp': ['.webp'],
    'image/gif': ['.gif'],
    'image/bmp': ['.bmp'],
    'image/tiff': ['.tiff'],
  },
  all: {
    '*/*': ['*'],
  },
};

export const ENABLE_PREVIEW_FILE = ['audio', 'video', 'image'];

export const ImageRex = /.(jpg|jpeg|png|apng|gif|bmp|tiff|webp)$/;
export const VideoRex = /.(mp4|avi|mov|wmv|flv)$/;
export const AudioRex = /.(mp3|wav|ogg|wma|flac|ape)$/;

export const getLocalTypeBySuffix = (suffix: string) => {
  let result = '';
  Object.keys(ENABLE_MIME).forEach(type => {
    const formats = ENABLE_MIME[type];
    Object.keys(formats).forEach(mimeType => {
      if (formats[mimeType].includes(`.${suffix}`)) {
        result = type;
      }
    });
  });
  return result;
};
