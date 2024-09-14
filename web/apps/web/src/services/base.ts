import { toast } from 'react-toastify';

export interface Response<T> {
  data: T;
  success: boolean;
  message?: string;
}

type OptionType = Omit<RequestInit, 'body'> & {
  params?: Record<string, any>;
  body?: BodyInit | Record<string, any> | null;
};

// 超时时间30s
const TIME_OUT = 30000;

const ContentType = {
  json: 'application/json',
  stream: 'text/event-stream',
  form: 'application/x-www-form-urlencoded; charset=UTF-8',
  download: 'application/octet-stream', // for download
  upload: 'multipart/form-data', // for upload
};

const baseOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include', // always send cookies、HTTP Basic authentication.
  headers: {
    'Content-Type': ContentType.json,
  },
  redirect: 'follow',
};

// 通用fetch，后续再次基础上拓展
export const customFetch = async <T>(
  url: string,
  fetchOptions: OptionType,
): Promise<T> => {
  const options = {
    ...baseOptions,
    ...fetchOptions,
  };
  const { method, body, params } = options;

  if (method === 'GET' && params) {
    const paramsArray: string[] = [];
    Object.keys(params).forEach(key =>
      paramsArray.push(`${key}=${encodeURIComponent(params[key])}`),
    );
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
    delete options.params;
  }

  if (method === 'POST') {
    if (body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        options.body = JSON.stringify(body);
      }
    }
    if (params) {
      if (params instanceof FormData) {
        options.body = params;
      } else {
        options.body = JSON.stringify(params);
      }
    }
  }
  let headers: Record<string, any>;
  if (options?.headers) {
    headers = options.headers;
  } else if (options?.body && options.body instanceof FormData) {
    headers = {};
  } else {
    headers = { 'Content-Type': 'application/json' };
  }

  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('request timeout'));
      }, TIME_OUT);
    }),
    new Promise((resolve, reject) => {
      globalThis
        .fetch(url, {
          ...options,
          headers,
        } as RequestInit)
        .then(response => {
          const contentType = response.headers.get('content-type');
          const contentDisposition = response.headers.get(
            'content-disposition',
          );

          let result;
          if (
            contentType &&
            (contentType.includes('application/json') ||
              contentType.includes('text/plain'))
          ) {
            result = response.json();
          } else if (contentDisposition?.includes('attachment')) {
            result = response.blob();
          } else {
            result = response;
          }

          if (response.status > 400) {
            const errorMessage = `HTTP error! status: ${response.status}`;
            reject(new Error(errorMessage));
          }

          resolve(result);
        })
        .catch(err => {
          toast.error(err.message || 'server error', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });

          reject(err);
        });
    }),
  ]) as Promise<T>;
};

export const APIFetch = {
  get: async <T>(url: string, options: OptionType = {}) => {
    return customFetch<T>(url, { ...options, method: 'GET' });
  },
  post: async <T>(url: string, options: OptionType = {}) => {
    return customFetch<T>(url, { ...options, method: 'POST' });
  },
};
