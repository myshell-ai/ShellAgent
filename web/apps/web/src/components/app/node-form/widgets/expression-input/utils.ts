import { CascaderOption } from '@shellagent/ui';

export const MentionRegex = /@\[(.*?)\]\(value:(.*?)\)/;
export const WrapperRegex = /^\{\{(.*?)\}\}/;
export const DEFAULT_LABEL = 'veriable undefined';

export const flattenOptions = (options: CascaderOption[]): CascaderOption[] => {
  const result: CascaderOption[] = [];

  const flatten = (opts: CascaderOption[], parentLabel: string = '') => {
    opts.forEach(option => {
      let label = parentLabel;
      if (option.label) {
        label = parentLabel ? `${parentLabel}.${option.label}` : option.label;
      }
      if (option.children && option.children.length > 0) {
        flatten(option.children, label);
      } else if (option.value) {
        const cleanValue = option.value.replace(/^\{\{|\}\}$/g, '');
        result.push({ ...option, label, value: cleanValue });
      }
    });
  };

  flatten(options);
  return result;
};
