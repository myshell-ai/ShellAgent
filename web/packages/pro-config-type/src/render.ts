import { CustomKey, CustomEventName } from './common';
import { URLString, Expression, Value } from './variables';
import { ActionEvents } from './transition';

export type Button = {
  content: string | Expression;
  /** Tooltip when hovering button */
  description?: string | Expression;
  // TODO(@Boyn): visbile
  // TODO: disabled
  on_click:
    | CustomEventName
    | {
        event: CustomEventName | ActionEvents;
        /**
         * Payload can be passed to transitions.
         */
        payload?: {
          [key: CustomKey]: Value;
        };
      }
    | Action;
  // TODO: CSSProperties?
  style?: {
    /* Button font color appearance. Represent it with hex string */
    font_color?: string;
    /* Button background color appearance. Represent it with hex string */
    background_color?: string;
  };
  /**
   * @deprecated You can pass parameters to target by this field. However, it will be deprecated soon in favor of a better way.
   */
  UNSTABLE_button_id?: string;
};

/**
 * Config for MyShell bot message.
 */
export type RenderConfig = {
  sender?: {
    name?: string | Expression;
    avatar?: URLString | Expression;
  };
  text?: string | Expression;
  image?: URLString | Expression;
  audio?: URLString | Expression;
  video?: URLString | Expression;
  buttons?: Button[] | Button[][];
  suggested_reply?: string[];
};

type Action =
  | {
      event: 'COPY';
      payload: {
        content: string;
      };
    }
  | {
      event: 'DOWNLOAD';
      payload: {
        url: URLString;
      };
    }
  | {
      event: 'OPEN';
      payload: {
        url: string;
      };
    };
