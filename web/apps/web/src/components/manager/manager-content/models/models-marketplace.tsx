/** @jsxImportSource @emotion/react */
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import {
  AButton,
  ADropdownButton,
  AInput,
  AModal,
  ATable,
} from '@shellagent/ui';
import { Form, Input, Popconfirm, Select, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Field, FieldProps, Formik } from 'formik';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Box, Flex } from 'react-system';
import { z } from 'zod';

import { ModelsMarketPlaceItem } from '@/components/manager/manager-definitions';
import { useGlobalStore } from '@/stores/global/global-provider';

import { ModelsCommonModel } from './models-common.model';
import { ModelsMarketplaceModel } from './models-marketplace.model';

export const ModelsTypeBase = observer<{
  loadData: () => Promise<void>;
}>(props => {
  const model = useInjection(ModelsCommonModel);
  return (
    <div
      css={css`
        .ant-tag {
          border-radius: 6px;
        }

        .ant-tag:not(.ant-tag-checkable-checked) {
          background-color: #fafafa;
        }
      `}>
      <Typography.Paragraph
        css={css`
          margin-bottom: 8px;

          .ant-typography-collapse,
          .ant-typography-expand {
            background: #fafafa !important;
            border-radius: 6px !important;
            padding: 0px 4px !important;
          }
        `}
        ellipsis={{
          rows: 1,
          expandable: 'collapsible',
          symbol: (expanded: boolean) => {
            return expanded ? 'Collapse' : 'More';
          },
        }}>
        <span style={{ minWidth: 38, marginLeft: 8, marginRight: 8 }}>
          Type:
        </span>
        <Tag.CheckableTag
          checked={model.checkedType === 'All'}
          onClick={() => {
            model.setCheckedType('All');
            props.loadData();
          }}>
          All
        </Tag.CheckableTag>
        {model.types.map(type => (
          <Tag.CheckableTag
            key={type}
            checked={model.checkedType === type}
            onClick={() => {
              model.setCheckedType(type);
              props.loadData();
            }}>
            {type}
          </Tag.CheckableTag>
        ))}
      </Typography.Paragraph>

      <Typography.Paragraph
        css={css`
          margin-bottom: 8px;

          .ant-typography-collapse,
          .ant-typography-expand {
            background: #fafafa !important;
            border-radius: 6px !important;
            padding: 0px 4px !important;
          }
        `}
        ellipsis={{
          rows: 1,
          expandable: 'collapsible',
          symbol: (expanded: boolean) => {
            return expanded ? 'Collapse' : 'More';
          },
        }}>
        <span style={{ minWidth: 38, marginLeft: 8, marginRight: 8 }}>
          Base:
        </span>
        <Tag.CheckableTag
          checked={model.checkedBase === 'All'}
          onClick={() => {
            model.setCheckedBase('All');
            props.loadData();
          }}>
          All
        </Tag.CheckableTag>
        {model.bases.map(type => (
          <Tag.CheckableTag
            key={type}
            checked={model.checkedBase === type}
            onClick={() => {
              model.setCheckedBase(type);
              props.loadData();
            }}>
            {type}
          </Tag.CheckableTag>
        ))}
      </Typography.Paragraph>
    </div>
  );
});

export const ModelsActionButton = observer<{
  record: z.infer<typeof ModelsMarketPlaceItem>;
  loadData: () => Promise<void>;
}>(props => {
  const model = useInjection(ModelsCommonModel);
  const installLoading = model.installLoadingMap.get(props.record.id);
  const uninstallLoading = model.uninstallLoadingMap.get(props.record.id);
  return (
    <div>
      {props.record.install_status === 'not_installed' ? (
        <AButton
          css={css`
            color: var(--ant-color-primary);
          `}
          style={{ width: 100 }}
          loading={installLoading}
          disabled={uninstallLoading}
          onClick={() =>
            model.install(props.record.id, () => props.loadData())
          }>
          Install
        </AButton>
      ) : null}
      {props.record.install_status === 'installing' ? (
        <AButton style={{ width: 100 }} disabled>
          Installing
        </AButton>
      ) : null}
      {props.record.install_status === 'installed' ? (
        <Box mt={2}>
          <Popconfirm
            title="Uninstall model"
            description="Are you sure to uninstall?"
            onConfirm={() => {
              model.unInstall([props.record.id], () => props.loadData());
            }}>
            <AButton
              css={css`
                color: var(--ant-color-primary);
              `}
              style={{ width: 100 }}
              loading={uninstallLoading}>
              Uninstall
            </AButton>
          </Popconfirm>
        </Box>
      ) : null}
    </div>
  );
});

