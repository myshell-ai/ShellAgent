import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, useFormContext, Spinner } from '@shellagent/ui';
import { Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { saveComfy, uploadComfy } from '../services';

export const ComfyUIEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getValues } = useFormContext();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleMessage = (event: MessageEvent) => {
    try {
      const valueUrl = new URL(value);

      if (valueUrl.origin !== event.origin) {
        return;
      }
      // 处理 'loaded' 消息
      if (event.data.type === 'loaded') {
        setLoaded(true);
        console.log('ComfyUI loaded');
      }
      // 保存
      if (event.data.type === 'save') {
        const comfy_workflow_id = getValues('comfy_workflow_id');
        saveComfyRequest({
          prompt: event.data.prompt,
          comfyui_api: valueUrl.origin,
          workflow: event.data.workflow,
          name: event.data.name,
          comfy_workflow_id,
        });
      }
    } catch (error) {
      console.error('Invalid URL:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsLoading(true);
  };

  const { run: saveComfyRequest } = useRequest(saveComfy, {
    manual: true,
    onSuccess: result => {
      console.log('Save successful:', result);
    },
    onError: error => {
      console.error('Save failed:', error);
    },
  });

  const { run: uploadComfyRequest } = useRequest(uploadComfy, {
    manual: true,
    onSuccess: result => {
      console.log('Save successful:', result);
    },
    onError: error => {
      console.error('Save failed:', error);
    },
  });

  const handleSave = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'save' }, value);
    setIsModalVisible(false);
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
        // TODO
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

  return (
    <div>
      <div className="mb-4 flex items-center">
        <label className="w-12 mr-3 text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-30 break-all flex items-center">
          API
        </label>
        <Input
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
            <span>ComfyUI Editor</span>
            <Upload
              accept=".json"
              showUploadList={false}
              beforeUpload={file => {
                handleImport(file);
                return false;
              }}>
              <Button size="sm" disabled={!loaded}>
                <UploadOutlined className="mr-2" />
                Import
              </Button>
            </Upload>
          </div>
        }
        open={isModalVisible}
        onOk={handleSave}
        okText="Save"
        cancelText="Done"
        mask={false}
        width="80%"
        className="top-5"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              key="cancel"
              size="sm"
              variant="outline"
              onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              key="save"
              size="sm"
              onClick={handleSave}
              disabled={!loaded}>
              Save
            </Button>
          </div>
        }
        closeIcon={null}>
        {/* {isLoading && (
          <div className="flex justify-center items-center h-[600px]">
            <Spinner size="lg" className="text-brand" />
          </div>
        )} */}
        <iframe
          ref={iframeRef}
          src={value}
          height="600px"
          // className={`w-full ${isLoading ? 'hidden' : ''}`}
          className="w-full"
          onLoad={handleIframeLoad}
        />
      </Modal>
    </div>
  );
};
