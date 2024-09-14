/** @jsxImportSource @emotion/react */
import { SearchOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { AInput, AModal, ATable } from '@shellagent/ui';
import { Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Box, Flex } from 'react-system';

import { useGlobalStore } from '@/stores/global/global-provider';

import { ModelsCommonModel } from './models-common.model';
import { ModelsInstalledModel } from './models-installed.model';
import {
  InstallFromLinkModalContent,
  ModelsActionButton,
  TopInstallButton,
} from './models-marketplace';

const ModelsSavePathBase = observer<{
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
          Save Path:
        </span>
        <Tag.CheckableTag
          checked={model.checkedSavePath === 'All'}
          onClick={() => {
            model.setCheckedSavePath('All');
            props.loadData();
          }}>
          All
        </Tag.CheckableTag>
        {model.save_paths.map(type => (
          <Tag.CheckableTag
            key={type}
            checked={model.checkedSavePath === type}
            onClick={() => {
              model.setCheckedSavePath(type);
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

export const ModelsInstalled = observer<{}>(() => {
  const model = useInjection(ModelsInstalledModel);
  const { managerDialogOpen } = useGlobalStore(state => ({
    managerDialogOpen: state.managerDialogOpen,
  }));
  useEffect(() => {
    if (managerDialogOpen) {
      model.loadData();
      model.common.loadTypeBaseList();
    }
  }, [managerDialogOpen]);
  const columns: ColumnsType<any> = [
    {
      title: 'Filename',
      dataIndex: 'filename',
    },
    {
      title: 'Save Path',
      dataIndex: 'save_path',
      render: text => {
        return <Tag>{text}</Tag>;
      },
    },
    {
      title: 'Local Path',
      dataIndex: 'local_path',
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
            loadData={() => model.loadData()}
          />
        );
      },
    },
  ];
  return (
    <>
      {/* <Box mx={2} my={3}>
        <Typography.Text>Location: {model.location}</Typography.Text>
      </Box> */}
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
          <TopInstallButton loadData={() => model.loadData()} />
        </div>
      </Flex>
      <ModelsSavePathBase loadData={() => model.loadData()} />
      <ATable
        loading={model.loadingData}
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
        columns={columns}
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
