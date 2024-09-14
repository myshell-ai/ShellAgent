# ShellAgent

## Introduction

ShellAgent is the most powerful, open, and modular Agentic Framework open-sourced by MyShell. It's deeply integrated into MyShell's ecosystem, allowing developers to build powerful AI Apps, publish to MyShell, and earn rewards.

The current ShellAgent mode is on Windows Only, and requires a decent GPU to run. We will support Cloud and Mac version in the future. Due to limited server capability, Cloud version is only supported with limited developers. If you need Cloud version, please contact us with your past building experience, we will gradually open up more seats for developers who need Cloud version.

The widget supports currently focus mainly on image generation relevant ones, we will make sure more widgets will be supported in Q4 2024.

## Installation

### 1. Local Preparation: Download Nvidia Driver

Download the Nvidia Driver for your GPU from the Nvidia official website [https://www.nvidia.com/en-us/drivers/](https://www.nvidia.com/en-us/drivers/).

If deploying on a Data Center, please choose a CUDA version >12.0.

### 2. Download & Extract the One-Click Installation Package

You can find the download link for the ShellAgent installation package from the [Github repository release](https://github.com/myshell-ai/ShellAgent/releases). You can also download it directly from [Hugging Face](https://huggingface.co/myshell-ai/ShellAgent/tree/main).

The installation package includes the ShellAgent framework engine, commonly used widgets and models.

After downloading, extract it locally to complete the installation. No need to handle environment issues.

### 3. Run ShellAgent

Click run.bat in the main directory, wait for the initialization to complete in the command prompt, and then access [http://localhost:8099](http://localhost:8099) in your browser.

### 4. (Optional) Import Local Models Files

For ComfyUI users, ShellAgent supports importing models from local ComfyUI projects.

Set the storage path (absolute path) of the models in settings, and we will merge the models of ShellAgent and the specified directory through symbolic links. After merging, the two directories are similar like shortcuts.

### Common Issues During Installation

[Common Issues During Installation](https://docs.myshell.ai/product-manual/create/shellagent-mode-beta/installation#common-issues-during-installation)

## Usage

[How to Build Workflow](https://docs.myshell.ai/product-manual/create/shellagent-mode-beta/workflow)

[How to Build App](https://docs.myshell.ai/product-manual/create/shellagent-mode-beta/app-builder)

[Publish to MyShell](https://docs.myshell.ai/product-manual/create/shellagent-mode-beta/publish-to-myshell)

[Custom Widget](https://docs.myshell.ai/product-manual/create/shellagent-mode-beta/build-custom-widget)

## License

ShellAgent is GPLv3 licensed.
