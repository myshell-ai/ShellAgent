/* eslint-disable */
import { find, entries } from 'lodash-es';
import { customSnakeCase } from '@shellagent/shared/utils';

// 新创建一个方法，生成新的key
// key会在原有的基础上加1个编号后缀，该编号是所有同名key编号的最大值+1
export function getNewKey({
  name,
  nameKey,
  values,
  prefix,
}: {
  name: string;
  nameKey: string;
  values: Record<string, any> | Record<string, any>[];
  prefix: string;
}) {
  // 如果名称为空，使用 Untitled
  if (!name?.trim()) {
    name = 'Untitled';
  }

  const snakeName = customSnakeCase(name);
  const prefixSnakeCase = customSnakeCase(prefix);

  // 获取现有的keys
  const getExistingKeys = () => {
    const isUntitled = name === 'Untitled';
    const prefix = isUntitled ? `untitled_${prefixSnakeCase}` : snakeName;

    return Array.isArray(values)
      ? values
          .map(item => item[nameKey])
          .filter(key => key === prefix || key?.startsWith(`${prefix}_`))
      : Object.keys(values).filter(
          key => key === prefix || key.startsWith(`${prefix}_`),
        );
  };

  const existingKeys = getExistingKeys();

  // 如果是首次出现且不是Untitled，直接返回snakeName
  if (existingKeys.length === 0 && name !== 'Untitled') {
    return { name, key: snakeName };
  }

  // 获取最大后缀数字
  const maxCount = existingKeys.reduce((max, key) => {
    const match = key.match(/_(\d+)$/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);

  const key =
    name === 'Untitled'
      ? `untitled_${prefixSnakeCase}_${maxCount + 1}`
      : `${snakeName}_${maxCount + 1}`;

  return { name, key };
}

export function getExisiedKey({
  values,
  name,
}: {
  values: Record<string, any> | Record<string, any>[];
  name: string;
}) {
  if (Array.isArray(values)) {
    return find(values, { name })?.name;
  }

  const [key] =
    find(entries(values), ([_, value]) => value.name === name) || [];
  return key;
}
