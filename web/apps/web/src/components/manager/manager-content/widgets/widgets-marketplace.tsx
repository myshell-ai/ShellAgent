/** @jsxImportSource @emotion/react */
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import {
  AButton,
  ADropdownButton,
  AInput,
  AModal,
  ATable,
} from '@shellagent/ui';
import {
  Dropdown,
  Form,
  Input,
  Popconfirm,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Field, FieldProps, Formik } from 'formik';
import { useInjection } from 'inversify-react';
import { trace } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Box, Flex } from 'react-system';

import { useGlobalStore } from '@/stores/global/global-provider';

import { WidgetsCommonModel } from './widgets-common.model';
import { WidgetsMarketplaceModel } from './widgets-marketplace.model';

export const InstallFromGitModalContent = observer<{
  model: WidgetsCommonModel;
}>(props => {
  return (
    <Formik
      initialValues={{ widget_name: '', link: '' }}
      onSubmit={async values => {
        await props.model.installFromGit(values);
      }}>
      {formikProps => {
        props.model.formikProps = formikProps;
        return (
          <Form layout="vertical">
            <Field name="widget_name">
              {({ field }: FieldProps) => (
                <Form.Item label="Widget Name">
                  <Input
                    size="large"
                    {...field}
                    count={{
                      show: true,
                      max: 50,
                    }}
                    placeholder="Give your widget a name"
                  />
                </Form.Item>
              )}
            </Field>
            <Field name="link">
              {({ field }: FieldProps) => (
                <Form.Item label="Git Link">
                  <Input size="large" {...field} placeholder="www.gitxxx.com" />
                </Form.Item>
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
});

export const InstallFromGitModal = observer<{
  model: WidgetsCommonModel;
}>(props => {
  trace();
  return (
    <AModal
      title="Install from Git"
      okLoading={props.model.insatallFromGitLoading}
      open={props.model.installFromModalVisible}
      onCancel={props.model.closeInstallFromGitModal}
      onOk={() => props.model.onInstallFromGitSubmit()}>
      <InstallFromGitModalContent model={props.model} />
    </AModal>
  );
});

export const VersionCommitSearchInput = observer<{
  model: WidgetsCommonModel;
  record: any;
}>(props => {
  return (
    <AInput
      value={props.model.remoteVersionQuery}
      onChange={e => {
        e.preventDefault();
        e.stopPropagation();
        props.model.onChangeRemoteVersionQuery(e.target.value);
      }}
      onPressEnter={() => {
        props.model.loadRemoteVersions(
          props.record.git,
          props.model.remoteVersionQuery,
        );
      }}
      prefix={<SearchOutlined />}
      placeholder="Search versions/commits ..."
    />
  );
});

export const WidgetsActionButton = observer<{
  record: any;
  model: WidgetsCommonModel;
  loadData: () => Promise<void>;
}>(props => {
  const installLoading = props.model.installUpdateLoadingMap.get(
    props.record.id,
  );
  const uninstallLoading = props.model.uninstallLoadingMap.get(props.record.id);
  const { token } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const installItems = props.model.remoteList.map((item: string) => {
    const canUpdate = props.model.canUpdate(item, props.record);
    const label = (
      <Flex justifyContent="space-between">
        <Box>
          {item}{' '}
          {canUpdate === 'can_update' ? (
            <Typography.Text type="secondary">
              (click to update){' '}
            </Typography.Text>
          ) : null}
          {canUpdate === 'current' ? (
            <Typography.Text type="secondary"> (current) </Typography.Text>
          ) : null}
        </Box>
        {canUpdate === 'current' ? (
          <CheckOutlined
            style={{
              color: token.colorSuccess,
            }}
          />
        ) : null}
        {canUpdate === 'installed' ? (
          <CheckOutlined
            style={{
              color: token.colorTextDisabled,
            }}
          />
        ) : null}
      </Flex>
    );
    return {
      key: item,
      disabled: canUpdate === 'current',
      label:
        canUpdate === 'installed' ? (
          <Tooltip mouseEnterDelay={1} title="Click to set as current">
            {label}
          </Tooltip>
        ) : (
          label
        ),
    };
  });

  return (
    <div
      css={css`
        .ant-btn-compact-first-item {
          width: 100px;
        }
      `}>
      <Dropdown
        trigger={['click']}
        onOpenChange={open => {
          props.model.onRemoteVersionOpenChange(open, props.record.git);
        }}
        menu={{
          selectedKeys: [],
          items: installItems,
          onClick: e => {
            props.model.installVersion(props.record.id, e.key, props.loadData);
          },
        }}
        dropdownRender={menu => {
          return (
            <div
              style={contentStyle}
              css={css`
                .ant-dropdown-menu {
                  box-shadow: none;
                }
              `}>
              <Box px={3} pt={1}>
                <Typography.Text type="secondary">
                  Install Another Version
                </Typography.Text>
              </Box>
              <Box p={2}>
                <VersionCommitSearchInput
                  model={props.model}
                  record={props.record}
                />
              </Box>
              {menu}
            </div>
          );
        }}>
        <AButton
          loading={installLoading}
          disabled={uninstallLoading}
          iconPosition="end"
          css={css`
            width: 128px;

            .install-btn {
              width: 100px;
              color: var(--ant-color-primary);
            }
            .anticon {
              position: relative;
              left: 8px;
              font-size: var(--ant-font-size-icon);
            }
          `}>
          <Flex>
            <Box className="install-btn">
              {props.model.getInstallStatus(props.record) || 'Install'}
            </Box>
            {!installLoading && <DownOutlined />}
          </Flex>
        </AButton>
      </Dropdown>
      {props.model.showUninstall(props.record) && (
        <Box mt={2}>
          <Popconfirm
            title="Uninstall all installed versions"
            description="Are you sure to uninstall all installed versions?"
            onConfirm={() => {
              props.model.unInstallVersion(
                props.record.id,
                undefined,
                props.loadData,
              );
            }}>
            <ADropdownButton
              trigger={['click']}
              icon={<DownOutlined />}
              loading={uninstallLoading}
              disabled={installLoading}
              menu={{
                items: props.record?.local_commits_hash?.map((item: string) => {
                  return {
                    key: item,
                    label: (
                      <Tooltip mouseEnterDelay={1} title="Click to uninstall">
                        <Popconfirm
                          onConfirm={() => {
                            props.model.unInstallVersion(
                              props.record.id,
                              item,
                              props.loadData,
                            );
                          }}
                          title="Uninstall selected version"
                          description={`Are you sure to uninstall version ${item}?`}>
                          <Flex
                            justifyContent="space-between"
                            style={{ minWidth: 128 }}>
                            {item}
                            <CloseOutlined
                              style={{ color: token.colorError }}
                            />
                          </Flex>
                        </Popconfirm>
                      </Tooltip>
                    ),
                  };
                }),
              }}>
              Uninstall
            </ADropdownButton>
          </Popconfirm>
        </Box>
      )}
    </div>
  );
});

export const TopInstallButton = observer<{
  model: WidgetsCommonModel;
}>(props => {
  return (
    <AButton onClick={props.model.openInstallFromGitModal}>
      Install from Git
    </AButton>
  );
});

export const WidgetsMarketplace = observer(() => {
  const model = useInjection(WidgetsMarketplaceModel);
  const { managerDialogOpen } = useGlobalStore(state => ({
    managerDialogOpen: state.managerDialogOpen,
  }));
  useEffect(() => {
    if (managerDialogOpen) {
      model.loadData();
    }
  }, [managerDialogOpen]);
  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <Typography.Link href={record.git} target="_blank" rel="noreferrer">
            {text}
          </Typography.Link>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: text => {
        return (
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              expandable: true,
            }}>
            {text}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: 'Action',
      align: 'center',
      width: 1,
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <WidgetsActionButton
            record={record}
            model={model.common}
            loadData={() => model.loadData()}
          />
        );
      },
    },
  ];
  return (
    <>
      <Flex mx={2} my={3} justifyContent="space-between">
        <Box>
          <AInput
            prefix={<SearchOutlined />}
            placeholder="Search MyShell..."
            value={model.keyword}
            onChange={e => model.changeKeyword(e.target.value)}
            onPressEnter={() => model.loadData()}
          />
        </Box>
        <div>
          <TopInstallButton model={model.common} />
        </div>
      </Flex>
      <Box pb={4}>
        <ATable
          rowKey="id"
          pagination={false}
          dataSource={model.data}
          columns={columns}
        />
      </Box>
      <InstallFromGitModal model={model.common} />
    </>
  );
});
