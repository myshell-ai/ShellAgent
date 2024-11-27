import { NodeId } from '@shellagent/flow-engine';
import mitt from 'mitt';
import { useEffect } from 'react';

export enum EventType {
  FORM_CHANGE = 'FORM_CHANGE',
  RESET_FORM = 'RESET_FORM',
}

type Events = {
  [EventType.FORM_CHANGE]: {
    id?: NodeId;
    data: string;
    type: 'StateCard' | 'StateConfigSheet';
  };
  [EventType.RESET_FORM]: {
    data: string;
  };
};

const emitter = mitt<Events>();

const useEventEmitter = <EventKey extends keyof Events>(
  eventKey: EventKey,
  handler: (eventData: Events[EventKey]) => void,
) => {
  useEffect(() => {
    emitter.on(eventKey, handler);

    return () => {
      emitter.off(eventKey, handler);
    };
  }, [eventKey, handler]);
};

export { useEventEmitter };
export default emitter;
