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
import { Transition, SpecialEvents } from './transition';

type BlockType = 'automata' | 'state' | 'task' | 'workflow';

interface Block {
  /**
   * Globally unique id.
   * Recommended for root block.
   */
  // id?: string;
  type: BlockType;
  name?: string;
  /** Static config. Similar to metadata. */
  properties?: {};
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
}

/**
 * 如果一个block有其它block作为children，我们支持单block、数组block、对象block三种写法，且允许为block添加额外字段（譬如transitions）。
 */
type BlockChildren<
  T extends Block,
  ChildrenFields extends Record<string, unknown> = {},
> =
  | (T & ChildrenFields & { key: CustomKey })
  | {
      [key: CustomKey]: T & ChildrenFields;
    }
  | (T & ChildrenFields & { key: CustomKey })[]; // 后续可以废弃

interface ContainerBlock extends Block {
  context?: {
    [output_name: CustomKey]: Variable | Value;
  };
  blocks: BlockChildren<Block, {}>;
}

export interface State extends Block {
  type: 'state';
  properties?: {
    is_final?: boolean;
    cache?: boolean;
  };
  // tasks?: BlockChildren<Task>;
  blocks?: BlockChildren<Task | Workflow>; // user_input字段无效
  render?: RenderConfig;
}

type StateExtra = {
  transitions?: { [key in CustomEventName | SpecialEvents]?: Transition };
};

export interface Automata extends ContainerBlock {
  type: 'automata';
  properties?: {
    cache?: boolean;
  };
  initial: CustomKey;
  blocks: BlockChildren<State, StateExtra>; // 后续支持Automata ｜ Task 等等
  transitions?: { [key in CustomEventName | 'DONE']?: Transition };
}

/**
 * Task是一种特殊的Block。它自己不定义inputs和outputs，而是调用某个能根据输入返回输出的对象。输入是该对象需要的输入，输出是该对象返回的输出。
 * 它主要适用于两种场景：
 * - 调用某个不通过Pro Config定义的widget
 * - 隔离不同的Pro Config定义的场景。
 */
interface TaskBase extends Block {
  type: 'task';
  properties?: {
    cache?: boolean;
  };
  mode?: string;
  // 用params区分input schema更好一点？因为inputs不是TaskBlock的输入，而是callee需要的参数
  // params?: Record<string, Value | Variable>;
  // inputs?: undefined;
  outputs?: undefined;
}
interface BlockTask extends TaskBase {
  mode?: 'block';
  block: Block;
}
// interface APITask extends TaskBase {
//   mode?: 'api';
//   api: {
//     url: string;
//     method: 'GET' | 'POST';
//   };
// }

interface WidgetTask extends TaskBase {
  mode?: 'widget';
  widget_name?: string; // "@shellagent/6517312581" 来表示主站内widget
  widget_class_name?: string;
}

interface WorkflowTask extends TaskBase {
  mode?: 'workflow';
  workflow_id: string;
}

interface UndefinedTask extends TaskBase {
  mode?: 'undefined';
  widget_class_name?: string;
  input_names: Array<string>;
  input_types: Array<string>;
  output_names: Array<string>;
  output_types: Array<string>;
}

export type Task = BlockTask | WidgetTask | WorkflowTask | UndefinedTask;

/**
 * 通过conditional transition支持并行任务运行，所有condition为true的TransitionCase都会运行。
 * 这不同于Automata，只会运行第一个condition为true的TransitionCase。
 */
export interface Workflow extends ContainerBlock {
  type: 'workflow';
  properties?: {
    cache?: boolean;
  };
  blocks: BlockChildren<Task, { transitions?: { ALWAYS: Transition } }>; // 后续支持 Workflow
}
