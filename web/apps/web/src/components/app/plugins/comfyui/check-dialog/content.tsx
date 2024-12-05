import { DeleteOutlined } from '@ant-design/icons';
import { Text } from '@shellagent/ui';
import { Button, Form, FormInstance, Input, Tabs } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import { checkDependency, formatDependencyData2Form } from '../comfyui-utils';
import type { SaveResponse } from '../services/type';

interface CheckerContentProps {
  formRef: React.RefObject<FormInstance>;
  dependencies: SaveResponse['data']['dependencies'] | null;
}

export enum CheckTypeEnum {
  customNode = 'customNode',
  model = 'model',
}

const CustomNodeForm: React.FC = () => (
  <>
    <p className="mb-4 text-sm text-gray-500">
      <ul>
        <li>
          The following custom nodes lack Git information (.git files), likely
          due to being unpublished or copied/unzipped without Git operations.
        </li>
        <li>
          Please update them via Git or ComfyUI-Manager, or provide public Git
          links.
        </li>
      </ul>
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
                required
                name={[field.name, 'name']}
                label="Name">
                <Input
                  variant="filled"
                  readOnly
                  placeholder="Enter custom node name"
                />
              </Form.Item>
              <Form.Item
                {...field}
                required
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
);

const ModelForm: React.FC = () => (
  <>
    <p className="mb-4 text-sm text-gray-500">
      <ul>
        <li>
          Public download links for the following models are unavailable,
          possibly due to privacy or lack of popularity.
        </li>
        <li>Please provide valid public download links.</li>
      </ul>
    </p>
    <Form.List name="missing_models">
      {fields => (
        <>
          {fields.map(field => (
            <div
              key={field.key}
              className="mb-6 p-4 border border-gray-200 rounded-md bg-surface-subtle">
              <Form.Item hidden {...field} name={[field.name, 'id']}>
                <Input hidden />
              </Form.Item>
              <Form.Item
                {...field}
                required
                name={[field.name, 'filename']}
                label="Filename">
                <Input variant="filled" readOnly placeholder="Filename" />
              </Form.Item>
              <Form.Item
                {...field}
                required
                name={[field.name, 'save_path']}
                label="Save Path">
                <Input variant="filled" readOnly placeholder="Save path" />
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
                        tooltip={
                          urlIndex === 0 ? (
                            <div>
                              We recommend using publicly accessible links, such
                              as those from Hugging Face. If your download link
                              is private or temporary, please consider using a
                              different link or uploading your model to Hugging
                              Face.
                              <br />
                              The download link for a model should directly
                              start downloading the model file when clicked,
                              rather than directing to an informational webpage
                              about the model. For example, on Hugging Face, the
                              download link for flux1-dev is
                              https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors?download=true.
                            </div>
                          ) : (
                            ''
                          )
                        }
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
                              {
                                warningOnly: true,
                                validator: (_, url: string) => {
                                  if (
                                    url?.includes('huggingface.co') &&
                                    !url?.includes('resolve/main')
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `HuggingFace warning："The download link for models on Hugging Face should be the URL associated with the download button for the model file found under the 'Files' tab. For example: https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors?download=true."`,
                                      ),
                                    );
                                  }
                                  if (
                                    url?.includes('civitai.com') &&
                                    !url?.includes('api/download/models')
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `Civitai warning: "The download link for models on Civitai should be the URL associated with the download button for the model or file listed in the 'File' information card. For example: https://civitai.com/api/download/models/691639?type=Model&format=SafeTensor&size=full&fp=fp32."`,
                                      ),
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                            noStyle>
                            <Input
                              style={{ width: 'calc(100% - 28px)' }}
                              placeholder="Enter URL"
                            />
                          </Form.Item>
                          {urlFields.length && (
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
                        + Add URL
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
);

export const CheckerContent: React.FC<CheckerContentProps> = ({
  formRef,
  dependencies,
}) => {
  const [type, setType] = useState<CheckTypeEnum>(CheckTypeEnum.customNode);
  const [form] = Form.useForm();

  const {
    hasMissingCustomNodes,
    hasMissingModels,
    missingCustomNodes,
    missingModels,
  } = useMemo(() => checkDependency(dependencies), [dependencies]);

  useEffect(() => {
    setType(
      hasMissingCustomNodes ? CheckTypeEnum.customNode : CheckTypeEnum.model,
    );
  }, [hasMissingCustomNodes]);

  const tabItems = useMemo(() => {
    const items = [];

    if (hasMissingCustomNodes) {
      items.push({
        key: CheckTypeEnum.customNode,
        label: 'Custom Node',
        children: <CustomNodeForm />,
      });
    }

    if (hasMissingModels) {
      items.push({
        key: CheckTypeEnum.model,
        label: 'Models',
        children: <ModelForm />,
      });
    }

    return items;
  }, [hasMissingCustomNodes, hasMissingModels]);

  const handleTabChange = (activeKey: string) => {
    setType(activeKey as CheckTypeEnum);
  };

  const initialValues = useMemo(
    () =>
      formatDependencyData2Form({
        missing_custom_nodes: missingCustomNodes,
        missing_models: missingModels,
      }),
    [missingCustomNodes, missingModels],
  );

  return (
    <>
      <Text className="text-sm text-gray-500 px-4 pt-2">
        Dependency metadata is required for other environments like MyShell to
        run the workflow correctly.
      </Text>
      <Form
        form={form}
        layout="vertical"
        ref={formRef}
        initialValues={initialValues}
        preserve>
        <Tabs
          activeKey={type}
          onChange={handleTabChange}
          className="w-full px-4"
          items={tabItems}
        />
      </Form>
    </>
  );
};
