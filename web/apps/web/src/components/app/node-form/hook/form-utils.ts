import { TValues } from '@shellagent/form-engine';
import { merge } from 'lodash-es';
import { FormRef } from '@shellagent/ui';

export enum DiffTypeEnum {
  Added = 'added',
  Deleted = 'deleted',
  Modified = 'modified',
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
  newObj: TValues,
  prevObj: TValues,
  path = '',
): DiffResult[] => {
  if (newObj === prevObj) return [];

  if (typeof newObj === 'string' || typeof prevObj === 'string') {
    return [
      {
        path,
        type: DiffTypeEnum.Modified,
        oldValue: newObj,
        newValue: prevObj,
      },
    ];
  }

  if (!newObj) {
    return [
      {
        path,
        type: DiffTypeEnum.Added,
        newValue: prevObj,
      },
    ];
  }

  if (!prevObj) {
    return [
      {
        path,
        type: DiffTypeEnum.Deleted,
        oldValue: newObj,
      },
    ];
  }

  if (typeof newObj !== typeof prevObj) {
    return [
      {
        path,
        type: DiffTypeEnum.Modified,
        oldValue: newObj,
        newValue: prevObj,
      },
    ];
  }

  if (typeof newObj !== 'object') {
    return [
      {
        path,
        type: DiffTypeEnum.Modified,
        oldValue: newObj,
        newValue: prevObj,
      },
    ];
  }

  const diffs: DiffResult[] = [];
  const allKeys = new Set([...Object.keys(newObj), ...Object.keys(prevObj)]);

  for (const key of Array.from(allKeys)) {
    const newPath = path ? `${path}.${key}` : key;

    if (!(key in newObj)) {
      diffs.push({
        path: newPath,
        type: DiffTypeEnum.Added,
        newValue: prevObj[key],
      });
      continue;
    }

    if (!(key in prevObj)) {
      diffs.push({
        path: newPath,
        type: DiffTypeEnum.Deleted,
        oldValue: newObj[key],
      });
      continue;
    }

    diffs.push(...getDiffPath(newObj[key], prevObj[key], newPath));
  }

  return diffs;
};
