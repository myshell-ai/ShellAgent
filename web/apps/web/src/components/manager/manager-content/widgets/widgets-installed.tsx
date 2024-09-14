/** @jsxImportSource @emotion/react */
import { SearchOutlined } from '@ant-design/icons';
import { AInput, ATable } from '@shellagent/ui';
import { Switch, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useInjection } from 'inversify-react';
import { trace } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Box, Flex } from 'react-system';

import { useGlobalStore } from '@/stores/global/global-provider';

import { WidgetsInstalledModel } from './widgets-installed.model';
import {
  InstallFromGitModal,
  TopInstallButton,
  WidgetsActionButton,
} from './widgets-marketplace';

export const WidgetsStatus = observer<{
  record: any;
}>(props => {
  trace();
  const model = useInjection(WidgetsInstalledModel);
  return (
    <Switch
      loading={model.enableLoadingMap.has(props.record.id)}
      disabled={model.isDisabled(props.record.id, 'enable')}
      checked={props.record.enabled}
      onChange={e => {
        model.setEnableStatus(props.record.id, e);
      }}
    />
  );
});

export const WidgetsInstalled = observer(() => {
  trace();
  const model = useInjection(WidgetsInstalledModel);

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
      title: 'Enable/Disable',
      dataIndex: 'status',
      render: (text, record) => {
        return <WidgetsStatus record={record} />;
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
