import { inject, injectable } from 'inversify';
import { makeObservable, observable, action } from 'mobx';
import { z } from 'zod';

import { MessageItem } from '@/components/assistant-help/definitions';
import { ModalModel } from '@/utils/modal.model';
import { clearMemory, query } from '@/services/assistant';

@injectable()
export class AssistantModel {
  @observable question: string = '';
  @observable sending: boolean = false;
  @observable messages: z.infer<typeof MessageItem>[] = [];

  constructor(@inject(ModalModel) public drawer: ModalModel) {
    makeObservable(this);
  }

  @action.bound
  setQuestion(question: string) {
    this.question = question;
  }

  @action.bound
  async query() {
    try {
      const question = this.question;
      console.log('this.question: ', this.question);
      this.sending = true;
      this.messages = this.messages.concat({ question }, { loading: true });
      this.question = '';
      const res = await query({
        question,
      });
      console.log('res: ', res);
      this.messages = this.messages.filter(item => !item.loading).concat(res);
      this.sending = false;
    } catch (e: any) {
      this.sending = false;
    }
  }

  @action.bound
  async clearMemory() {
    try {
      await clearMemory();
      this.messages = [];
    } catch (e: any) {
      // this.emitter.emitter.emit('message.error', e.message);
    }
  }
}
