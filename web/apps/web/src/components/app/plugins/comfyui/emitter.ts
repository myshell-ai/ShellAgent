import mitt from 'mitt';
import { useEffect } from 'react';

export enum EventType {
  UPDATE_FORM = 'UPDATE_FORM',
}

type Events = {
  [EventType.UPDATE_FORM]: {
    id: string;
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
