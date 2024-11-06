import { useFormContext, useWatch } from '@shellagent/ui';
import { useFormEngineContext, TValues } from '@shellagent/form-engine';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { customSnakeCase } from '@shellagent/shared/utils';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';

import { FormRef } from '@shellagent/ui';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { get, merge, cloneDeep, isEqual } from 'lodash-es';

enum DiffTypeEnum {
  Added = 'added',
  Deleted = 'deleted',
  Modified = 'modified',
}

interface DiffResult {
  path: string;
  type: DiffTypeEnum;
  oldValue?: any;
  newValue?: any;
}

export function useFieldWatch(
  formRef: React.RefObject<FormRef>,
  params?: {
    stateId?: string;
  },
) {
  const prevValuesRef = useRef<Map<string, TValues | undefined>>(new Map());
  const appBuilder = useInjection(AppBuilderModel);

  // 替换变量key
  const replaceKey = useCallback(
    ({
      parentPath,
      oldKey,
      newKey,
      value,
    }: {
      parentPath: string;
      oldKey: string;
      newKey: string;
      value?: TValues;
    }) => {
      const parentValue = formRef.current?.getValues(parentPath);
      if (!parentValue) return;

      const newParentValue = Object.keys(parentValue).reduce(
        (prev: { [key: string]: any }, curr) => {
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
        },
        {},
      );
      formRef.current?.setValue(parentPath, newParentValue);
    },
    [],
  );

  // 获取diff路径
  const getDiffPath = (
    sourceObj: TValues,
    targetObj: TValues,
    path = '',
  ): DiffResult[] => {
    if (sourceObj === targetObj) return [];

    if (!sourceObj) {
      return [
        {
          path,
          type: DiffTypeEnum.Added,
          newValue: targetObj,
        },
      ];
    }

    if (!targetObj) {
      return [
        {
          path,
          type: DiffTypeEnum.Deleted,
          oldValue: sourceObj,
        },
      ];
    }

    if (typeof sourceObj !== typeof targetObj) {
      return [
        {
          path,
          type: DiffTypeEnum.Modified,
          oldValue: sourceObj,
          newValue: targetObj,
        },
      ];
    }

    if (typeof sourceObj !== 'object') {
      return [
        {
          path,
          type: DiffTypeEnum.Modified,
          oldValue: sourceObj,
          newValue: targetObj,
        },
      ];
    }

    const diffs: DiffResult[] = [];
    const allKeys = new Set([
      ...Object.keys(sourceObj),
      ...Object.keys(targetObj),
    ]);

    for (const key of Array.from(allKeys)) {
      const newPath = path ? `${path}.${key}` : key;

      if (!(key in sourceObj)) {
        diffs.push({
          path: newPath,
          type: DiffTypeEnum.Added,
          newValue: targetObj[key],
        });
        continue;
      }

      if (!(key in targetObj)) {
        diffs.push({
          path: newPath,
          type: DiffTypeEnum.Deleted,
          oldValue: sourceObj[key],
        });
        continue;
      }

      diffs.push(...getDiffPath(sourceObj[key], targetObj[key], newPath));
    }

    return diffs;
  };

  const handleChange = (
    newValue: TValues,
    prevValue: TValues,
    name?: string,
  ) => {
    if (!name) return;
    // 处理context
    if (name.startsWith(reservedKeySchema.Enum.context)) {
      // 从完整路径中提取context key
      const contextKey = name.replace(`${reservedKeySchema.Enum.context}.`, '');

      // 获取新旧值中对应的context对象
      const oldContext: TValues | undefined = get(prevValue, [
        'context',
        contextKey,
      ]);
      const newContext: TValues | undefined = get(newValue, [
        'context',
        contextKey,
      ]);
      if (oldContext?.name !== newContext?.name) {
        // 生成新的key
        const newKey = customSnakeCase(newContext?.name || '');
        replaceKey({
          parentPath: reservedKeySchema.Enum.context,
          oldKey: contextKey,
          newKey: newKey,
          value: newContext,
        });
      }
      // 更新ref引用
      // appBuilder.hanldeRefScene({
      //   scene: RefSceneEnum.Enum.rename_ref_opt,
      //   params: {
      //     oldPath: `${parentPath}.${oldKey}`,
      //     newPath: `${parentPath}.${newKey}`
      //   }
      // });
    } else if (name.startsWith(reservedKeySchema.Enum.inputs)) {
      console.log('inputs', name);
    } else if (name.startsWith(reservedKeySchema.Enum.outputs)) {
      console.log('outputs', name);
    } else if (name.startsWith(reservedKeySchema.Enum.blocks)) {
      console.log('blocks', name);
    } else if (name.startsWith(reservedKeySchema.Enum.render)) {
      console.log('render', name);
    }
  };

  useEffect(() => {
    if (!formRef.current) return;

    const subscription = formRef.current.watch((newValue, { name }) => {
      if (!name) return;

      const prevValue = prevValuesRef.current.get(name) || {};

      if (!isEqual(newValue, prevValue)) {
        handleChange(newValue, prevValue, name);
      }

      prevValuesRef.current.set(name, cloneDeep(newValue));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [formRef, handleChange]);
}
