import { useFormContext, useWatch } from '@shellagent/ui';
import { useFormEngineContext, TValues } from '@shellagent/form-engine';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { customSnakeCase } from '@shellagent/shared/utils';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';

import { FormRef } from '@shellagent/ui';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { get, merge, cloneDeep, isEqual, debounce } from 'lodash-es';

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

      // 使用数组保存所有的键，以维持顺序
      const keys = Object.keys(parentValue);
      const newParentValue = keys.reduce(
        (prev: { [key: string]: any }, curr) => {
          if (curr === oldKey) {
            const oldValue = parentValue[curr];
            // 使用新的key，但保持在相同位置
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

  // 处理 inputs 变化的函数
  const handleInputsChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, inputsKey: string) => {
      const oldInputs = get(prevValue, ['inputs', inputsKey]);
      const newInputs = get(newValue, ['inputs', inputsKey]);

      if (oldInputs?.name && newInputs?.name) {
        if (oldInputs?.name !== newInputs?.name) {
          console.log('inputs', oldInputs, newInputs);
          replaceKey({
            parentPath: reservedKeySchema.Enum.inputs,
            oldKey: inputsKey,
            newKey: customSnakeCase(newInputs?.name || ''),
            value: newInputs,
          });
        }
      }
    }, 300),
    [replaceKey],
  );

  // 处理 context 变化的函数
  const handleContextChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, contextKey: string) => {
      const oldContext: TValues | undefined = get(prevValue, [
        'context',
        contextKey,
      ]);
      const newContext: TValues | undefined = get(newValue, [
        'context',
        contextKey,
      ]);

      if (oldContext?.name !== newContext?.name) {
        const newKey = customSnakeCase(newContext?.name || '');
        replaceKey({
          parentPath: reservedKeySchema.Enum.context,
          oldKey: contextKey,
          newKey: newKey,
          value: newContext,
        });
      }
    }, 300),
    [replaceKey],
  );

  // 处理 outputs 变化的函数
  const handleOutputsChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, outputsKey: string) => {
      const oldOutputs = get(prevValue, ['outputs', outputsKey]);
      const newOutputs = get(newValue, ['outputs', outputsKey]);

      if (oldOutputs?.name && newOutputs?.name) {
        if (oldOutputs?.name !== newOutputs?.name) {
          replaceKey({
            parentPath: reservedKeySchema.Enum.outputs,
            oldKey: outputsKey,
            newKey: customSnakeCase(newOutputs?.name || ''),
            value: newOutputs,
          });
        }
      }
    }, 300),
    [replaceKey],
  );

  // 处理 blocks 变化的函数
  const handleBlocksChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, blocksKey: string) => {
      const oldBlocks = get(prevValue, ['blocks', blocksKey]);
      const newBlocks = get(newValue, ['blocks', blocksKey]);

      if (oldBlocks?.name && newBlocks?.name) {
        if (oldBlocks?.name !== newBlocks?.name) {
          replaceKey({
            parentPath: reservedKeySchema.Enum.blocks,
            oldKey: blocksKey,
            newKey: customSnakeCase(newBlocks?.name || ''),
            value: newBlocks,
          });
        }
      }
    }, 300),
    [replaceKey],
  );

  // 处理 render 变化的函数
  const handleRenderChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, renderKey: string) => {
      const oldRender = get(prevValue, ['render', renderKey]);
      const newRender = get(newValue, ['render', renderKey]);

      if (oldRender?.name && newRender?.name) {
        if (oldRender?.name !== newRender?.name) {
          replaceKey({
            parentPath: reservedKeySchema.Enum.render,
            oldKey: renderKey,
            newKey: customSnakeCase(newRender?.name || ''),
            value: newRender,
          });
        }
      }
    }, 300),
    [replaceKey],
  );

  const handleChange = (
    newValue: TValues,
    prevValue: TValues,
    name?: string,
  ) => {
    if (!name) return;

    if (name.startsWith(reservedKeySchema.Enum.context)) {
      const contextKey = name.replace(`${reservedKeySchema.Enum.context}.`, '');
      handleContextChange(newValue, prevValue, contextKey);
    } else if (name.startsWith(reservedKeySchema.Enum.inputs)) {
      const inputsKey = name.split('.')[1];
      handleInputsChange(newValue, prevValue, inputsKey);
    } else if (name.startsWith(reservedKeySchema.Enum.outputs)) {
      const outputsKey = name.split('.')[1];
      handleOutputsChange(newValue, prevValue, outputsKey);
    } else if (name.startsWith(reservedKeySchema.Enum.blocks)) {
      const blocksKey = name.split('.')[1];
      handleBlocksChange(newValue, prevValue, blocksKey);
    } else if (name.startsWith(reservedKeySchema.Enum.render)) {
      const renderKey = name.split('.')[1];
      handleRenderChange(newValue, prevValue, renderKey);
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
