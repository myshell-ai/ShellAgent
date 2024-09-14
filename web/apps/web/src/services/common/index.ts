import { toast } from 'react-toastify';

export interface UploadResponse {
  url: string;
}

export async function upload(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file, file.name);
  const response: { file_path: string } = await fetch('/api/upload', {
    method: 'post',
    body: formData,
  })
    .then(res => res.json())
    .catch(() => {
      toast.error('upload error', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    });
  return {
    url: response?.file_path,
  };
}
