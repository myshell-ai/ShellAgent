import json
import hashlib
import os
import requests
from proconfig.utils.pytree import tree_map
import logging
import time
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse
from typing import Any, IO
import tempfile
import uuid
from pathlib import PurePosixPath, Path, PureWindowsPath
from proconfig.core.exception import ShellException

def is_valid_url(candidate_str: Any) -> bool:
    if not isinstance(candidate_str, str):
        return False
    parsed = urlparse(candidate_str)
    return parsed.scheme != "" and parsed.netloc != ""
    
def _make_temp_file(file_path: str) -> IO:
    """
    A utility function to write bytes to a temporary file. This is useful
    if one needs to pass a file object to a function, but only has bytes.
    """
    # If the source is a valid url, we will download the content and return it.
    try:
        content = requests.get(file_path).content
    except Exception:
        raise ValueError(f"Failed to download content from url: {file_path}")
    
    _, extension = os.path.splitext(file_path)
    # get the temp file path
    f = tempfile.NamedTemporaryFile(delete=False, suffix=extension)
    f.write(content)
    # Flush to make sure that the content is written.
    f.flush()
    # Seek to the beginning of the file so that the content can be read.
    f.seek(0)
    print(f'download url resources success to {f.name}')
    return f

def windows_to_linux_path(windows_path):
    return PureWindowsPath(windows_path).as_posix()

def is_serializable_type(variable):
    native_types = (int, float, str, bool, list, tuple, dict, set)
    return isinstance(variable, native_types)

def convert_unserializable(var):
    if var is None:
        return None
    if not is_serializable_type(var):
        var_id = str(id(var))
        return var_id
    return var

def convert_unserializable_display(var):
    if var is None:
        return None
    if not is_serializable_type(var):
        try:
            import torch
            if isinstance(var, torch.Tensor):
                return f"Tensor: {var.size()}".replace("torch.", "")
        except:
            pass
        if isinstance(var, np.ndarray):
            return f"Array: {var.shape}"
        elif isinstance(var, object):
            return var.__class__.__name__
        else:
            return str(type(var))
    return var

def hash_dict(d):
    """
    Convert a dictionary to a hash code.

    Parameters:
    d (dict): The dictionary to be hashed.

    Returns:
    str: The resulting hash code as a hexadecimal string.
    """
    d = tree_map(convert_unserializable, d)
    # Convert dictionary to a JSON string
    dict_str = json.dumps(d, sort_keys=True)
    
    # Create a hash object
    hash_obj = hashlib.sha256()
    
    # Encode the string and update the hash object
    hash_obj.update(dict_str.encode('utf-8'))
    
    # Get the hexadecimal representation of the hash
    hash_code = hash_obj.hexdigest()
    
    return hash_code

import random
import string

def generate_random_string(length=8):
    """
    Generate a random string of specified length.

    Parameters:
    length (int): The length of the random string to be generated. Default is 8.

    Returns:
    str: The generated random string.
    """
    # Define the character set: lowercase, uppercase letters, and digits
    char_set = string.ascii_letters + string.digits
    
    # Generate a random string
    random_string = ''.join(random.choice(char_set) for _ in range(length))
    
    return random_string

ext_to_type = {
    # image
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    # video
    '.mp4': 'video/mp4',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    # audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
    # json
    '.json': 'text/plain',
}

def process_local_file_path_async(config, max_workers=10):
    # max_workers: 10
    mapping_dict = {}
    
    def collect_local_file(item):
        if not isinstance(item, str):
            return
        # required file type
        if os.path.isfile(item):
            fpath = item
        elif os.path.isfile(f"input/{item}"):
            fpath = f"input/{item}"
        else:
            fpath = None
        if fpath is not None:
            ext = os.path.splitext(fpath)[1]
            if ext.lower() in ext_to_type.keys():
                mapping_dict[item] = fpath
                return
            else:
                return
            
    tree_map(collect_local_file, config)
    # now save all the files in mapping dict to myshell
        
    # Using ThreadPoolExecutor for concurrent file processing
    logging.info(f"upload start, {len(mapping_dict)} to upload")
    start_time = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit tasks to the executor
        futures = {executor.submit(upload_file_to_myshell, full_path): filename for filename, full_path in mapping_dict.items()}
        logging.info("submit done")
        # Collect the results as they complete
        for future in as_completed(futures):
            filename = futures[future]
            try:
                result = future.result()
                mapping_dict[filename] = result
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    end_time = time.time()
    logging.info(f"upload end, elapsed time: {end_time - start_time}")
    # save back
    config = tree_map(lambda x: mapping_dict.get(x, x), config)
    return config
            
            

