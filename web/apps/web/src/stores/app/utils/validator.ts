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
        reject(new Error('Avoid using multiple images in the intro message.'));
        return;
      }
    } else {
      url = image;
    }
    if (!url) {
      resolve(true);
      return;
    }
    const apiUrl = url?.startsWith('/api/files') ? url : `/api/files/${url}`;
    try {
      // 校验文件大小
      const response = await fetch(apiUrl, { method: 'GET' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const fileSize = parseInt(contentLength, 10);
        if (fileSize > maxSize) {
          return reject(new Error('Keep image file size under 1MB.'));
        }
      }
      // 校验图片尺寸
      const image = new Image();
      image.src = apiUrl;
      const imageLoaded = new Promise<void>(() => {
        image.onload = () => {
          if (image.width < image.height) {
            reject(
              new Error('Avoid portrait-shaped images for the intro message.'),
            );
          } else {
            resolve(true);
          }
        };
        image.onerror = () => console.log('Failed to load image.');
      });
      await imageLoaded;
      resolve(true);
      return;
    } catch (error) {
      console.log('error: ', error);
      // reject('Validation failed.');
      return;
    }
  });
}
