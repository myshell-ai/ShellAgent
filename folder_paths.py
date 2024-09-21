folder_path_file_path = "proconfig/widgets/imagen_widgets/library/ComfyUI/folder_paths.py"

# Load the content of another Python file
with open(folder_path_file_path, 'r') as file:
    file_content = file.read()

# Execute the content
exec(file_content)
