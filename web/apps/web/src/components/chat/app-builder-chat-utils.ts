import { EntityInfo, Message } from '@shellagent/chat-engine';
import { v4 as uuidv4 } from 'uuid';

export const testEntity = {
  id: 'test-app-builder',
  name: 'App Builder',
  energyPerChat: 5,
};

export const testUserId = 'test-app-builder';

/**
 * 拆这个文件是为了方便做 unit test
 * 一般来说没必要拆太多文件(over design)就放在 model 里了
 * 但是 model 里面目前依赖的 @shellagent/chat-engine 有 React 相关的
 */
export function serverMessageToMessage(
  entity: EntityInfo,
  serverMessage: any,
): Message {
  return {
    id: serverMessage.id,
    userId: testUserId,
    entityId: entity.id,
    type: 'REPLY',
    status: serverMessage.status,
    createdDateUnix: serverMessage.createdDateUnix,
    updatedDateUnix: serverMessage.updatedDateUnix,
    text: serverMessage.text,
  };
}

export function draftMessageToMessage(
  entity: EntityInfo,
  text: string,
): Message {
  const id = uuidv4();
  return {
    id,
    userId: testUserId,
    entityId: entity.id,
    type: 'REPLY',
    status: 'PENDING',
    createdDateUnix: Date.now().toString(),
    updatedDateUnix: Date.now().toString(),
    text,
  };
}
