import { NodeType } from '.';

export type WidgetItem = {
  display_name: string; // widget显示名称
  name: string; // widget名称(唯一标识)
  icon?: string; // icon
  desc?: string; // widget描述
  children?: WidgetItem[]; // 子widget
  type?: NodeType;
  custom?: boolean; // 是否为自定义widget
  undraggable?: boolean; // 是否可以拖拽至画布中
  customRender?: () => JSX.Element;
};

export type MaterialItem = {
  title?: string; // 分类描述
  items: WidgetItem[];
  plain?: boolean; // 是否为普通列表
  no_border?: boolean; // 是否展示border
};

export type MaterialListType = MaterialItem[];

export type DraggableNodeType = {
  nodeType: NodeType;
} & WidgetItem;
