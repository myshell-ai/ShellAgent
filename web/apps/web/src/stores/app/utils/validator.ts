export async function validateImage(
  image: string | string[],
  maxSize: number = 1000000,
): Promise<boolean | string> {
  let url;

  if (Array.isArray(image)) {
    if (!image.length) {
      return Promise.resolve(true);
    } else if (image.length < 2) {
      url = image?.[0];
    } else {
      return Promise.reject(
        new Error('Avoid using multiple images in the intro message.'),
      );
    }
  } else {
    url = image;
  }
  if (!url || url === '/') {
    return Promise.resolve(true);
  }
  const apiUrl =
    url?.startsWith('/api/files') || url?.startsWith('http')
      ? url
      : `/api/files/${url}`;
  try {
    const response = await fetch(apiUrl, { method: 'GET' });
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const fileSize = parseInt(contentLength, 10);
      if (fileSize > maxSize) {
        // eslint-disable-next-line @typescript-eslint/return-await
        return Promise.reject(new Error('Keep image file size under 1MB.'));
      }
    }
    const image = new Image();
    image.src = apiUrl;
    const imageLoaded = new Promise<void>((resolve, reject) => {
      image.onload = () => {
        if (image.width < image.height) {
          reject(
            new Error('Avoid portrait-shaped images for the intro message.'),
          );
        } else {
          resolve();
        }
      };
      image.onerror = () => console.log('Failed to load image.');
    });
    await imageLoaded;
    // eslint-disable-next-line @typescript-eslint/return-await
    return Promise.resolve(true);
  } catch (error: any) {
    console.log('error: ', error);
    return Promise.reject(error.message || error);
  }
}
