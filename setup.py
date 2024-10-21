from setuptools import setup, find_packages

# Read dependencies from requirements.txt
def parse_requirements(filename):
    with open(filename) as f:
        return f.read().splitlines()

print(find_packages())
setup(
    name="proconfig",
    version="0.1.0",
    description="",
    packages=find_packages(),  # Replace with your actual package
    package_dir={'': '.'},  # Root package directory
    install_requires=parse_requirements("requirements.txt"),
    dependency_links=[
        'git+https://github.com/WASasquatch/cstr',
        'git+https://github.com/WASasquatch/ffmpy.git',
        'git+https://github.com/WASasquatch/img2texture.git'
    ],
)