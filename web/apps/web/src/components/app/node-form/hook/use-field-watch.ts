import { useFormContext, useWatch } from '@shellagent/ui';
import { useFormEngineContext, TValues } from '@shellagent/form-engine';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { customSnakeCase } from '@shellagent/shared/utils';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';

import { FormRef } from '@shellagent/ui';
import { useEffect, useRef, useCallback } from 'react';
import { get, merge } from 'lodash-es';

export function useFieldWatch(
  formRef: React.RefObject<FormRef>,
  params?: {
    stateId?: string;
  },
) {
  const prevValuesRef = useRef<Map<string, TValues | undefined>>(new Map());
  const appBuilder = useInjection(AppBuilderModel);

  // 替换key
  const replaceKey = (
    parentPath: string,
    oldKey: string,
    newKey: string,
    value?: TValues,
  ) => {
    let parentValue = formRef.current?.getValues(parentPath);
    // 避免影响对象顺序
    parentValue = Object.keys(parentValue).reduce(
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
    formRef.current?.setValue(parentPath, parentValue);
  };

  const handleChange = useCallback(
    (newValue: TValues, prevValue?: TValues, name?: string) => {
      if (!name) return;

      // 处理context
      if (name.startsWith(reservedKeySchema.Enum.context)) {
        // 从完整路径中提取context key
        const contextKey = name.replace(
          `${reservedKeySchema.Enum.context}.`,
          '',
        );

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
          replaceKey(reservedKeySchema.Enum.context, contextKey, newKey);
        } else {
        }
      } else if (name.startsWith(reservedKeySchema.Enum.inputs)) {
      } else if (name.startsWith(reservedKeySchema.Enum.outputs)) {
      } else if (name.startsWith(reservedKeySchema.Enum.blocks)) {
      }
    },
    [],
  );

  useEffect(() => {
    if (!formRef.current) return;

    const subscription = formRef.current.watch((newValue, { name }) => {
      if (!name) return;

      const prevValue = prevValuesRef.current.get(name);

      handleChange(newValue, prevValue, name);

      prevValuesRef.current.set(name, structuredClone(newValue));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [formRef, handleChange]);
}
