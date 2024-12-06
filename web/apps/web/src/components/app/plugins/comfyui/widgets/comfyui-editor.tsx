/** @jsxImportSource @emotion/react */

import {
  CloseOutlined,
  ExportOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useFormEngineContext } from '@shellagent/form-engine';
import { AModal, Button, Spinner, useFormContext } from '@shellagent/ui';
import { Form, Input, Modal, Tooltip } from 'antd';
import { Field, FieldProps, Formik } from 'formik';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { Box, Flex } from 'react-system';
import { toast } from 'react-toastify';

import { useSchemaContext } from '@/stores/app/schema-provider';
import { type FormikModel } from '@/utils/formik.model';

import { CheckDialog } from '../check-dialog';
import { ComfyUIModel, LocationFormType, locationTip } from '../comfyui.model';

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
  useEffect(() => {
    model.emitter.on('customWarn', evt => {
      toast.warning(
        <div>
          {evt.message}
          {evt.message_detail ? (
            <Button
              className="ml-2"
              color="error"
              size="sm"
              onClick={() => model.showMessageDetail(evt.message_detail)}>
              View Detail
            </Button>
          ) : null}
        </div>,
        {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        },
      );
    });
    return () => {
      model.emitter.off('customWarn');
    };
  }, []);

  const modalStyles = model.fullscreen.isOn
    ? {
        mask: {
          height: '100vh',
          width: '100vw',
          margin: 0,
          top: 0,
          paddingBottom: 0,
        },
        wrapper: {
          height: '100vh',
          width: '100vw',
          margin: 0,
          top: 0,
          paddingBottom: 0,
        },
        content: {
          padding: '6px 8px',
          height: '100vh',
          width: '100vw',
          margin: 0,
          top: 0,
          paddingBottom: 0,
        },
        body: {
          height: 'calc(100vh - 48px)',
          padding: 0,
          overflow: 'hidden',
        },
        footer: {
          marginTop: 0,
        },
      }
    : {
        content: {
          padding: '6px 8px',
        },
      };

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
                      disabled={model.disabled}
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
        styles={modalStyles}
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
                disabled={model.disabled}
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
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                model.reloadSettings(api =>
                  model.currentIframeData?.setValue('api', api),
                );
              }}>
              <ReloadOutlined className="mr-2" />
              Reload
            </Button>
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
            value={model.currentIframeData?.location}
            onChange={v => {
              model.currentIframeData?.setValue('location', v);
            }}
          />
        </AModal>
      </Modal>
      <CheckDialog
        open={model.checkDialog.isOn}
        setModalOpen={model.iframeDialog.open}
        setOpen={model.checkDialog.on}
        dependencies={model.dependencies}
        location={model.currentIframeData?.location}
      />
    </>
  );
});

export const ComfyUIEditor = observer(
  ({ name, onChange }: { name: string; onChange: (value: string) => void }) => {
    const model = useInjection<ComfyUIModel>('ComfyUIModel');
    const formRef = useFormContext();
    const { getValues, setValue } = formRef;
    const { id: stateId } = useSchemaContext(state => ({
      id: state.id,
    }));
    const { parent } = useFormEngineContext();

    useEffect(() => {
      model.setButtonName(getValues('location'));
    }, [getValues('location')]);

    return (
      <div>
        <LocationForm
          model={model.locationFormikSheet}
          type="sheet"
          value={getValues('location')}
          onChange={v => {
            setValue('location', v);
          }}
        />
        <Button
          size="sm"
          className="w-full"
          onClick={() =>
            model.openIframeDialog({
              parent,
              stateId,
              name: getValues('name'),
              location: getValues('location'),
              setValue: formRef.setValue,
            })
          }>
          {model.buttonName}
        </Button>
      </div>
    );
  },
);

export const LocationForm = observer<{
  model: FormikModel<LocationFormType>;
  type: 'sheet' | 'modal';
  value?: string;
  onChange: (value: string) => void;
}>(props => {
  const comfyUIModel = useInjection<ComfyUIModel>('ComfyUIModel');
  return (
    <Formik<LocationFormType>
      initialValues={{
        location: props.value,
      }}
      onSubmit={values => {
        if (values.location) {
          props.onChange(values.location);
          comfyUIModel.submitLocationFormModal(values.location);
        }
      }}>
      {formikProps => {
        useEffect(() => {
          props.model.setFormikProps(formikProps);
          return () => {
            props.model.reset();
          };
        }, []);
        return (
          <Form
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
            <Field name="location">
              {({ field }: FieldProps) => (
                <Form.Item
                  colon={false}
                  tooltip={locationTip}
                  label="Location"
                  help={formikProps.errors.location}
                  validateStatus={
                    formikProps.errors.location == null ? undefined : 'error'
                  }
                  css={css`
                    margin-bottom: 12px;
                  `}>
                  <Flex alignItems="center">
                    <Input
                      value={field.value}
                      onChange={async e => {
                        formikProps.values.location = e.target.value; // workaround: cannot update immediately
                        formikProps.setFieldValue('location', e.target.value);
                      }}
                      onBlur={() =>
                        comfyUIModel.onLocationBlur(
                          props.model,
                          props.type,
                          field,
                          () => {
                            props.onChange(field.value);
                          },
                        )
                      }
                      placeholder="File path of extended ComfyUI json"
                    />
                  </Flex>
                </Form.Item>
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
});
