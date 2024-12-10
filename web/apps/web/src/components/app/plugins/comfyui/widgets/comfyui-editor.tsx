/** @jsxImportSource @emotion/react */

import {
  CloseOutlined,
  ExportOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { AModal, Button, Spinner, useFormContext } from '@shellagent/ui';
import { Form, Input, Modal, Tooltip } from 'antd';
import { Formik } from 'formik';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { Box, Flex } from 'react-system';
import { type FormikModel } from '@/utils/formik.model';
import { CheckDialog } from '../check-dialog';
import { ComfyUIModel, LocationFormType } from '../comfyui.model';
import {
  DEFAULT_MODAL_STYLES,
  FULL_SCREEN_MODAL_STYLES,
} from '@/components/app/plugins/comfyui/constant';
import { FormItemField } from '../comfyui-helpers';

export const ComfyUIEditor = observer(
  ({ name, onChange }: { name: string; onChange: (value: string) => void }) => {
    const model = useInjection<ComfyUIModel>('ComfyUIModel');
    const formRef = useFormContext();
    const { setValue, getValues } = formRef;
    return (
      <div>
        <LocationForm
          model={model.locationFormikSheet}
          type="sheet"
          initialValue={model.currentFormData?.location}
          onSubmit={v => {
            setValue('location', v);
          }}
        />
        <Button
          size="sm"
          className="w-full"
          onClick={() => model.openIframeDialog()}>
          {model.buttonName}
        </Button>
      </div>
    );
  },
);

export const ComfyUIEditorModal = observer(() => {
  const model = useInjection<ComfyUIModel>('ComfyUIModel');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const handleMessage = (evt: MessageEvent) =>
      model.handleMessage(iframeRef, evt);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (model.iframeDialog.isClosed) {
    return null;
  }

  return (
    <>
      <Modal
        destroyOnClose
        title={
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <span className="text-lg font-medium">ComfyUI Editor</span>
              {model.iframeError && (
                <div className="text-red-500 font-normal">
                  {model.iframeError}
                </div>
              )}
              <ExportOutlined
                className="cursor-pointer text-primary"
                onClick={() => {
                  window.open(model.comfyUIUrl, '_blank');
                }}
              />
            </Box>
            <Flex alignItems="center" mx={-1}>
              {model.fullscreen.isOn ? (
                <>
                  <Box mx={1}>
                    <Button onClick={model.closeIframeDialog} variant="plain">
                      <CloseOutlined />
                    </Button>
                  </Box>
                  <Box mx={1}>
                    <Button
                      onClick={() => model.handleSave(iframeRef)}
                      disabled={model.saveBtnDisabled}
                      loading={model.saveLoading.isOn}
                      variant="plain">
                      <SaveOutlined />
                    </Button>
                  </Box>
                </>
              ) : null}
              <Tooltip
                title={
                  model.fullscreen.isOn ? 'Exit fullscreen' : 'Fullscreen'
                }>
                <Box mx={1}>
                  <Button onClick={model.fullscreen.toggle} variant="plain">
                    {model.fullscreen.isOn ? (
                      <FullscreenExitOutlined />
                    ) : (
                      <FullscreenOutlined />
                    )}
                  </Button>
                </Box>
              </Tooltip>
            </Flex>
          </Flex>
        }
        styles={
          model.fullscreen.isOn
            ? FULL_SCREEN_MODAL_STYLES
            : DEFAULT_MODAL_STYLES
        }
        forceRender
        open={model.iframeDialog.isOpen}
        onOk={() => model.handleSave(iframeRef)}
        mask={false}
        width={model.fullscreen.isOn ? '100%' : '80%'}
        className={model.fullscreen.isOn ? 'top-0 p-0 m-0' : 'top-5'}
        footer={
          model.fullscreen.isOn ? (
            <span />
          ) : (
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={model.closeIframeDialog}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => model.handleSave(iframeRef)}
                disabled={model.saveBtnDisabled}
                loading={model.saveLoading.isOn}>
                Save
              </Button>
            </div>
          )
        }
        closeIcon={null}>
        {model.iframeLoading.isOn && !model.showSettingButton && (
          <div className="flex justify-center items-center h-[80vh]">
            <Spinner size="lg" className="text-brand" />
          </div>
        )}
        {model.showSettingButton && (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="text-center mb-4">
              Failed to connect to ComfyUI at{' '}
              {model.comfyUIUrl || 'undefined address'}. Please verify the
              address or update it in the environment settings.
              <Button
                size="sm"
                onClick={model.settings.modal.open}
                variant="outline"
                className="ml-2">
                Settings
              </Button>
            </div>
            {/*<Button
              variant="primary"
              size="sm"
              onClick={() => {
                model.reloadSettings(api =>
                  model.currentIframeData?.setValue('api', api),
                );
              }}>
              <ReloadOutlined className="mr-2" />
              Reload
            </Button>*/}
          </div>
        )}
        <iframe
          title="comfyui"
          ref={iframeRef}
          src={model.comfyUIUrl}
          className={`w-full ${model.fullscreen.isOn ? 'h-full' : 'h-[80vh]'} ${
            model.iframeLoading.isOn || model.showSettingButton ? 'hidden' : ''
          }`}
          onLoad={() => {
            model.iframeLoading.off();
          }}
          onError={() => {
            model.iframeLoading.off();
            model.setIframeError();
          }}
        />
        <Modal
          destroyOnClose
          title="Error Detail"
          open={model.messageDetailModal.isOpen}
          onCancel={model.messageDetailModal.close}
          footer={[
            <Button onClick={model.messageDetailModal.close}>Close</Button>,
          ]}>
          <div
            dangerouslySetInnerHTML={{
              __html: model.messageDetail?.replaceAll('\n', '<br />') || '',
            }}
          />
        </Modal>
        <AModal
          destroyOnClose
          hideCancelButton
          okText="Ok"
          width={420}
          title="File path of extended ComfyUI json"
          open={model.locationFormDialog.isOpen}
          onOk={() => model.onLocationDialogOk(iframeRef)}
          onCancel={model.locationFormDialog.close}>
          <LocationForm
            model={model.locationFormikModal}
            type="modal"
            initialValue={model.currentFormData.location}
            onSubmit={async v => {
              // TODO: add a temp form value to communicate with modal and sheet form
              model.currentFormData.location = v;
              await model.formEngineModel.isReadyPromise;
              model.formEngineModel.formRef!.setValue('location', v);
            }}
          />
        </AModal>
      </Modal>
      <CheckDialog
        open={model.checkDialog.isOn}
        setModalOpen={model.iframeDialog.open}
        setOpen={model.checkDialog.on}
        dependencies={model.dependencies}
        location={model.currentFormData.location}
      />
    </>
  );
});

const LocationForm = observer<{
  model: FormikModel<Partial<LocationFormType>>;
  type: 'sheet' | 'modal';
  initialValue?: string;
  onSubmit: (value?: string) => void;
}>(props => {
  const comfyUIModel = useInjection<ComfyUIModel>('ComfyUIModel');
  return (
    <Formik<Partial<LocationFormType>>
      enableReinitialize
      initialValues={{
        location: props.initialValue || '',
      }}
      validateOnChange={false}
      onSubmit={values => {
        props.onSubmit(values.location);
      }}>
      {fProp => {
        useEffect(() => {
          props.model.setFormikProps(fProp);
          return () => {
            props.model.reset();
          };
        }, []);
        return (
          <Form
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
            <FormItemField
              label="Location"
              name="location"
              validate={(value: string) =>
                comfyUIModel.validateLocation(props.type, value)
              }>
              {({ field }) => (
                <Input
                  placeholder="File path of extended ComfyUI json"
                  {...field}
                  onBlur={e => {
                    fProp.handleBlur(e);
                    if (props.type === 'sheet') {
                      fProp.handleSubmit();
                    }
                  }}
                />
              )}
            </FormItemField>
          </Form>
        );
      }}
    </Formik>
  );
});
