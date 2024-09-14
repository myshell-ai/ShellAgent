import { Heading } from '@shellagent/ui';
import {
  get,
  isEmpty,
  omit,
  isArray,
  isObject,
  forOwn,
  isString,
} from 'lodash-es';

import { useSchemaContext } from '@/stores/workflow/schema-provider';
import { isDeepEmpty } from '@/utils/common-helper';

import {
  Collapse,
  ImageLayout,
  ImageRex,
  ObjectLayout,
  VideoRex,
  VideoLayout,
  ErrorLayout,
} from './display';

function cleanUrl(url: string) {
  const match = url.match(/\/output\/(.+)$/);
  return match ? `output/${match[1]}` : url;
}

function extractMediaUrls(
  data: any,
  imageArray: Array<string> = [],
  videoArray: Array<string> = [],
) {
  if (isArray(data)) {
    data.forEach(item => extractMediaUrls(item, imageArray, videoArray));
  } else if (isObject(data) && data !== null) {
    forOwn(data, value => {
      if (isString(value)) {
        if (ImageRex.test(value)) {
          imageArray.push(cleanUrl(value));
        } else if (VideoRex.test(value)) {
          videoArray.push(cleanUrl(value));
        }
      } else {
        extractMediaUrls(value, imageArray, videoArray);
      }
    });
  } else if (isString(data)) {
    if (ImageRex.test(data)) {
      imageArray.push(cleanUrl(data));
    } else if (VideoRex.test(data)) {
      videoArray.push(cleanUrl(data));
    }
  }
  return { images: imageArray, videos: videoArray };
}

export const Render = () => {
  const { output } = useSchemaContext(state => ({
    output: state.output,
  }));

  const images = get(output, 'result.ui.images', []).map(
    (item: { filename: string; type: string }) =>
      `${item.type}${item.type ? '/' : ''}${item.filename}`,
  );

  if (isDeepEmpty(output)) {
    return null;
  }

  const display = images.length ? omit(output, 'result.ui.images') : output;

  const result = extractMediaUrls({
    ...display,
    images,
  });

  return (
    <Collapse
      defaultExpand
      header={
        <Heading size="h4" lineClamp={1}>
          Render
        </Heading>
      }
      content={
        <div>
          {!isEmpty(result.images) ? (
            <ImageLayout images={result.images} field="images" />
          ) : null}
          {!isEmpty(result.videos) ? (
            <VideoLayout videos={result.videos} field="videos" />
          ) : null}
          {!isEmpty(output?.error_message || output?.error_detail) ? (
            <ErrorLayout error={output} field="error_message" />
          ) : null}
          {!isEmpty(output) ? (
            <ObjectLayout value={output} field="result" />
          ) : null}
        </div>
      }
    />
  );
};
