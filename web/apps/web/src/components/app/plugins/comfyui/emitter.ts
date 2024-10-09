import mitt from 'mitt';
import { useEffect } from 'react';

export enum EventType {
  UPDATE_FORM = 'UPDATE_FORM',
}

type Events = {
  [EventType.UPDATE_FORM]: {
    data: {
      inputs: Record<
        string,
        {
          title: string;
          type: string;
          default?: any;
          description: string;
        }
      >;
      outputs: Record<
        string,
        {
          title: string;
          type: string;
          items?: {
            type: string;
            url_type: string;
          };
        }
      >;
    };
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
