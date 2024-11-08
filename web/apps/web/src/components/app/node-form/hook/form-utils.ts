import { TValues } from '@shellagent/form-engine';
import { FormRef } from '@shellagent/ui';
import { isEqual, omit, merge } from 'lodash-es';

export enum DiffTypeEnum {
  Added = 'added',
  Deleted = 'deleted',
  Modified = 'modified',
  Renamed = 'renamed',
}

export interface DiffResult {
  path: string;
  type: DiffTypeEnum;
  oldValue?: any;
  newValue?: any;
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
  prevObj: TValues,
  newObj: TValues,
  path = '',
): DiffResult[] => {
  // 基础情况处理
  if (newObj === prevObj) return [];

  // 处理非对象类���或空值
  if (
    !prevObj ||
    !newObj ||
    typeof prevObj !== 'object' ||
    typeof newObj !== 'object'
  ) {
    if (!prevObj) {
      return [{ path, type: DiffTypeEnum.Added, newValue: newObj }];
    }
    if (!newObj) {
      return [{ path, type: DiffTypeEnum.Deleted, oldValue: prevObj }];
    }
    return [
      {
        path,
        type: DiffTypeEnum.Modified,
        oldValue: prevObj,
        newValue: newObj,
      },
    ];
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
          isEqual(omit(oldField, ['name']), omit(newField, ['name'])) &&
          newField.name === newKey
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
