import React, { useState, useRef, useEffect } from 'react';
import NodeForm from '@/components/app/node-form';
import { Modal, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import schema from './schema';
import { WidgetConfigProps } from '@/components/app/config-form/widget-config';
import { saveComfy, getFile } from './services';
import { useRequest } from 'ahooks';

const ComfyUIPlugin: React.FC<WidgetConfigProps> = ({ values, onChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== values?.api) {
      // 确保消息来源是可信的
      return;
    }
    console.log('Received message from iframe:', event.data);

    // 保存
    if (event.data.type === 'save') {
      saveComfyRequest({
        prompt: event.data.prompt,
        workflow: event.data.workflow,
        name: event.data.name,
        comfy_workflow_id: event.data.comfy_workflow_id,
      });
    }

    // load
    if (event.data.type === '') {
    }
    // 处理接收到的消息
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      // 组件卸载时移除事件监听器
      window.removeEventListener('message', handleMessage);
    };
  }, [values?.api]); // 确保在 api 变化时重新添加事件监听器

  const handleCancel = () => {
    setIsModalVisible(false);
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

  const handleSave = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'save' },
      values?.api,
    );
    setIsModalVisible(false);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'load' },
          values?.api,
        );

        // 处理导入的 JSON 数据
      } catch (error) {
        console.error('Invalid JSON file:', error);
      }
    };
    reader.readAsText(file);
  };

  if (!values) {
    return null;
  }

  return (
    <div className="comfyui-widget flex flex-col">
      <Modal
        title="ComfyUI"
        open={isModalVisible}
        onOk={handleSave}
        okText="Save"
        cancelText="Done"
        mask={false}
        onCancel={handleCancel}
        width="80%"
        height="80%"
        destroyOnClose
        style={{ top: 20 }}
        footer={[
          <Upload
            key="import"
            accept=".json"
            showUploadList={false}
            beforeUpload={file => {
              handleImport(file);
              return false;
            }}>
            <Button>Import</Button>
          </Upload>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Done
          </Button>,
        ]}>
        <iframe ref={iframeRef} src={values?.api} width="100%" height="600px" />
      </Modal>
      <Button
        disabled={!values?.api}
        onClick={showModal}
        className="w-full px-8 border border-default shadow-button-primary1">
        Show ComfyUI
      </Button>
      <NodeForm schema={schema} values={values} onChange={onChange} />
    </div>
  );
};

export default ComfyUIPlugin;
