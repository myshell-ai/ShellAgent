import { CustomKey, CustomEventName, TargetPath } from './common';
import { Value, BoolExpression, URLString, Input } from './variables';
import { Task } from './block';
import { Button } from '.';

/* State transitions */
export type TransitionCase = {
  /** Transist to the self if unspecified */
  target?: TargetPath;
  // TODO(@Boyn): override the value?
  /** Specify the value for the inputs of target state. It will override the default value of the input, but not the value of the input. */
  target_inputs?: {
    [input_name: CustomKey]: Value;
  };
  /** Transist only if `condition` is evaluated as `true`. Treated as `true` when unspecified. */
  condition?: boolean | BoolExpression; // TODO(@Boyn): 增加boolean类型
  /** Might display a message when `condition` is not satisfied */
  error_message?: string;
};

/**
 * - Target: the simplest case. Transist to target state.
 * - TransitionCase: use `condition` to guard transitions.
 * - TransitionCase[]: evaluate `condition` one by one. Whenever a case is satisfied, transist to its target.
 */
export type Transition = TargetPath | TransitionCase | TransitionCase[];

/**
 * 'DONE' is triggered when one of automata's final state completes.
 */
export type AutomataSpecialEvents = 'DONE';

/**
 * - 'CHAT' is triggered when user inputs in IM.
 * - 'ALWAYS' means the state will transist as soon as its condition is satisfied after executing tasks.
 */
export type StateSpecialEvents = 'CHAT' | 'ALWAYS';

export type ActionEvents = 'COPY' | 'OPEN' | 'DOWNLOAD';

export type SpecialEvents =
  | AutomataSpecialEvents
  | StateSpecialEvents
  | ActionEvents;
