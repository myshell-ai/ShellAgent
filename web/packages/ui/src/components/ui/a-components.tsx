/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { antdToken } from '@shellagent/tailwind-config/token';
import {
  Dropdown,
  Table,
  Button,
  Input,
  Modal,
  Typography,
  ModalProps,
  theme,
} from 'antd';
import { Box, Flex } from 'react-system';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { ReactNode } from 'react';

export const AInput = styled(Input)`
  border-radius: ${antdToken.buttonRadius}px;
`;

export const AButton = styled(Button)`
  border-radius: ${antdToken.buttonRadius}px;
  color: var(--ant-color-primary);
`;

export const ADropdownButton = styled(Dropdown.Button)`
  button.ant-btn-compact-first-item {
    border-top-left-radius: ${antdToken.buttonRadius}px;
    border-bottom-left-radius: ${antdToken.buttonRadius}px;
  }
  button.ant-btn-compact-last-item {
    border-top-right-radius: ${antdToken.buttonRadius}px;
    border-bottom-right-radius: ${antdToken.buttonRadius}px;
  }
`;

export const ATable = styled(Table)`
  th {
    text-transform: uppercase;
    font-weight: normal !important;
  }
  th:not(:last-child)::before {
    content: unset !important;
  }
`;

export const contentPadding = 16;

export const AModal = (
  props: ModalProps & {
    bodyPadding?: number;
    hideCancelButton?: boolean;
    hideFooter?: boolean;
    okLoading?: boolean;
    okDisabled?: boolean;
    okButton?: ReactNode;
  },
) => {
  const { token } = theme.useToken();
  const { bodyPadding } = props;
  let footerRender = null;
  if (!props.hideFooter) {
    const okButton =
      props.okButton != null ? (
        props.okButton
      ) : (
        <AButton
          loading={props.okLoading}
          disabled={props.okDisabled}
          size="large"
          type="primary"
          style={{ width: '100%' }}
          onClick={props.onOk}>
          {props.okText ?? 'Confirm'}
        </AButton>
      );
    if (props.hideCancelButton) {
      footerRender = (
        <Flex justifyContent="flex-end" mx={-2} key={'0'}>
          <Box width={1 / 3}>{okButton}</Box>
        </Flex>
      );
    } else {
      footerRender = (
        <Flex justifyContent={'space-between'} mx={-2} key={'0'}>
          <Box width={1 / 2} mx={2}>
            <AButton
              size="large"
              style={{ width: '100%' }}
              onClick={props.onCancel}>
              Cancel
            </AButton>
          </Box>
          <Box width={1 / 2} mx={2}>
            {okButton}
          </Box>
        </Flex>
      );
    }
  }

  return (
    <Modal
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
        },
        body: {
          padding: bodyPadding ?? contentPadding,
        },
      }}
      width={360}
      footer={[footerRender]}
      {...props}>
      {props.children}
    </Modal>
  );
};
