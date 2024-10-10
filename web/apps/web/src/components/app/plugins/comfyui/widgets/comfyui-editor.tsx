import { UploadOutlined } from '@ant-design/icons';
import { Input, Button, useFormContext, Spinner } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { Modal, Upload } from 'antd';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { saveComfy, uploadComfy, getFile } from '../services';
import emitter, { EventType } from '../emitter';

export const ComfyUIEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getValues } = useFormContext();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const { run: getComfySchema } = useRequest(getFile, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        const {
          data: { workflow },
        } = result;
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'load', data: workflow },
          value,
        );
      }
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
          case 'loaded':
            setLoaded(true);
            getComfySchema({
              comfy_workflow_id,
              filename: 'workflow.json',
            });
            console.log('ComfyUI loaded');
            break;
          case 'save':
            saveComfyRequest({
              prompt: event.data.prompt,
              comfyui_api: valueUrl.origin,
              workflow: event.data.workflow,
              name: event.data.name,
              comfy_workflow_id,
            });
            setIsModalVisible(false);
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

  const { run: saveComfyRequest } = useRequest(saveComfy, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        const comfy_workflow_id = getValues('comfy_workflow_id');
        emitter.emit(EventType.UPDATE_FORM, {
          data: result.data.schemas,
          id: comfy_workflow_id,
        });
      }
    },
  });

  const { run: uploadComfyRequest } = useRequest(uploadComfy, {
    manual: true,
    onSuccess: result => {
      console.log('Upload successful:', result);
    },
  });

  const handleSave = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'save' }, value);
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
          { type: 'load', data: json },
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

  return (
    <div>
      <div className="mb-4 flex items-center">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          htmlFor="comfyui-api"
          className="w-12 mr-3 text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-30 break-all flex items-center">
          API
        </label>
        <Input
          id="comfyui-api"
          size="sm"
          value={value}
          onChange={e => {
            onChange(e.target.value);
          }}
          placeholder="Enter ComfyUI API"
          className="w-full"
        />
      </div>
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
              <Button size="sm">
                <UploadOutlined className="mr-2" />
                Import
              </Button>
            </Upload>
          </div>
        }
        open={isModalVisible}
        onOk={handleSave}
        okText="保存"
        cancelText="完成"
        mask={false}
        width="80%"
        className="top-5"
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
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
        <iframe
          title="comfyui"
          ref={iframeRef}
          src={value}
          height="600px"
          className={`w-full ${isLoading ? 'hidden' : ''}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </Modal>
    </div>
  );
};
