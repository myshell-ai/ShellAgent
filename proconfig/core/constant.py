import os

# some constant variable
BREAKPOINT_CACHE_DIR='./BREAKPOINT_CACHE_DIR'

def return_breakpoint_cache_dir():
    is_remote = os.environ.get('MODAL_IS_REMOTE', 0) == 1
    if is_remote:
        # here we on modal remote cloud
        save_dir = os.environ.get('BREAKPOINT_CACHE_DIR')
        assert os.path.isdir(save_dir)
    else:
        save_dir = BREAKPOINT_CACHE_DIR
        os.makedirs(save_dir, exist_ok=True)
    return save_dir 