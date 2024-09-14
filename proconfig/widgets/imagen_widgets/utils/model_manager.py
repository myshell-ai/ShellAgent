import logging
import os
import json
from filelock import FileLock
import requests
import time
import hashlib


def compute_sha256(file_path, chunk_size=1024 ** 2):
    # Create a new sha256 hash object
    sha256 = hashlib.sha256()
    print("start compute sha256 for", file_path)
    # Open the file in binary mode
    with open(file_path, 'rb') as file:
        # Read the file in chunks to handle large files efficiently
        while chunk := file.read(chunk_size):
            sha256.update(chunk)
    print("finish compute sha256 for", file_path)
    # Return the hexadecimal digest of the hash
    return sha256.hexdigest()

def get_file_size(url):
    # Send a HEAD request to the specified URL
    response = requests.head(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Retrieve the Content-Length header from the response
        file_size = response.headers.get('Content-Length')
        
        if file_size:
            return int(file_size)
        else:
            print("Content-Length header is not present.")
            return None
    else:
        print(f"Failed to retrieve the file. HTTP Status code: {response.status_code}")
        return None
    
    
def safe_download(url, cache_path, model_size=None, callback=None, chunk_size=8192):
    os.makedirs(os.path.dirname(cache_path), exist_ok=True)
    logging.debug("waiting to acquire lock on %s", cache_path)
    lock_path = cache_path + '.lock'
    
    start_time = time.time()
    if callback:
        callback('download_start', create_time=start_time, task_status='start')
                
    with FileLock(lock_path):
        if url.startswith("https://civitai.com/") and os.environ.get('CIVITAI_API_KEY'):
            key = os.environ.get('CIVITAI_API_KEY')
            print("using key:", key)
            headers = {'Authorization': f"Bearer {key}"}
        else:
            headers = {}
        response = requests.get(url, stream=True, headers=headers)
        if response.status_code == 200:
            logging.info(f"start download {url} to {cache_path}")

            # Open the specified path for writing in binary mode
            with open(cache_path, 'wb') as file:
                # Iterate over the response content in chunks
                for count, chunk in enumerate(response.iter_content(chunk_size=chunk_size)):
                    # Write each chunk to the file
                    file.write(chunk)
                    if callback and model_size:
                        display_interval = model_size // chunk_size // 100
                        progress = int((count + 1) * chunk_size / model_size * 100)
                        if count % display_interval == 0:
                            callback('downloading', outputs={'progress': progress})
                    if os.path.isfile(cache_path + ".cancel"):
                        logging.info("cancel install")
                        os.remove(cache_path + ".cancel")
                        break
            logging.info(f"finished download {url} to {cache_path}")
        else:
            cache_path = None
            logging.info("fail to download")
    # remove the lock file if it exists
    if os.path.exists(lock_path):
        os.remove(lock_path)
    if callback:
        logging.info("download_end")
        callback('download_end', create_time=start_time, finish_time=time.time(), task_status='failed' if cache_path is None else 'succeeded')
    return cache_path
            
    
def load_ckpt_from_environ_or_disk(model_id, environ, load_fn, load_kwargs={}, ckpt_type="ckpt", is_path=True):
    CKPT_CACHE_NAME = f"{ckpt_type.upper()}_CACHE" 
    # CKPT_CACHE = CACHE_TYPES[ckpt_type]
    if CKPT_CACHE_NAME not in environ:
        environ[CKPT_CACHE_NAME] = {}
    if model_id in environ[CKPT_CACHE_NAME]:
        logging.info(f"Load {model_id} from cache")
        return environ[CKPT_CACHE_NAME][model_id]
    logging.info(f"Load {model_id} from disk")
    
    if is_path:
        environ[CKPT_CACHE_NAME][model_id] = load_fn(model_id, **load_kwargs)
    else:
        environ[CKPT_CACHE_NAME][model_id] = load_fn(**load_kwargs)
    return environ[CKPT_CACHE_NAME][model_id]