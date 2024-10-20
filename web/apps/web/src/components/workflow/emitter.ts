import { Edge, EdgeData } from '@shellagent/flow-engine';
import mitt from 'mitt';
import { useEffect } from 'react';

export enum EventType {
  DELETE_EDGE = 'DELETE_EDGE',
}

type Events = {
  [EventType.DELETE_EDGE]: Edge<EdgeData>;
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
