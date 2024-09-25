import React, { useState } from 'react';
import NodeForm from '@/components/app/node-form';
import { Button } from '@shellagent/ui';
import { Modal } from 'antd';
import schema from './schema';

const ComfyUIPlugin: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="comfyui-widget flex flex-col gap-y-4">
      <Modal
        title="ComfyUI"
        open={isModalVisible}
        onOk={handleOk}
        okText="export"
        cancelText="done"
        mask={false}
        onCancel={handleCancel}
        width="80%"
        style={{ top: 20 }}>
        <iframe
          src="https://comfyui.myshell.life"
          width="100%"
          height="600px"
          frameBorder="0"></iframe>
      </Modal>
      <NodeForm schema={schema} values={{}} onChange={() => {}} />
      <Button
        onClick={showModal}
        className="w-28 px-8 border border-default shadow-button-primary1"
        size="sm"
        variant="outline">
        Show ComfyUI
      </Button>
    </div>
  );
};

export default ComfyUIPlugin;
