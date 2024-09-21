from proconfig.utils.misc import is_valid_url, _make_temp_file

folder_path_file_path = "proconfig/widgets/imagen_widgets/library/ComfyUI/folder_paths.py"

# Load the content of another Python file
with open(folder_path_file_path, 'r') as file:
    file_content = file.read()

# Execute the content
exec(file_content)


def get_annotated_filepath(name: str, default_dir: str | None=None) -> str:
    # in case there is space before name. eg. " xxx.jpg"
    name, base_dir = annotated_filepath(name.strip())

    if base_dir is None:
        # find a https url
        if is_valid_url(name):
            src = _make_temp_file(name)
            return src.name

        if default_dir is not None:
            base_dir = default_dir
        else:
            base_dir = get_input_directory()  # fallback path

    return os.path.join(base_dir, name)