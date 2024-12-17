import { FieldValue, FieldValues } from '@shellagent/ui';

import { ISchema } from './schema';
import { IValidatorRules } from './validator';
import { FieldMode } from '@shellagent/shared/protocol/extend-config';
import React from 'react';
export type XTypes =
  | 'Section'
  | 'Block'
  | 'Control'
  | 'Card'
  | 'Grid'
  | 'Switch'
  | 'Inline'
  | 'Render';
export type XLayouts = 'Vertical' | 'Horizontal';
export type XReactions = {
  when: string;
  target: string;
  fullfill?: {
    schema?: ISchema;
    state?: {
      value?: FieldValue<FieldValues>;
    };
  };
  otherwise?: {
    schema?: ISchema;
    state?: {
      value?: FieldValue<FieldValues>;
    };
  };
};

export interface IUISchema {
  'x-type'?: XTypes;
  // 接口定义的type字段，存在多种扩展类型，用于校验ref选择类型
  'x-field-type'?: string;
  'x-title-size'?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  'x-title-icon'?: string;
  'x-title-copiable'?: boolean;
  'x-hidden-title'?: boolean;
  'x-layout'?: XLayouts;
  'x-component'?: string;
  'x-class'?: string;
  'x-wrapper-class'?: string;
  'x-component-props'?: { [key: string]: any };
  'x-disabled'?: boolean;
  'x-read-only'?: boolean;
  // 校验
  'x-validator'?: IValidatorRules[];
  // 自定义渲染校验
  'x-validator-render'?: string;
  // 动态表单
  'x-reactions'?: XReactions | XReactions[];
  // 开启是否可折叠;
  'x-collapsible'?: boolean;
  'x-default-expand'?: boolean;
  // Card role
  'x-role'?: string;
  // 可拖动
  'x-dropable'?: boolean;
  'x-draggable'?: boolean;
  // 对象属性 / 数组元素可删除
  'x-deletable'?: boolean;
  'x-parent-deletable'?: boolean;
  // 对象属性 / 数组元素可添加
  'x-addable'?: boolean;
  'x-switchable'?: boolean;
  'x-switchable-default'?: boolean;
  'x-switch-default-value'?: FieldValue<FieldValues>;
  // 隐藏
  'x-hidden'?: boolean;
  // 仅隐藏form control
  'x-hidden-control'?: boolean;
  // value 和 onchange 的别名，解决 switch 等组件的兼容问题;
  'x-value-prop-name'?: string;
  'x-onchange-prop-name'?: string;
  // 空样式
  'x-empty'?: {
    text: string;
  };
  // Raw 模式
  'x-raw'?: boolean;
  'x-raw-disabled'?: boolean;
  'x-raw-default'?: FieldMode;
  'x-raw-options'?: Array<FieldMode>;
  // key 支持 counter 等能力
  'x-key'?: string;
  'x-title-editable'?: boolean;
  'x-title-component-props'?: { [key: string]: any };
  'x-inline'?: boolean;
  // 组件前缀
  'x-prefix'?: string;
  // 组件后缀
  'x-suffix'?: string;
  // 错误兜底
  'x-error-component'?: string;
  'x-edit-dialog'?: ISchema;
  'x-anyof'?: ISchema[];
}