def process_local_file_path(item):
    if not isinstance(item, str):
        return item
    # required file type
    if os.path.isfile(item):
        fpath = item
    elif os.path.isfile(os.path.join("input", item)):
        fpath = os.path.join("input", item)
    else:
        fpath = None
    if fpath is not None:
        ext = os.path.splitext(fpath)[1]
        if ext.lower() in ext_to_type.keys():
            return upload_file_to_myshell(fpath)
        else:
            return item
    else:
        return item

def upload_file_to_myshell(local_file: str) -> str:
    ''' Now we only support upload file one-by-one
    '''
    MYSHELL_KEY = os.environ.get('MYSHELL_KEY')
    if MYSHELL_KEY is None:
        error = {
            'error_code': 'SHELL-1108',
            'error_head': 'Missing MYSHELL_KEY', 
            'msg': f"MYSHELL_KEY not found in ENV. Please set MYSHELL_KEY in settings for CDN uploading.",
        }
        raise ShellException(**error)

    server_url = "https://openapi.myshell.ai/public/v1/store"
    headers = {
        'x-myshell-openapi-key': MYSHELL_KEY
    }

    assert os.path.isfile(local_file)
    start_time = time.time()
    ext = os.path.splitext(local_file)[1]
    files = [
        ('file', (os.path.basename(local_file), open(local_file, 'rb'), ext_to_type[ext.lower()])),
    ]
    response = requests.request("POST", server_url, headers=headers, files=files)
    if response.status_code == 200:
        end_time = time.time()
        logging.info(f"{local_file} uploaded, time elapsed: {end_time - start_time}")
        return response.json()['url']
    else:
        error = {
            'error_code': 'SHELL-1109',
            'error_head': 'HTTP Request Error', 
            'msg': f"[HTTP ERROR] {response.status_code} - {response.text} \n",
        }
        raise ShellException(**error)
    
    
def generate_comfyui_workflow_id():
    return str(uuid.uuid4()).replace('-', '')
    
import pygit2
import subprocess
def get_current_version():
    pygit2.option(pygit2.GIT_OPT_SET_OWNER_VALIDATION, 0)
    repo = pygit2.Repository(os.getcwd())
    
    origin_main_commit_oid = repo.references['refs/remotes/origin/main'].target
    current_commit = repo.head.target
    try:
        # Run git fetch with --all and --tags options
        subprocess.run(["git", "fetch", "--all", "--tags"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("Successfully fetched all branches and tags.")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred: {e.stderr.decode().strip()}")
    # remote.fetch()
    # Iterate over all references and filter for tags
    tags_info = []
    for ref_name in repo.references:
        if ref_name.startswith('refs/tags/'):
            tag = repo.references[ref_name]
            peeled_commit = tag.peel(pygit2.Commit)  # Peel to commit (works for annotated and lightweight tags)
            if peeled_commit.id == current_commit:
                return ref_name.split('/')[-1]
            # Check if the tag points to a commit in the ancestry of origin/main
            if repo.descendant_of(origin_main_commit_oid, peeled_commit.id):
                tags_info.append({
                    'name': ref_name.split('/')[-1],
                    'oid': peeled_commit.id,
                    'message': peeled_commit.message,
                    'author': peeled_commit.author.name,
                    'date': peeled_commit.commit_time  # Unix timestamp
                })

    # Sort tags by commit time (descending)
    tags_info.sort(key=lambda x: x['date'], reverse=False)
    return tags_info[-1]['name']


if __name__ == "__main__":
    print(get_current_version())