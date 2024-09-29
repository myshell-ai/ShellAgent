/** @jsxImportSource @emotion/react */

'use client';

import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { AButton, contentPadding, Icon, TrashIcon, Text } from '@shellagent/ui';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Switch,
  theme,
  Typography,
} from 'antd';
import { Field, FieldArray, FieldProps, Formik } from 'formik';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Box, Flex } from 'react-system';
import Markdown from 'react-markdown';
import { SettingEnvFormValue } from './settings-definitions';
import { SettingsSideBar } from './settings-sidebar';
import { SettingsModel } from './settings.model';
import dayjs from 'dayjs';

export const EnvForm = () => {
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
                  <Button
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
                  </Button>
                </div>
              )}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export const Update = observer(() => {
  const model = useInjection(SettingsModel);
  useEffect(() => {
    model.getCurrentVersion();
  }, [model.checkedStatus]);
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      css={css`
        height: 100%;
      `}>
      <div>
        <Box mb={3}>
          <Card bodyStyle={{ padding: 12 }}>
            <Flex justifyContent="space-between">
              <Text>Automatic Updates</Text>
              <Switch
                value={model.isAutoCheck}
                onChange={model.setAutoCheck}
                loading={model.isAutoCheckLoading}
              />
            </Flex>
          </Card>
        </Box>

        {model.checkedStatus == null ? (
          <Box mb={3}>
            <Card bodyStyle={{ padding: 12 }}>
              <Flex justifyContent="space-between">
                <Text>Check for update</Text>
                <AButton onClick={model.checkNow} loading={model.isChecking}>
                  Check Now
                </AButton>
              </Flex>
            </Card>
          </Box>
        ) : null}

        {model.checkedStatus === 'newUpdate' ? (
          <Box mb={3}>
            <Card bodyStyle={{ padding: 12 }}>
              <Flex justifyContent="space-between">
                <Box>
                  <div>
                    <Text size="lg">New updates are available</Text>
                  </div>
                  <Text size="sm" color="subtler">
                    {`${model.checkRet.latest_tag_name} (${dayjs(model.checkRet.target_release_date).format('DD.MM YYYY')})`}
                  </Text>
                </Box>
                {model.isToRestart ? (
                  <AButton onClick={model.updateNow} loading={model.isUpdating}>
                    Update now
                  </AButton>
                ) : (
                  <AButton onClick={model.restart} loading={model.isRestarting}>
                    Restart now
                  </AButton>
                )}
              </Flex>
              <Divider style={{ margin: '12px 0' }} />
              <Button type="link" onClick={model.openChangelog}>
                View Detail
              </Button>
            </Card>
          </Box>
        ) : null}

        {model.checkedStatus === 'latest' ? (
          <Box mb={3}>
            <Card bodyStyle={{ padding: 12 }}>
              <div>
                <Text size="lg">It is the latest version.</Text>
              </div>
              <Text size="sm" color="subtler">
                Last check time{' '}
                {model.lastChecktime === ''
                  ? ''
                  : dayjs(model.lastChecktime).fromNow()}
              </Text>
            </Card>
          </Box>
        ) : null}
      </div>
      <Text
        size="sm"
        color="subtler"
        css={css`
          text-align: center;
        `}>
        Current version {model.checkRet.current_version}
      </Text>
    </Flex>
  );
});

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
              {model.sidebar === 'Environment' ? 'Environment' : null}
              {model.sidebar === 'SoftwareUpdate' ? 'Software Update' : null}
            </div>
          </div>
          <Box
            p={3}
            css={css`
              overflow-y: auto;
              height: 100%;
            `}>
            {model.sidebar === 'Environment' ? <EnvForm /> : null}
            {model.sidebar === 'SoftwareUpdate' ? <Update /> : null}
          </Box>
        </div>
      </Flex>
    </Modal>
  );
});

export const ChangelogDialog = observer(() => {
  const model = useInjection(SettingsModel);
  const { token } = theme.useToken();
  return (
    <Modal
      open={model.changelogModal.isOpen}
      title="Changelog"
      width="900px"
      height="80%"
      onCancel={() => model.closeChangelog()}
      footer={
        <Flex mx={-1} justifyContent="flex-end">
          <Box mx={1}>
            <AButton size="large" onClick={model.closeChangelog}>
              Close
            </AButton>
          </Box>
          <Box mx={1}>
            <Button
              loading={model.isUpdating}
              disabled={model.isToRestart}
              onClick={model.onClickChangelogUpdateNow}
              size="large"
              css={css`
                border-radius: 9999px;
              `}
              type="primary">
              Update Now
            </Button>
          </Box>
        </Flex>
      }
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
          padding: 24,
          height: '100%',
        },
      }}>
      <Markdown>{model.checkRet.changelog}</Markdown>
    </Modal>
  );
});
