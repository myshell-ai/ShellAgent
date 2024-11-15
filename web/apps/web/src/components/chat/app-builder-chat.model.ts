import {
  EventSourceMessage,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { Message, SlashCommandInput } from 'myshell-bundled-chat';
import { Automata } from '@shellagent/pro-config';
import { ChatNewModel } from '@shellagent/ui';
import axios from 'axios';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { JsonSchema7 } from 'node_modules/@shellagent/form-engine/src/types/jsonSchema7';
import { v4 as uuidv4 } from 'uuid';

import { upload } from '@/services/common';

import { serverMessageToMessage, testUserId } from './app-builder-chat-utils';
import type {
  MessageComponentsButton,
  ServerMessage,
} from '../../services/app/message-type';
import { EventStatusEnum, RunAppRequest } from '../../services/app/type';
import { generateUUID } from '../../utils/common-helper';
import { EmitterModel } from '../../utils/emitter.model';

@injectable()
export class AppBuilderChatModel {
  @observable runOpen = false;

  @observable isInitBotLoading = false;

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
    this.chatNew.handlers.sendButtonInteractionMessagePost = async (
      buttonInteractionParams: {
        text?: string;
        componentInputMessage?: string;
        imSlashCommandInput?: SlashCommandInput;
        buttonId?: string;
      },
      requestParams?: any,
    ) => {
      const appReq: RunAppRequest = {
        session_id: this.session_id!,
        buttonId: buttonInteractionParams.buttonId,
        messageType: 15,
        text: '',
        message: '',
      };
      await this.sendToServer(appReq);
    };

    this.chatNew.handlers.clearMemoryPost = this.greeting.bind(this);
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

  async receiveServerMessage(serverMessage: ServerMessage, isGreeting = false) {
    const message = serverMessageToMessage(this.chatNew.entity, serverMessage);
    if (isGreeting) {
      this.chatNew.innerMethods.appendMessages!(message, true);
    } else {
      this.chatNew.innerMethods.onMessageReply!(message);
    }
  }

  async receiveServerMessageError(errorMessage: any) {
    const message: Message = serverMessageToMessage(
      this.chatNew.entity,
      errorMessage,
    );
    this.chatNew.innerMethods.onMessageReply!(message);
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
      this.chatNew.clearMemory();
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
              this.receiveServerMessageError(data);
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
            this.receiveServerMessage!(server_message, isGreeting);
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
      entityId: this.chatNew.entity.id,
      type: 'TEXT',
      status: 'DONE',
      createdDateUnix: Date.now().toString(),
      updatedDateUnix: Date.now().toString(),
      text: `Clicked ${button.content.text}`,
    };
    this.chatNew.innerMethods.appendMessages!(message, true);
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
    const text2 = Object.keys(this.formValue)
      .map(key => `${key}: ${this.formValue[key]}`)
      .join('<br/>');
    const message: any = {
      id: generateUUID(),
      userId: testUserId,
      entityId: this.chatNew.entity.id,
      type: 'TEXT',
      status: 'DONE',
      createdDateUnix: Date.now().toString(),
      updatedDateUnix: Date.now().toString(),
      text: `<span style="color: #3e5cfa;">/${
        this.currentLuiButton!.buttonText
      }</span><br/>${text2}`,
    };
    this.chatNew.innerMethods.appendMessages!(message, true);
    const appReq: RunAppRequest = {
      form_data: this.formValue,
      session_id: this.session_id!,
      buttonId: this.currentLuiButton!.buttonId,
      messageType: 15,
      text: '',
      message: '',
    };
    await this.sendToServer(appReq);
  }

  async uploadFile(file: File) {
    const { url } = await upload(file);
    this.chatNew.innerMethods.sendTextMessage!(`Upload file, ${url}`);
  }
}
