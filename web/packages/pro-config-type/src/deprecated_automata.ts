import type {
  LLMModel,
  LLMFunctionModule,
  LLMModule,
  TtsModule,
  AnyWidgetModule,
} from './deprecated_modules';
import { CustomKey, CustomEventName, TargetPath } from './common';
import {
  Variable,
  Value,
  Input,
  Expression,
  NumExpression,
  BoolExpression,
} from './variables';
import { RenderConfig } from './render';
/* Basic data structure */

type BlockType = 'automata' | 'state' | 'widget';
/**
 * Shared by atomic state and automata.
 */
type StateBase = {
  /** Globally unique id. */
  id?: string;
  type?: BlockType;
  // TODO
  name?: string;
  /** Static config. Similar to metadata. */
  properties?: {
    is_final?: boolean;
    cache?: boolean;
    [key: CustomKey]: unknown;
  };
  /**
   * Expected inputs, including user inputs and other states' `outputs`.
   *
   * Similar to function's arguments and defined variables.
   *
   * `input_name` should be a lowercase, snake_case name.
   */
  inputs?: {
    [input_name: CustomKey]: Input | Value;
  };
  /**
   * Output values, including state's outputs and modification to parent automata's `context`, if it has a parent automata.
   *
   * Similar to function's returned values.
   *
   * `output_name` should be a lowercase, snake_case name, or a parent automata's context variable name.
   */
  outputs?: {
    [output_name: CustomKey | `context.${CustomKey}`]: Variable | Value;
  };
  /**
   * Indicates how state flows responding to user action.
   *
   * `transitions`'s keys are events which the state will handle, including events triggered by itself or its children states if its children states don't handle this event.
   *
   * We treat both actual happened events and user intents as events.
   *
   * `event` can be
   * - a lowercase, snake_case name concatenated by dots
   * - a uppercase special event name
   */
  transitions?: {
    [event: CustomEventName]: Transition;
  };
};

/**
 * An atomic state is a state executing real tasks, which usually are small functional modules, such as llm module and tts module.
 *
 * The atomic state will evaluate expressions by the order:
 * 1. `inputs`
 * 2. `tasks`. During tasks, one by one in order.
 * 3. `outputs`
 * 4. `render`
 */
export type AtomicState = StateBase & {
  type?: 'state';
  /**
   * Tasks executed in written order, involving no control ability such as if/else and loop.
   *
   * @deprecated Object config will be deprecated. The order cannot be guaranteed in Object style.
   */
  tasks?:
    | {
        [module_name: CustomKey]: TaskConfig;
      }
    | TaskConfig[];
  /** Controls how to display the result to user. */
  render?: RenderConfig;
  transitions?: StateBase['transitions'] & {
    [event in AtomicSpecialEvents]?: Transition;
  };
};

/**
 * Automata controls and schedules how its children states cooperate.
 */
export type Automata = StateBase & {
  type?: 'automata';
  /**
   * The initial state's name. If the initial state is `Automata`, enters its initial state, too.
   */
  initial: CustomKey;
  properties?: StateBase['properties'] & {
    prevent_history_event?: boolean;
  };
  /**
   * `state_name` should be a lowercase, snake_case name.
   */
  states:
    | {
        [state_name: CustomKey]: State;
      }
    | State;
  /**
   * Variables in `context` are shared by all children states.
   *
   * `variable_name` should be a lowercase, snake_case name.
   *  Variables.value is initial value assigned by Automata
   */
  context?: {
    [variable_name in CustomKey]?: Variable | Expression;
  };
  transitions?: StateBase['transitions'] & {
    [event in AutomataSpecialEvents]?: Transition;
  };
};

export type State = AtomicState | Automata;

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
export type AtomicSpecialEvents = 'CHAT' | 'ALWAYS';

// TODO: BACK
/**
 * Unlike user defined events, special events won't be propagated to parent when triggered.
 */
export type SpecialEvents = AutomataSpecialEvents | AtomicSpecialEvents;

/* Config details */
export type ModuleConfig = {
  module_type: string;
  module_config: {
    output_name?:
      | CustomKey
      | {
          // TODO(@Boyn, @shuyu): 支持no-code output_name非规范化的变量名。
          name: CustomKey;
          label?: string;
        };
    [key: CustomKey]: unknown;
  };
};
type SupportModule =
  | LLMModule
  | LLMFunctionModule
  | TtsModule
  | AnyWidgetModule;

export type WidgetBlock = {
  /** widget_id */
  id: string;
  // tts | llm 之类的, 或者就叫widget
  task_type?: string;
  name?: string;
  // 原来module_config里的内容
  inputs?: {
    [key: CustomKey]: unknown;
  };
  /** Defaults to 'result' */
  output_name?: CustomKey;
  // TODO(@Boyn)
  // 上次说的重命名，也许对llmfunction很必要
  outputs?: {
    [output_name: CustomKey]: Variable | Expression;
  };
};

export type WorkflowStateBlock = Omit<AtomicState, 'render' | 'transitions'> & {
  transitions?: {
    ALWAYS: Transition;
  };
};

// export type SupportedModule = LLMFunctionModule | LLMModule | TTSModule;

export type TaskConfig = SupportModule & {
  name?: string;
  cache?: boolean;
};

export { LLMFunctionModule, LLMModule, TtsModule, AnyWidgetModule };
export type { MemoryItem, LLMModel } from './deprecated_modules';
