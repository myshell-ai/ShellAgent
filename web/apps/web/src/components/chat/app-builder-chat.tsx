import PlusCircleIcon from '@heroicons/react/24/outline/esm/PlusCircleIcon';
import { DisplayMessage } from '@shellagent/chat-engine';
import { ISchema, TValues } from '@shellagent/form-engine';
import {
  AButton,
  AModal,
  chatDefaultIntlMsgs,
  ChatLuiButton,
  ChatNew,
  IconButton,
  Title,
} from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { isEmpty } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { NextIntlClientProvider } from 'next-intl';
import { useCallback } from 'react';
import { Box, Flex } from 'react-system';

import { ENABLE_MIME } from '@/utils/file-types';

import { AppBuilderChatModel } from './app-builder-chat.model';
import ChatForm from './chat-form';
import { MessageComponentsContainer } from '../../services/app/message-type';

const getSchemaByInputs = (inputs: TValues): ISchema => {
  const properties: { [key: string]: ISchema } = {};
  Object.keys(inputs || {}).reduce<{ [key: string]: ISchema }>((prev, key) => {
    const { description, name, type, value, enum: enumOptions } = inputs[key];
    const defaultValue = value || inputs[key].default;
    switch (type) {
      case 'audio':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.audio,
          },
        };
        break;
      case 'image':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.image,
          },
        };
        break;
      case 'video':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.video,
          },
        };
        break;
      case 'text_file':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.other,
          },
        };
        break;
      case 'file':
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'FileUpload',
          'x-title-size': 'h4',
          'x-component-props': {
            accept: ENABLE_MIME.all,
          },
        };
        break;
      default:
        prev[key] = {
          type: 'string',
          default: defaultValue,
          title: name,
          description,
          'x-layout': 'Vertical',
          'x-type': 'Control',
          'x-component': 'Textarea',
          'x-title-size': 'h4',
        };
    }

    // 只有text类型下有enum
    if (enumOptions?.length) {
      prev[key] = {
        type: 'string',
        default: defaultValue,
        title: name,
        description,
        'x-component': 'Select',
        'x-component-props': {
          options: enumOptions.map((item: string) => ({
            label: item,
            value: item,
          })),
        },
        'x-onchange-prop-name': 'onValueChange',
        // 'x-layout': 'Vertical',
        'x-type': 'Control',
        'x-title-size': 'h4',
      };
    }

    return prev;
  }, properties);

  if (isEmpty(properties)) {
    return {
      type: 'object',
      // title: 'Input',
      'x-type': 'Block',
      'x-title-size': 'h4',
      'x-empty': {
        text: 'No input is required.',
      },
    };
  }

  return {
    type: 'object',
    // title: 'Input',
    'x-title-size': 'h4',
    properties: {
      ...properties,
    },
    'x-type': 'Block',
  };
};

export const OkButton = observer(() => {
  const model = useInjection(AppBuilderChatModel);
  return (
    <AButton
      size="large"
      type="primary"
      style={{ width: '100%', color: '#fff' }}
      onClick={() => {
        setTimeout(() => model.onClickModalRun(), 350);
      }}>
      Run
    </AButton>
  );
});

export const ChatFormContent = () => {
  const model = useInjection(AppBuilderChatModel);
  const schema = getSchemaByInputs(
    model.currentLuiButton?.schema.properties as any,
  );
  return (
    <ChatForm
      loading={false}
      schema={schema}
      values={model.formValue}
      onChange={values => {
        model.onChangeModalForm(values);
      }}
    />
  );
};

export const AppBuilderChatLuiButtonModal = observer(() => {
  const model = useInjection(AppBuilderChatModel);
  return (
    <AModal
      destroyOnClose
      width="50%"
      open={model.isLuiButtonModalOpen}
      title={<Title size="h3">Enter to run</Title>}
      hideCancelButton
      onCancel={() => model.closeLuiButtonModal()}
      okDisabled={!model.isFormValid}
      okButton={<OkButton />}>
      <ChatFormContent />
    </AModal>
  );
});

export const AppBuilderChat = () => {
  const model = useInjection(AppBuilderChatModel);
  const messageToDisplayParserPost = useCallback(
    (displayMessage: DisplayMessage) => {
      if (displayMessage.status === 'ERROR') {
        const [text, detail] = displayMessage.text!.split('_$$_');
        displayMessage.msgDisplayType = 'ERROR';
        displayMessage.text = text;
        displayMessage.referenceText = detail;
        return;
      }
      if (displayMessage.status === 'DRAFT') {
        displayMessage.status = 'DONE';
        displayMessage.source = 'USER';
        return;
      }
      const serverMessage = model.serverMessageMap.get(displayMessage.id);
      if (serverMessage == null) return;
      // todo 先实现图片
      if (
        Array.isArray(serverMessage.embedObjs) &&
        serverMessage.embedObjs.length > 0
      ) {
        const embedObjsTxt = serverMessage.embedObjs
          .map(i => {
            const url =
              typeof i.url === 'string' && i.url.indexOf('https://') > -1
                ? i.url
                : `/api/files/${i.url}`;
            return `<img src="${url}" width="1024" />`;
          })
          .join('\n\n');
        displayMessage.text = `
${displayMessage.text}
${embedObjsTxt}
`;
      }
      if (serverMessage.componentContainer) {
        const componentContainer =
          serverMessage.componentContainer as MessageComponentsContainer;
        displayMessage.buttons = (
          <Flex mx={-1}>
            {componentContainer.components.map(c => {
              return (
                <Box mx={1} key={c.button?.buttonId}>
                  <ChatLuiButton
                    label={c.button!.content.text}
                    onClick={() => {
                      if (c.button?.actions.length === 0) {
                        model.clickSimpleButton(c.button);
                      } else if (
                        c.button?.actions?.[0].action ===
                        'MESSAGE_COMPONENTS_BUTTON_ACTION_TYPE_POP_UP_FORM'
                      ) {
                        model.openLuiButtonModal(
                          c.button.buttonId,
                          c.button.content.text,
                          c.button?.actions?.[0],
                        );
                      } else {
                        //
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Flex>
        );
      }
    },
    [model.serverMessageMap],
  );

  return (
    <NextIntlClientProvider locale="zh" messages={chatDefaultIntlMsgs}>
      <ChatNew
        model={model.chatNew}
        messageToDisplayParserPost={messageToDisplayParserPost}
        customMenuIconSlot={
          <div>
            <IconButton
              disabled={model.chatNew.imUploadDisabled}
              variant="ghost"
              color="brand"
              size="md"
              icon={PlusCircleIcon}
              onClick={() => document.getElementById('im-file-upload')?.click()}
            />
            <input
              type="file"
              id="im-file-upload"
              accept={Object.values(ENABLE_MIME.image).join(',')}
              style={{ display: 'none' }}
              onChange={async event => {
                const file = event.target.files?.[0];
                if (file) {
                  await model.uploadFile(file);
                }
              }}
            />
          </div>
        }
      />
      <AppBuilderChatLuiButtonModal />
    </NextIntlClientProvider>
  );
};
