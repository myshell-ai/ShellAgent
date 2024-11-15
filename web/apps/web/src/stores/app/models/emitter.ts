import { NodeId } from '@shellagent/flow-engine';
import mitt from 'mitt';
import { useEffect } from 'react';

export enum EventType {
  STATE_FORM_CHANGE = 'STATE_FORM_CHANGE',
}

type Events = {
  [EventType.STATE_FORM_CHANGE]: {
    id: NodeId;
    data: string;
    type: 'StateCard' | 'StateConfigSheet';
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
