/* eslint-disable */
import { TValues } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { isEqual, omit, merge, find, entries } from 'lodash-es';
import { customSnakeCase } from '@shellagent/shared/utils';

export enum DiffTypeEnum {
  Added = 'added',
  Deleted = 'deleted',
  Modified = 'modified',
  Renamed = 'renamed',
  Reordered = 'reordered',
}

export interface DiffResult {
  path: string;
  type: DiffTypeEnum;
  oldValue?: any;
  newValue?: any;
  fromIndex?: number;
  toIndex?: number;
}

export const replaceKey = (
  formRef: React.RefObject<FormRef>,
  {
    parentPath,
    oldKey,
    newKey,
    value,
  }: {
    parentPath: string;
    oldKey: string;
    newKey: string;
    value?: TValues;
  },
) => {
  const parentValue = formRef.current?.getValues(parentPath);
  if (!parentValue) return;
  if (oldKey === newKey) return;
  if (!newKey) {
    throw new Error('key should not be empty');
  }

  const keys = Object.keys(parentValue);
  const newParentValue = keys.reduce((prev: { [key: string]: any }, curr) => {
    if (curr === oldKey) {
      const oldValue = parentValue[curr];
      prev[newKey] =
        typeof oldValue === 'object' && value
          ? merge(oldValue, value)
          : value || oldValue;
    } else {
      prev[curr] = parentValue[curr];
    }
    return prev;
  }, {});
  formRef.current?.setValue(parentPath, newParentValue);
};

export const getDiffPath = (
  prevObj: any,
  newObj: any,
  path = '',
): DiffResult[] => {
  // 基础情况处理
  if (newObj === prevObj) return [];

  if (
    !prevObj ||
    !newObj ||
    typeof prevObj !== 'object' ||
    typeof newObj !== 'object'
  ) {
    if (prevObj !== newObj) {
      return [
        {
          path,
          type: DiffTypeEnum.Modified,
          oldValue: prevObj,
          newValue: newObj,
        },
      ];
    }
    return [];
  }

  // 添加数组重排序检测
  if (Array.isArray(prevObj) && Array.isArray(newObj)) {
    const isReordered =
      prevObj.length === newObj.length &&
      prevObj.every(item => newObj.some(newItem => isEqual(item, newItem))) &&
      !isEqual(prevObj, newObj);

    if (isReordered) {
      // 从后往前遍历，找到第一个不同的元素位置
      let fromIndex = prevObj.length - 1;
      while (fromIndex >= 0) {
        if (!isEqual(prevObj[fromIndex], newObj[fromIndex])) {
          break;
        }
        fromIndex--;
      }

      // 找到该元素在新数组中的位置
      const toIndex = newObj.findIndex(item =>
        isEqual(item, prevObj[fromIndex]),
      );

      return [
        {
          path: '',
          type: DiffTypeEnum.Reordered,
          oldValue: prevObj,
          newValue: newObj,
          fromIndex,
          toIndex,
        },
      ];
    }
  }

  const diffs: DiffResult[] = [];
  const allKeys = new Set([...Object.keys(prevObj), ...Object.keys(newObj)]);
  const processedKeys = new Set<string>();

  for (const key of Array.from(allKeys)) {
    if (processedKeys.has(key)) continue;

    const newPath = path ? `${path}.${key}` : key;
    const prevValue = prevObj[key];
    const newValue = newObj[key];

    if (!(key in newObj) && !processedKeys.has(key)) {
      const possibleNewKey = Object.keys(newObj).find(newKey => {
        if (processedKeys.has(newKey) || prevObj.hasOwnProperty(newKey))
          return false;

        const oldField = prevObj[key];
        const newField = newObj[newKey];

        return (
          oldField &&
          newField &&
          typeof oldField === 'object' &&
          typeof newField === 'object' &&
          'name' in oldField &&
          'name' in newField &&
          isEqual(omit(oldField, ['name']), omit(newField, ['name']))
        );
      });

      if (possibleNewKey) {
        diffs.push({
          path: key,
          type: DiffTypeEnum.Renamed,
          oldValue: prevValue,
          newValue: newObj[possibleNewKey],
        });
        processedKeys.add(key);
        processedKeys.add(possibleNewKey);
        continue;
      }
    }
    if (!(key in prevObj)) {
      diffs.push({ path: newPath, type: DiffTypeEnum.Added, newValue });
      continue;
    }
    if (!(key in newObj)) {
      diffs.push({
        path: newPath,
        type: DiffTypeEnum.Deleted,
        oldValue: prevValue,
      });
      continue;
    }

    diffs.push(...getDiffPath(prevValue, newValue, newPath));
  }

  return diffs;
};

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
  values: TValues | TValues[];
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
  values: TValues | TValues[];
  name: string;
}) {
  if (Array.isArray(values)) {
    return find(values, { name })?.name;
  }

  const [key] =
    find(entries(values), ([_, value]) => value.name === name) || [];
  return key;
}