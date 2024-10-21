import {
  UploadOutlined,
  ReloadOutlined,
  ExportOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { Button, useFormContext, Spinner } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { Modal, Upload, Tooltip } from 'antd';
import { useInjection } from 'inversify-react';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { toast } from 'react-toastify';

import { SettingsModel } from '@/components/settings/settings.model';

import { CheckDialog } from '../check-dialog';
import { COMFYUI_API, MessageType, DEFAULT_COMFYUI_API } from '../constant';
import emitter, { EventType } from '../emitter';
import { saveComfy, uploadComfy, getFile } from '../services';
import type { SaveResponse } from '../services/type';
import { isValidUrl, checkDependency } from '../utils';

const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

export const ComfyUIEditor = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [checkDialogOpen, setCheckDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [dependencies, setDependencies] = useState<
    SaveResponse['data']['dependencies'] | null
  >(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getValues, setValue } = useFormContext();
  const model = useInjection(SettingsModel);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const value = useMemo(() => {
    if (settingsDisabled) {
      return DEFAULT_COMFYUI_API;
    }
    return model.envs.get(COMFYUI_API) || '';
  }, [model.envs.get(COMFYUI_API), settingsDisabled]);

  const showModal = () => {
    setModalOpen(true);
  };

  const { run: getComfySchema } = useRequest(getFile, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        const { data } = result;
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD, data },
          value,
        );
      } else {
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD_DEFAULT },
          value,
        );
      }
    },
    onError: () => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: MessageType.LOAD_DEFAULT },
        value,
      );
    },
  });

  const handleCancel = () => {
    setModalOpen(false);
    setIsLoading(true);
  };

  const { run: saveComfyRequest, loading: saveLoading } = useRequest(
    saveComfy,
    {
      manual: true,
      onSuccess: result => {
        if (result.success) {
          const { data } = result;
          const { hasMissingCustomNodes, hasMissingModels } = checkDependency(
            data.dependencies,
          );
          if (hasMissingCustomNodes || hasMissingModels) {
            setCheckDialogOpen(true);
            setDependencies(data.dependencies);
          } else {
            setModalOpen(false);
            const comfy_workflow_id = getValues('comfy_workflow_id');
            emitter.emit(EventType.UPDATE_FORM, {
              data: result.data.schemas,
              id: comfy_workflow_id,
            });
          }
        } else {
          toast.error(result?.message, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        }
      },
    },
  );

  const { run: uploadComfyRequest } = useRequest(uploadComfy, {
    manual: true,
    onSuccess: result => {
      console.log('Upload successful:', result);
    },
  });

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!value) {
        return;
      }

      try {
        const valueUrl = new URL(value);
        if (valueUrl.origin !== event.origin) return;

        const comfy_workflow_id = getValues('comfy_workflow_id');

        switch (event.data.type) {
          case MessageType.LOADED:
            setLoaded(true);
            getComfySchema({
              comfy_workflow_id,
              filename: 'workflow.json',
            });
            console.log('ComfyUI loaded');
            break;
          case MessageType.SAVE:
            saveComfyRequest({
              prompt: event.data.prompt,
              comfyui_api: valueUrl.origin,
              workflow: event.data.workflow,
              name: event.data.name,
              comfy_workflow_id,
            });
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Invalid URL:', error);
      }
    },
    [value, getValues],
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  const handleSave = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: MessageType.SAVE },
      value,
    );
  };

  const handleImport = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.json')) {
      toast.error('Please upload a JSON file', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const comfy_workflow_id = getValues('comfy_workflow_id');
        uploadComfyRequest({
          workflow: json,
          comfy_workflow_id,
        });
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD, data: json },
          value,
        );
      } catch (error) {
        console.error('Invalid JSON file:', error);
        toast.error('Invalid JSON file', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load ComfyUI. Please ensure the API URL correct.');
  };

  const showSettings = () => {
    model.modal.open();
  };

  const showSettingButton = useMemo(() => {
    if (settingsDisabled) {
      return false;
    }
    return !isValidUrl(value);
  }, [value, settingsDisabled]);

  const reloadSettings = async () => {
    const settings = await model.loadSettingsEnv();
    const api = settings?.envs?.find(env => env.key === COMFYUI_API)?.value;
    if (api && isValidUrl(api)) {
      setValue('api', api);
      setIsLoading(true);
    } else {
      toast.error('Invalid ComfyUI API settings', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    }
  };

  const disabled = useMemo(
    () => showSettingButton || isLoading || !loaded,
    [showSettingButton, isLoading, loaded],
  );

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const modalStyles = isFullscreen
    ? {
        mask: {
          height: '100vh',
          width: '100vw',
          margin: 0,
          top: 0,
          paddingBottom: 0,
        },
        wrapper: {
          height: '100vh',
          width: '100vw',
          margin: 0,
          top: 0,
          paddingBottom: 0,
        },
        content: {
          padding: '12px 16px',
          height: '100vh',
          width: '100vw',
          margin: 0,
          top: 0,
          paddingBottom: 0,
        },
        body: {
          height: 'calc(100vh - 55px - 53px)',
          padding: 0,
          overflow: 'hidden',
        },
      }
    : {
        content: {
          padding: '12px 16px',
        },
      };

  return (
    <div>
      <Button size="sm" className="w-full" onClick={showModal}>
        Edit in ComfyUI
      </Button>
      <Modal
        title={
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="text-lg font-medium">ComfyUI Editor</span>
              {error && <div className="text-red-500 font-normal">{error}</div>}
              <ExportOutlined
                className="cursor-pointer text-primary"
                onClick={() => {
                  window.open(value, '_blank');
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Upload
                accept=".json"
                showUploadList={false}
                beforeUpload={file => {
                  handleImport(file);
                  return false;
                }}>
                <Button size="sm" disabled={disabled}>
                  <UploadOutlined className="mr-2" />
                  Import
                </Button>
              </Upload>
              <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                <Button onClick={toggleFullscreen} variant="plain">
                  {isFullscreen ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        }
        styles={modalStyles}
        forceRender
        open={modalOpen}
        onOk={handleSave}
        mask={false}
        width={isFullscreen ? '100%' : '80%'}
        className={isFullscreen ? 'top-0 p-0 m-0' : 'top-5'}
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={disabled}
              loading={saveLoading}>
              Save
            </Button>
          </div>
        }
        closeIcon={null}>
        {isLoading && !showSettingButton && (
          <div className="flex justify-center items-center h-[80vh]">
            <Spinner size="lg" className="text-brand" />
          </div>
        )}
        {showSettingButton && (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="text-center mb-4">
              Failed to connect to ComfyUI at {value || 'undefined address'}.
              Please verify the address or update it in the environment
              settings.
              <Button
                size="sm"
                onClick={showSettings}
                variant="outline"
                className="ml-2">
                Settings
              </Button>
            </div>
            <Button variant="primary" size="sm" onClick={reloadSettings}>
              <ReloadOutlined className="mr-2" />
              Reload
            </Button>
          </div>
        )}
        <iframe
          title="comfyui"
          ref={iframeRef}
          src={value}
          className={`w-full ${isFullscreen ? 'h-full' : 'h-[80vh]'} ${isLoading || showSettingButton ? 'hidden' : ''}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </Modal>
      <CheckDialog
        open={checkDialogOpen}
        setModalOpen={setModalOpen}
        setOpen={setCheckDialogOpen}
        dependencies={dependencies}
        comfy_workflow_id={getValues('comfy_workflow_id')}
      />
    </div>
  );
};
