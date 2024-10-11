import { DeleteOutlined } from '@ant-design/icons';
import { Form, Input, Button, FormInstance, Tabs } from 'antd';
import React, { useState, useMemo, useEffect } from 'react';

import type { GetFileResponse } from '../services/type';
import { checkDependency } from '../utils';

interface CheckerContentProps {
  formRef: React.RefObject<FormInstance>;
  dependencies: GetFileResponse['data']['dependencies'] | null;
}

export enum CheckTypeEnum {
  customNode = 'customNode',
  model = 'model',
}

export const CheckerContent: React.FC<CheckerContentProps> = ({
  formRef,
  dependencies,
}) => {
  const [type, setType] = useState(CheckTypeEnum.customNode);

  const [form] = Form.useForm();
  const {
    hasMissingCustomNodes,
    hasMissingModels,
    missingCustomNodes,
    missingModels,
  } = checkDependency(dependencies);

  useEffect(() => {
    setType(
      hasMissingCustomNodes ? CheckTypeEnum.customNode : CheckTypeEnum.model,
    );
  }, [hasMissingCustomNodes, hasMissingModels]);

  const tabItems = useMemo(() => {
    const items = [];

    if (hasMissingCustomNodes) {
      items.push({
        key: CheckTypeEnum.customNode,
        label: 'Custom Node',
        children: (
          <>
            <p className="mb-4 text-sm text-gray-500">
              The following components are currently untracked. Please provide
              additional details to ensure proper import for users.
            </p>
            <Form.List name="missing_custom_nodes">
              {fields => (
                <>
                  {fields.map(field => (
                    <div
                      key={field.key}
                      className="mb-6 p-4 border border-gray-200 rounded-md bg-surface-subtle">
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        label="Name">
                        <Input readOnly placeholder="Enter custom node name" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'repo']}
                        label="Repository"
                        rules={[
                          {
                            required: true,
                            message: 'Please input the repository URL',
                          },
                        ]}>
                        <Input placeholder="Enter Git repository URL" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'commit']}
                        label="Commit">
                        <Input placeholder="Enter Git commit hash (optional)" />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </>
        ),
      });
    }

    if (hasMissingModels) {
      items.push({
        key: CheckTypeEnum.model,
        label: 'Models',
        children: (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Please provide URLs for the missing models to ensure proper
              import.
            </p>
            <Form.List name="missing_models">
              {fields => (
                <>
                  {fields.map(field => (
                    <div
                      key={field.key}
                      className="mb-6 p-4 border border-gray-200 rounded-md bg-surface-subtle">
                      <Form.Item
                        {...field}
                        name={[field.name, 'filename']}
                        label="Filename">
                        <Input readOnly placeholder="Filename" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'save_path']}
                        label="Save Path">
                        <Input readOnly placeholder="Save path" />
                      </Form.Item>
                      <Form.List
                        name={[field.name, 'urls']}
                        rules={[
                          {
                            validator: async (_, urls) => {
                              if (!urls || urls.length < 1) {
                                return Promise.reject(
                                  new Error('At least one URL is required'),
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}>
                        {(urlFields, { add: addUrl, remove: removeUrl }) => (
                          <>
                            {urlFields.map((urlField, urlIndex) => (
                              <Form.Item
                                key={urlField.key}
                                label={urlIndex === 0 ? 'URL' : ''}
                                required>
                                <Input.Group compact>
                                  <Form.Item
                                    {...urlField}
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                      {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please input URL',
                                      },
                                    ]}
                                    noStyle>
                                    <Input
                                      style={{ width: 'calc(100% - 28px)' }}
                                      placeholder="Enter URL"
                                    />
                                  </Form.Item>
                                  {urlFields.length > 1 && (
                                    <Button
                                      onClick={() => removeUrl(urlField.name)}
                                      icon={<DeleteOutlined />}
                                    />
                                  )}
                                </Input.Group>
                              </Form.Item>
                            ))}
                            <Form.Item>
                              <Button
                                type="link"
                                onClick={() => addUrl()}
                                className="p-0">
                                + 添加URL
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </>
        ),
      });
    }

    return items;
  }, [form, dependencies]);

  const handleTabChange = (activeKey: string) => {
    setType(activeKey as CheckTypeEnum);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      ref={formRef}
      disabled={type === CheckTypeEnum.customNode}>
      <Tabs
        activeKey={type}
        onChange={handleTabChange}
        className="w-full px-4"
        items={tabItems}
      />
    </Form>
  );
};
