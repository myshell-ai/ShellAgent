import { injectable } from 'inversify';
import { makeObservable } from 'mobx';
import { ChatNewModelHandlers } from './interfaces/chatNewModelHandlers';
import { ChatNewModelInnerMethods } from './interfaces/chatNewModelInnerMethods';
import {
  ChatModuleType,
  FollowStatus,
  LoginType,
  Message,
  User,
  UserSourceEnum,
} from 'myshell-bundled-chat';

@injectable()
export class ChatNewModel {
  isReadyPromise: Promise<unknown>;
  isReadyPromiseResolve: ((value: unknown) => void) | undefined;
  type = 'bot' as ChatModuleType;
  userId = user.id;
  user = user;
  entity = {
    id: 'shellagent-app-builder-chat',
    name: 'ShellAgent App Builder Chat',
  };
  handlers: Partial<ChatNewModelHandlers> = {};
  innerMethods: Partial<ChatNewModelInnerMethods> = {};

  constructor() {
    makeObservable(this);
    this.isReadyPromise = new Promise(resolve => {
      this.isReadyPromiseResolve = resolve;
    });
  }

  clearMemory() {
    this.innerMethods.appendMessages!(clearMemoryMessage, true);
    this.handlers.clearMemoryPost?.();
  }
}

const clearMemoryMessage = {
  id: '1856539384440025088',
  userId: '3537713',
  referenceText: '',
  text: '',
  audioUrl: '',
  duration: 0,
  audioSpeed: 1,
  status: 'DONE',
  type: 'RESET',
  createdDateUnix: '1731468456737',
  updatedDateUnix: '1731468456737',
  entityId: '1719284610',
  replyId: '0',
  feedbackState: 'Normal',
  feedbackIssues: [],
  asyncJobInfo: null,
  runningWidgetInfo: [],
  runningError: null,
  handled: false,
  imageGenMessageResponse: null,
  inputSetting: null,
  uploadSetting: null,
  componentContainer: null,
  embedObjs: [],
  slashCommandInput: null,
  referenceSource: [],
  recommendatioQuestions: {
    question: [],
  },
  regeneratedMessages: [],
  extraInfo: {
    consumeEnergy: 0,
    canEdit: false,
    canRegenerate: false,
    runningWidgetInfo: [],
    bgm: null,
    senderInfo: null,
  },
  isLlmBot: false,
} as unknown as Message;

const user = {
  avatar: 'default_avatars/Group10.png',
  email: '',
  id: 'user-of-shellagent-app-builder-chat',
  isGenesisPasscard: false,
  isNftAvatar: false,
  isPasscard: false,
  level: 1,
  name: 'User of ShellAgent App Builder Chat',
  nameTag: '#8636',
  createdDate: '2024-08-14T15:06:59+08:00',
  createdTime: '2024-08-14 15:06:59.008',
  publicAddress: '',
  source: 'privy' as UserSourceEnum,
  hasParticleAccount: false,
  privateBotLimit: 30,
  publicBotLimit: 0,
  premiumInfo: {
    level: 0,
    totalExp: 0,
    nextLevelNeedExp: 5,
    currentLevelExp: 0,
  },
  canPublishNewBot: false,
  connectInfo: null as any,
  followedCount: 0 as any,
  fansCount: 0 as any,
  followStatus: 'NOT_AVAILABLE' as FollowStatus,
  description: '',
  backgroundUrl: '',
  loginCredential: '',
  loginType: 'LOGIN_TYPE_EMAIL' as LoginType,
} as User;
