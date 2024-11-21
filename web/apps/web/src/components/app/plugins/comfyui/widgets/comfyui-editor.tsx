/** @jsxImportSource @emotion/react */

import {
  ExportOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { AModal, Button, Spinner, useFormContext } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { Form, Input, Modal, Tooltip } from 'antd';
import { useInjection } from 'inversify-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { CheckDialog } from '../check-dialog';
import { COMFYUI_API, DEFAULT_COMFYUI_API, MessageType } from '../constant';
import emitter, { EventType } from '../emitter';
import { getFile, saveComfy, uploadComfy } from '../services';
import type { SaveResponse } from '../services/type';
import { checkDependency, isValidUrl } from '../utils';
import { Flex } from 'react-system';
import { css } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import { ComfyUIModel, LocTip } from './comfyui.model';
import { isEmpty } from 'lodash-es';
import { Field, FieldProps, Formik } from 'formik';

const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

export const ComfyUIEditor = observer(
  ({ onChange }: { onChange: (value: string) => void }) => {
    const model = useInjection<ComfyUIModel>('ComfyUIModel');
    const [checkDialogOpen, setCheckDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [loaded, setLoaded] = useState(false);
    const [dependencies, setDependencies] = useState<
      SaveResponse['data']['dependencies'] | null
    >(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const formRef = useFormContext();
    const { getValues, setValue } = formRef;
    useEffect(() => {
      model.formRef.setFormRef(formRef);
      const location = getValues('location');
      model.setLocation(location);
    }, []);
    const [messageDetailOpen, setMessageDetailOpen] = useState(false);
    const [messageDetail, setMessageDetail] = useState<string | null>(null);

    const value = useMemo(() => {
      if (settingsDisabled) {
        return DEFAULT_COMFYUI_API;
      }
      return model.settings.envs.get(COMFYUI_API) || '';
    }, [model.settings.envs.get(COMFYUI_API), settingsDisabled]);

    useEffect(() => {
      onChange(value);
    }, [value]);

    const { run: getComfySchema } = useRequest(getFile, {
      manual: true,
      onSuccess: result => {
        if (result.success) {
          const { data } = result;
          iframeRef.current?.contentWindow?.postMessage(
            { type: MessageType.LOAD, data },
            value,
          );
        } else {
          iframeRef.current?.contentWindow?.postMessage(
            { type: MessageType.LOAD_DEFAULT },
            value,
          );
        }
      },
      onError: () => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: MessageType.LOAD_DEFAULT },
          value,
        );
      },
    });

    const { run: saveComfyRequest, loading: saveLoading } = useRequest(
      saveComfy,
      {
        manual: true,
        onSuccess: result => {
          if (result.success) {
            const { data } = result;
            const { hasMissingCustomNodes, hasMissingModels } = checkDependency(
              data.dependencies,
            );
            if (hasMissingCustomNodes || hasMissingModels) {
              setCheckDialogOpen(true);
              setDependencies(data.dependencies);
            } else {
              model.iframeDialog.close();
              const comfy_workflow_id = getValues('comfy_workflow_id');
              emitter.emit(EventType.UPDATE_FORM, {
                data: result.data.schemas,
                id: comfy_workflow_id,
              });
            }
            if (result.warning_message) {
              toast.warning(result.warning_message, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: true,
                closeButton: false,
              });
            }
          } else {
            toast.warning(
              <div>
                {result?.message}
                {result?.message_detail ? (
                  <Button
                    className="ml-2"
                    color="error"
                    size="sm"
                    onClick={() => showMessageDetail(result?.message_detail)}>
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
          }
        },
      },
    );

    const { run: uploadComfyRequest } = useRequest(uploadComfy, {
      manual: true,
      onSuccess: result => {
        console.log('Upload successful:', result);
      },
    });

    const handleMessage = useCallback(
      (event: MessageEvent) => {
        if (!value) {
          return;
        }

        try {
          const valueUrl = new URL(value);
          if (valueUrl.origin !== event.origin) return;

          const comfy_workflow_id = getValues('comfy_workflow_id');

          switch (event.data.type) {
            case MessageType.LOADED:
              setLoaded(true);
              getComfySchema({
                comfy_workflow_id,
                filename: 'workflow.json',
              });
              console.log('ComfyUI loaded');
              break;
            case MessageType.SAVE:
              if (model.locationTemp == null) {
                toast.error(
                  'The file location of ShellAgent-extended ComfyUI JSON file is invalid',
                  {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    closeButton: false,
                  },
                );
                return;
              }
              saveComfyRequest({
                prompt: event.data.prompt,
                comfyui_api: valueUrl.origin,
                workflow: event.data.workflow,
                name: event.data.name,
                comfy_workflow_id,
                location: model.locationTemp,
              });
              break;
            default:
              break;
          }
        } catch (error) {
          console.error('Invalid URL:', error);
        }
      },
      [value, getValues],
    );

    useEffect(() => {
      window.addEventListener('message', handleMessage);
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, [handleMessage]);

    const handleSave = () => {
      if (isEmpty(model.locationTemp)) {
        model.locationFormDialog.open();
        return;
      }
      iframeRef.current?.contentWindow?.postMessage(
        { type: MessageType.SAVE },
        value,
      );
    };

    const handleImport = (file: File) => {
      if (!file.name.toLowerCase().endsWith('.json')) {
        toast.error('Please upload a JSON file', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const comfy_workflow_id = getValues('comfy_workflow_id');
          uploadComfyRequest({
            workflow: json,
            comfy_workflow_id,
          });
          iframeRef.current?.contentWindow?.postMessage(
            { type: MessageType.LOAD, data: json },
            value,
          );
        } catch (error) {
          console.error('Invalid JSON file:', error);
          toast.error('Invalid JSON file', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: true,
            closeButton: false,
          });
        }
      };
      reader.readAsText(file);
    };

    const handleIframeLoad = () => {
      setIsLoading(false);
    };

    const handleIframeError = () => {
      setIsLoading(false);
      setError('Failed to load ComfyUI. Please ensure the API URL correct.');
    };

    const showSettingButton = useMemo(() => {
      if (settingsDisabled) {
        return false;
      }
      return !isValidUrl(value);
    }, [value, settingsDisabled]);

    const reloadSettings = async () => {
      const settings = await model.settings.loadSettingsEnv();
      const api = settings?.envs?.find(env => env.key === COMFYUI_API)?.value;
      if (api && isValidUrl(api)) {
        setValue('api', api);
        setIsLoading(true);
      } else {
        toast.error('Invalid ComfyUI API settings', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    };

    const disabled = useMemo(
      () => showSettingButton || isLoading || !loaded,
      [showSettingButton, isLoading, loaded],
    );

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
            padding: '12px 16px',
            height: '100vh',
            width: '100vw',
            margin: 0,
            top: 0,
            paddingBottom: 0,
          },
          body: {
            height: 'calc(100vh - 55px - 53px)',
            padding: 0,
            overflow: 'hidden',
          },
        }
      : {
          content: {
            padding: '12px 16px',
          },
        };

    const showMessageDetail = (detail?: string) => {
      setMessageDetail(detail || '');
      setMessageDetailOpen(true);
    };

    return (
      <div>
        <ComfyUIEditorButton />
        <Modal
          title={
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="text-lg font-medium">ComfyUI Editor</span>
                {error && (
                  <div className="text-red-500 font-normal">{error}</div>
                )}
                <ExportOutlined
                  className="cursor-pointer text-primary"
                  onClick={() => {
                    window.open(value, '_blank');
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Tooltip
                  title={
                    model.fullscreen.isOn ? 'Exit fullscreen' : 'Fullscreen'
                  }>
                  <Button onClick={model.fullscreen.toggle} variant="plain">
                    {model.fullscreen.isOn ? (
                      <FullscreenExitOutlined />
                    ) : (
                      <FullscreenOutlined />
                    )}
                  </Button>
                </Tooltip>
              </div>
            </div>
          }
          styles={modalStyles}
          forceRender
          open={model.iframeDialog.isOpen}
          onOk={handleSave}
          mask={false}
          width={model.fullscreen.isOn ? '100%' : '80%'}
          className={model.fullscreen.isOn ? 'top-0 p-0 m-0' : 'top-5'}
          footer={
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={model.iframeDialog.close}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={disabled}
                loading={saveLoading}>
                Save
              </Button>
            </div>
          }
          closeIcon={null}>
          {isLoading && !showSettingButton && (
            <div className="flex justify-center items-center h-[80vh]">
              <Spinner size="lg" className="text-brand" />
            </div>
          )}
          {showSettingButton && (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <div className="text-center mb-4">
                Failed to connect to ComfyUI at {value || 'undefined address'}.
                Please verify the address or update it in the environment
                settings.
                <Button
                  size="sm"
                  onClick={model.settings.modal.open}
                  variant="outline"
                  className="ml-2">
                  Settings
                </Button>
              </div>
              <Button variant="primary" size="sm" onClick={reloadSettings}>
                <ReloadOutlined className="mr-2" />
                Reload
              </Button>
            </div>
          )}
          <iframe
            title="comfyui"
            ref={iframeRef}
            src={value}
            className={`w-full ${
              model.fullscreen.isOn ? 'h-full' : 'h-[80vh]'
            } ${isLoading || showSettingButton ? 'hidden' : ''}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
          <Modal
            title="Error Detail"
            open={messageDetailOpen}
            onCancel={() => setMessageDetailOpen(false)}
            footer={[
              <Button onClick={() => setMessageDetailOpen(false)}>
                Close
              </Button>,
            ]}>
            <div
              dangerouslySetInnerHTML={{
                __html: messageDetail?.replaceAll('\n', '<br />') || '',
              }}
            />
          </Modal>
          <AModal
            hideCancelButton
            okText="Ok"
            width={420}
            title="File path of extended ComfyUI json"
            open={model.locationFormDialog.isOpen}
            onOk={model.onLocationDialogOk}
            onCancel={model.locationFormDialog.close}>
            <LocationForm />
          </AModal>
        </Modal>
        <CheckDialog
          open={checkDialogOpen}
          setModalOpen={model.iframeDialog.open}
          setOpen={setCheckDialogOpen}
          dependencies={dependencies}
          comfy_workflow_id={getValues('comfy_workflow_id')}
        />
      </div>
    );
  },
);

export const LocationFormItem = observer(
  (props: {
    value?: string;
    onChange: (value: string) => void;
    errorMsg?: string;
    onBlur: (value?: string) => void;
  }) => {
    return (
      <Form.Item
        colon={false}
        tooltip={LocTip}
        label="Location"
        help={props.errorMsg}
        validateStatus={props.errorMsg == null ? undefined : 'error'}
        css={css`
          margin-bottom: 12px;
          // .ant-row {
          //   flex-flow: row;
          // }
        `}>
        <Flex alignItems="center">
          <Input
            value={props.value}
            onChange={e => {
              props.onChange(e.target.value);
            }}
            onBlur={e => props.onBlur(props.value)}
            placeholder="File path of extended ComfyUI json"
          />
          {/* <Box ml={1}>
            <FolderOpenIcon className="w-5 h-5 text-icon-brand" />
          </Box> */}
        </Flex>
      </Form.Item>
    );
  },
);

const ComfyUIEditorButton = observer(props => {
  const model = useInjection<ComfyUIModel>('ComfyUIModel');
  return (
    <>
      <LocationFormItem
        onChange={model.setLocationTemp}
        value={model.locationTemp}
        errorMsg={model.locErrorMsg}
        onBlur={() => model.checkLocation2()}
      />
      <Button
        size="sm"
        className="w-full"
        onClick={model.iframeDialog.open}
        disabled={model.buttonDisabled}>
        {model.buttonName}
      </Button>
    </>
  );
});

export const LocationForm = observer(() => {
  const model = useInjection<ComfyUIModel>('ComfyUIModel');
  return (
    <Formik<{ location?: string }>
      initialValues={{
        location: model.locationTemp,
      }}
      onSubmit={values => {
        model.submitLocationDialog();
      }}>
      {formikProps => {
        model.locationFormFormik.setFormikProps(formikProps);
        return (
          <Form
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
            <Field name="location">
              {({ field }: FieldProps) => (
                <LocationFormItem
                  value={field.value}
                  onChange={v => {
                    formikProps.setFieldValue('location', v);
                  }}
                  errorMsg={formikProps.errors['location']}
                  onBlur={() => {
                    const e = model.checkLocation(field.value);
                    formikProps.setFieldError('location', e);
                  }}
                />
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
});
