/** @jsxImportSource @emotion/react */

'use client';

import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { contentPadding, Icon, TrashIcon } from '@shellagent/ui';
import { Button as AButton, Form, Input, Modal, theme, Typography } from 'antd';
import { Field, FieldArray, FieldProps, Formik } from 'formik';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Box, Flex } from 'react-system';

import { SettingEnvFormValue } from './settings-definitions';
import { SettingsSideBar } from './settings-sidebar';
import { SettingsModel } from './settings.model';

export const SettingsForm = () => {
  const model = useInjection(SettingsModel);
  return (
    <Formik<SettingEnvFormValue>
      initialValues={{
        model_location: '',
        envs: [{ key: '', value: '' }],
      }}
      onSubmit={values => {
        model.saveSettingsEnv(values);
      }}>
      {formikProps => {
        model.setFormikProps(formikProps);
        return (
          <Form layout="vertical">
            <Field name="model_location">
              {({ field, form }: FieldProps) => (
                <Form.Item label="Model Configration">
                  <Input
                    size="large"
                    {...field}
                    onBlur={() => form.submitForm()}
                    placeholder="Location"
                  />
                </Form.Item>
              )}
            </Field>
            <Box mb={2}>
              <Typography.Text>Environment</Typography.Text>
            </Box>
            <FieldArray
              name="envs"
              render={arrayHelpers => (
                <div>
                  {formikProps.values.envs.map((env, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Box key={`fa-${index}`} mb={2}>
                      <Flex mx={-1} alignItems="center">
                        <Box width={1 / 3} mx={1}>
                          <Field name={`envs.${index}.key`}>
                            {({ field, form }: FieldProps) => (
                              <Input
                                size="large"
                                {...field}
                                onBlur={() => form.submitForm()}
                                placeholder="Environment key"
                              />
                            )}
                          </Field>
                        </Box>
                        <Box width={2 / 3} mx={1}>
                          <Field name={`envs.${index}.value`}>
                            {({ field, form }: FieldProps) => (
                              <Input
                                size="large"
                                {...field}
                                onBlur={() => form.submitForm()}
                                placeholder="Environment value"
                              />
                            )}
                          </Field>
                        </Box>
                        <Flex mx={1} alignItems="center">
                          <Icon
                            onClick={() => arrayHelpers.remove(index)}
                            component={TrashIcon}
                          />
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                  <AButton
                    css={css`
                      color: var(--ant-color-primary);
                    `}
                    onClick={() =>
                      arrayHelpers.push({
                        key: '',
                        value: '',
                      })
                    }
                    icon={<PlusOutlined />}>
                    Add
                  </AButton>
                </div>
              )}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export const SettingsDialog = observer(() => {
  const model = useInjection(SettingsModel);
  const { token } = theme.useToken();
  useEffect(() => {
    if (model.modal.isOpen) {
      model.loadSettingsEnvAndFillForm();
    }
  }, [model.modal.isOpen]);
  return (
    <Modal
      className="settings-modal"
      styles={{
        header: {
          padding: `${contentPadding}px`,
          marginBottom: 0,
          borderBottom: `1px solid ${token.colorBorder}`,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        footer: {
          marginTop: 0,
          padding: `${contentPadding}px`,
          borderTop: `1px solid ${token.colorBorder}`,
          borderRadius: `0 0 ${token.borderRadius}px ${token.borderRadius}px`,
        },
        content: {
          padding: 0,
          borderRadius: 24,
          height: '100%',
        },
        body: {
          padding: 0,
          height: '100%',
        },
      }}
      open={model.modal.isOpen}
      width="900px"
      height="80%"
      onCancel={() => model.modal.close()}
      footer={null}>
      <Flex height="100%">
        <SettingsSideBar />
        <div className="w-full flex flex-col">
          <div
            css={css`
              border-top-right-radius: 24px;
              flex: 0 0 48px;
            `}
            className="bg-surface-container-default h-12 px-4 py-2 border-b flex justify-start items-end rounded-none">
            <div className="w-fit text-subtler rounded-none text-base">
              Environment
            </div>
          </div>
          <Box
            p={3}
            css={css`
              overflow-y: auto;
            `}>
            <SettingsForm />
          </Box>
        </div>
      </Flex>
    </Modal>
  );
});
