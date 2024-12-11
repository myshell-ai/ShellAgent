export async function validateImage(
  image: string | string[],
  maxSize: number = 1000000,
): Promise<boolean | string> {
  return new Promise(async (resolve, reject) => {
    let url;

    if (Array.isArray(image)) {
      if (!image.length) {
        resolve(true);
      } else if (image.length < 2) {
        url = image[0];
      } else {
        return reject('Avoid using multiple images in the intro message.');
      }
    } else {
      url = image;
    }
    if (!url) {
      return resolve(true);
    }
    const apiUrl = url?.startsWith('/api/files') ? url : `/api/files/${url}`;
    try {
      // 校验文件大小
      const response = await fetch(apiUrl, { method: 'GET' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const fileSize = parseInt(contentLength, 10);
        if (fileSize > maxSize) {
          return reject('Keep image file size under 1MB.');
        }
      }
      // 校验图片尺寸
      const image = new Image();
      image.src = apiUrl;
      const imageLoaded = new Promise<void>(() => {
        image.onload = () => {
          if (image.width < image.height) {
            reject('Avoid portrait-shaped images for the intro message.');
          } else {
            resolve(true);
          }
        };
        image.onerror = () => console.log('Failed to load image.');
      });
      await imageLoaded;
      resolve(true);
    } catch (error) {
      console.log('error: ', error);
      // reject('Validation failed.');
    }
  });
}
