import {
  EventSourceMessage,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { EntityInfo, Message } from '@shellagent/chat-engine';
import { Automata } from '@shellagent/pro-config';
import { ChatNewModel } from '@shellagent/ui';
import axios from 'axios';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { JsonSchema7 } from 'node_modules/@shellagent/form-engine/src/types/jsonSchema7';
import { v4 as uuidv4 } from 'uuid';

import { upload } from '@/services/common';

import {
  serverMessageToMessage,
  testEntity,
  testUserId,
} from './app-builder-chat-utils';
import type {
  MessageComponentsButton,
  MessageComponentsButtonAction,
  ServerMessage,
} from '../../services/app/message-type';
import { EventStatusEnum, RunAppRequest } from '../../services/app/type';
import { generateUUID } from '../../utils/common-helper';
import { EmitterModel } from '../../utils/emitter.model';

@injectable()
export class AppBuilderChatModel {
  testEntity: EntityInfo = testEntity;

  @observable runOpen = false;

  @observable isInitBotLoading = false;

  @observable isLuiButtonModalOpen = false;

  @observable isRunLoading = false;

  @observable previousTasksNumber = 0;

  currentLuiButton:
    | {
        buttonId: string;
        buttonText: string;
        schema: JsonSchema7;
      }
    | undefined = undefined;

  formValue: any = undefined;
  @observable isFormValid: boolean = false;

  session_id: string | undefined;

  serverMessageMap = new Map<string, ServerMessage>();

  constructor(
    @inject(EmitterModel) private emitter: EmitterModel,
    @inject(ChatNewModel) public chatNew: ChatNewModel,
  ) {
    this.chatNew.handlers.sendTextMessagePost = async (text: string) => {
      const appReq: RunAppRequest = {
        session_id: this.session_id!,
        messageType: 1,
        text,
        message: text,
      };
      await this.sendToServer(appReq);
    };
    makeObservable(this);
  }

  @action.bound
  openRunDrawer() {
    this.runOpen = true;
  }

  @action.bound
  closeRunDrawer() {
    this.runOpen = false;
  }

  @action.bound
  openLuiButtonModal(
    buttonId: string,
    buttonText: string,
    buttonAction: MessageComponentsButtonAction,
  ) {
    this.isLuiButtonModalOpen = true;
    this.currentLuiButton = {
      schema: buttonAction.formSchema!,
      buttonText,
      buttonId,
    };
  }

  @action.bound
  closeLuiButtonModal() {
    this.isLuiButtonModalOpen = false;
    this.currentLuiButton = undefined;
    this.formValue = undefined;
    // this.isFormValid = false;
  }

  onChangeModalForm(value: any) {
    this.formValue = value;
    // this.isFormValid = Object.values(value).every(value => value != null && value !== '');
    setTimeout(() => {
      this.isFormValid = Object.values(value).every(
        value => value != null && value !== '',
      );
    });
  }

  /**
   * 对 addMessage 的封装, 参数变成 server message
   */
  async receiveServerMessage(serverMessage: ServerMessage) {
    this.serverMessageMap.set(serverMessage.id, serverMessage);
    const message = serverMessageToMessage(testEntity, serverMessage);
    this.chatNew.innerMethods.addMessage!(message);
  }

  async receiveServerMessageError(errorMessage: string) {
    const message: Message = {
      id: uuidv4(),
      userId: testUserId,
      entityId: this.testEntity.id,
      type: 'REPLY',
      status: 'ERROR',
      createdDateUnix: Date.now().toString(),
      updatedDateUnix: Date.now().toString(),
      text: errorMessage,
    };
    this.chatNew.innerMethods.addMessage!(message);
  }

  async initBot(automata: Automata) {
    runInAction(() => {
      this.isInitBotLoading = true;
    });
    try {
      const res = await axios.post(
        `/api/app/init_bot`,
        {
          automata,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (res.data.session_id == null && res.data.message) {
        this.emitter.emitter.emit('message.error', res.data.message);
        return;
      }
      this.session_id = res.data.session_id;
      this.openRunDrawer();
      await this.chatNew.isReadyPromise;
      this.chatNew.innerMethods.clearMessageList!();
      this.greeting();
    } catch (e: any) {
      this.emitter.emitter.emit('message.error', e.message);
    } finally {
      runInAction(() => {
        this.isInitBotLoading = false;
      });
    }
  }

  async greeting() {
    await this.sendToServer(
      {
        messageType: -1,
      },
      true,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendToServer(message: any, isGreeting = false) {
    if (this.session_id == null) {
      this.emitter.emitter.emit(
        'message.error',
        'Session lost, try to click Run again?',
      );
      return;
    }

    const abortController = new AbortController();
    await this.chatNew.isReadyPromise;
    runInAction(() => {
      this.isRunLoading = true;
    });
    fetchEventSource('/api/app/run', {
      method: 'POST',
      mode: 'cors',
      headers: {
        method: 'POST',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: this.session_id,
        ...message,
      }),
      signal: abortController.signal,
      openWhenHidden: true,
      onerror: err => {
        this.emitter.emitter.emit('message.error', err.message);
        runInAction(() => {
          this.isRunLoading = false;
        });
      },
      onmessage: (ev: EventSourceMessage) => {
        if (ev.event === EventStatusEnum.state_exit) {
          try {
            const data = JSON.parse(ev.data);
            if (data.node_status === 'failed') {
              this.receiveServerMessageError(
                `${data.output.error_message}_$$_${data.output.error_message_detail}`,
              );
              return;
            }
            const { server_message } = data;
            if (server_message.inputSetting.canUploadFile) {
              this.chatNew.enableIMUpload();
            } else {
              this.chatNew.disableIMUpload();
            }
            if (server_message.inputSetting.canInputText) {
              this.chatNew.enableIMText();
            } else {
              this.chatNew.disableIMText();
            }
            if (server_message.inputSetting.canInputAudio) {
              this.chatNew.enableIMAudio();
            } else {
              this.chatNew.disableIMAudio();
            }
            // if (isGreeting && server_message.text === '') {
            //   //
            // } else {
            this.receiveServerMessage!(server_message);
            // }
          } catch {
            this.emitter.emitter.emit(
              'message.error',
              `Parse error, ${ev.data}`,
            );
          } finally {
            runInAction(() => {
              this.isRunLoading = false;
            });
          }
        }
        if (ev.event === EventStatusEnum.queuing) {
          try {
            const data = JSON.parse(ev.data);
            this.previousTasksNumber = data.previous_tasks;
          } catch {
            this.emitter.emitter.emit(
              'message.error',
              `Parse error, ${ev.data}`,
            );
          }
        }
      },
      onopen: async () => {
        //
      },
    });
  }

  async clickSimpleButton(button: MessageComponentsButton) {
    const message: any = {
      id: generateUUID(),
      userId: testUserId,
      entityId: this.testEntity.id,
      type: 'TEXT',
      status: 'DONE',
      createdDateUnix: Date.now().toString(),
      updatedDateUnix: Date.now().toString(),
      text: `Clicked ${button.content.text}`,
    };
    this.chatNew.innerMethods.addMessage!(message);
    const appReq: RunAppRequest = {
      session_id: this.session_id!,
      buttonId: button.buttonId,
      messageType: 15,
      text: '',
      message: '',
    };
    await this.sendToServer(appReq);
  }

  async onClickModalRun() {
    const message: any = {
      id: generateUUID(),
      userId: testUserId,
      entityId: this.testEntity.id,
      type: 'TEXT',
      status: 'DONE',
      createdDateUnix: Date.now().toString(),
      updatedDateUnix: Date.now().toString(),
      text: `Clicked ${this.currentLuiButton!.buttonText}, ${JSON.stringify(this.formValue)}`,
    };
    this.chatNew.innerMethods.addMessage!(message);
    const appReq: RunAppRequest = {
      form_data: this.formValue,
      session_id: this.session_id!,
      buttonId: this.currentLuiButton!.buttonId,
      messageType: 15,
      text: '',
      message: '',
    };
    await this.sendToServer(appReq);
    this.closeLuiButtonModal();
  }

  async uploadFile(file: File) {
    const { url } = await upload(file);
    this.chatNew.innerMethods.sendTextMessage!(`Upload file, ${url}`);
  }
}