export const TopInstallButton = observer<{
  selectedIds?: string[];
  loadData: () => Promise<void>;
}>(props => {
  const model = useInjection(ModelsCommonModel);
  if (props.selectedIds == null) {
    return (
      <AButton onClick={model.installFromModal.open}>Install from Link</AButton>
    );
  }
  return (
    <ADropdownButton
      onClick={() => {
        model.batchInstall(props.selectedIds!, props.loadData);
      }}
      css={css`
        .ant-btn {
          color: var(--ant-color-primary);
        }
      `}
      icon={<DownOutlined />}
      menu={{
        onClick: e => {
          if (e.key === 'install-from-link') {
            model.installFromModal.open();
          }
        },
        items: [
          {
            key: 'install-from-link',
            label: 'Install from Link',
          },
        ],
      }}>
      Install
      {props.selectedIds.length > 0 ? ` (${props.selectedIds.length})` : ''}
    </ADropdownButton>
  );
});

export const InstallFromLinkModalContent = observer(() => {
  const model = useInjection(ModelsCommonModel);
  return (
    <Formik
      initialValues={{}}
      onSubmit={values => {
        model.installFromLink(values);
      }}>
      {formikProps => {
        model.formikProps = formikProps;
        return (
          <Form layout="vertical">
            <Field name="filename">
              {({ field }: FieldProps) => (
                <Form.Item label="File Name">
                  <Input
                    size="large"
                    {...field}
                    placeholder="Given the file name"
                  />
                </Form.Item>
              )}
            </Field>
            <Field name="save_path">
              {({ field, form }: FieldProps) => {
                return (
                  <Form.Item label="Save Path">
                    <Select
                      size="large"
                      showSearch
                      {...field}
                      onChange={val => {
                        form.setFieldValue(field.name, val);
                      }}
                      options={model.save_paths.map(item => ({
                        value: item,
                        label: item,
                      }))}
                      placeholder="Select save path"
                    />
                  </Form.Item>
                );
              }}
            </Field>
            <Field name="url">
              {({ field }: FieldProps) => (
                <Form.Item label="Link">
                  <Input size="large" {...field} placeholder="Given the link" />
                </Form.Item>
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
});

export const ModelsMarketplace = observer<{}>(() => {
  const model = useInjection(ModelsMarketplaceModel);
  const { managerDialogOpen } = useGlobalStore(state => ({
    managerDialogOpen: state.managerDialogOpen,
  }));
  useEffect(() => {
    if (managerDialogOpen) {
      model.loadData.request();
      model.common.loadTypeBaseList();
    }
  }, [managerDialogOpen]);

  const columns: ColumnsType<z.infer<typeof ModelsMarketPlaceItem>> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <Typography.Link
            href={record.link?.[0].url}
            target="_blank"
            rel="noreferrer">
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
      title: 'Type',
      dataIndex: 'type',
      render: text => {
        return <Tag>{text}</Tag>;
      },
    },
    {
      title: 'Base',
      dataIndex: 'base',
      render: text => {
        return <Tag>{text}</Tag>;
      },
    },
    {
      title: 'Action',
      align: 'center',
      fixed: 'right',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <ModelsActionButton
            record={record}
            loadData={() => model.loadData.request()}
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
            onPressEnter={() => model.loadData.request()}
          />
        </Box>
        <div>
          <TopInstallButton
            selectedIds={model.selectedIds}
            loadData={() => model.loadData.request()}
          />
        </div>
      </Flex>
      <ModelsTypeBase loadData={() => model.loadData.request()} />
      <ATable
        rowSelection={{
          type: 'checkbox',
          getCheckboxProps(record) {
            return {
              disabled: model.isRowCheckboxDisabled(record),
            };
          },
          onSelect: (record, selected, selectedRows) => {
            model.setSelectedIds(selectedRows.map(item => item.id));
          },
          onSelectAll: (selected, selectedRows) => {
            model.setSelectedIds(selectedRows.map(item => item.id));
          },
        }}
        loading={model.loadData.loading}
        scroll={{ y: 320 }}
        rowKey="id"
        pagination={{
          position: ['bottomLeft'],
          simple: true,
          defaultCurrent: 1,
          total: model.data.length,
          showSizeChanger: false,
        }}
        dataSource={model.data}
        columns={columns as any}
      />
      <AModal
        title="Install from Link"
        open={model.common.installFromModal.isOpen}
        onCancel={model.common.installFromModal.close}
        onOk={() => model.common.onSubmit()}>
        <InstallFromLinkModalContent />
      </AModal>
    </>
  );
});
