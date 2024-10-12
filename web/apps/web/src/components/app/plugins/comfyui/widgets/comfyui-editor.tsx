import { UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, useFormContext, Spinner } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { Modal, Upload } from 'antd';
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
import { COMFYUI_API, DEFAULT_COMFYUI_API, MessageType } from '../constant';
import emitter, { EventType } from '../emitter';
import { saveComfy, uploadComfy, getFile } from '../services';
import type { GetFileResponse } from '../services/type';
import { isValidUrl, checkDependency } from '../utils';

export const ComfyUIEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkDialogOpen, setCheckDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [dependencies, setDependencies] = useState<
    GetFileResponse['data']['dependencies'] | null
  >(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getValues } = useFormContext();
  const model = useInjection(SettingsModel);

  const showModal = () => {
    setIsModalVisible(true);
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

  const handleCancel = () => {
    setIsModalVisible(false);
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
            toast.error(
              'Dependencies missing, please check and submit the required dependencies',
              {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: true,
                closeButton: false,
              },
            );
            setCheckDialogOpen(true);
            setDependencies(data.dependencies);
          } else {
            setIsModalVisible(false);
            const comfy_workflow_id = getValues('comfy_workflow_id');
            emitter.emit(EventType.UPDATE_FORM, {
              data: result.data.schemas,
              id: comfy_workflow_id,
            });
          }
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

  const handleSave = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: MessageType.SAVE },
      value,
    );
  };

  const handleImport = (file: File) => {
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
        // 处理导入的 JSON 数据
      } catch (error) {
        console.error('Invalid JSON file:', error);
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
    if (!value) {
      return true;
    }
    return !isValidUrl(value);
  }, [value]);

  const reloadSettings = async () => {
    const settings = await model.loadSettingsEnv();
    const api =
      settings?.envs?.find(env => env.key === COMFYUI_API)?.value ||
      DEFAULT_COMFYUI_API;
    onChange(api);
    if (api && isValidUrl(api)) {
      setIsLoading(true);
    }
  };

  const disabled = useMemo(
    () => showSettingButton || isLoading || !loaded,
    [showSettingButton, isLoading, loaded],
  );

  return (
    <div>
      <Button
        size="sm"
        className="w-full"
        onClick={showModal}
        disabled={!value}>
        Edit in ComfyUI
      </Button>
      <Modal
        title={
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span>ComfyUI Editor</span>
              {error && <div className="text-red-500 font-normal">{error}</div>}
            </div>
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
          </div>
        }
        open={isModalVisible}
        onOk={handleSave}
        mask={false}
        width="80%"
        className="top-5"
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
        {isLoading && (
          <div className="flex justify-center items-center h-[600px]">
            <Spinner size="lg" className="text-brand" />
          </div>
        )}
        {showSettingButton && (
          <div className="flex flex-col gap-2 justify-center items-center h-[600px]">
            <div>
              There is an issue with the ComfyUI API settings, please reset them
              <Button size="sm" onClick={showSettings} className="ml-2">
                Settings
              </Button>
            </div>
            <div>
              After completing the settings, please click
              <Button
                variant="outline"
                size="sm"
                onClick={reloadSettings}
                className="ml-2">
                <ReloadOutlined className="mr-2" />
                Reload
              </Button>
            </div>
          </div>
        )}
        <iframe
          title="comfyui"
          ref={iframeRef}
          src={value}
          height="600px"
          className={`w-full ${isLoading || showSettingButton ? 'hidden' : ''}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </Modal>
      <CheckDialog
        open={checkDialogOpen}
        setOpen={setCheckDialogOpen}
        dependencies={dependencies}
        comfy_workflow_id={getValues('comfy_workflow_id')}
      />
    </div>
  );
};
