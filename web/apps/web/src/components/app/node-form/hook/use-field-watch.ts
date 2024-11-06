import { useFormContext, useWatch } from '@shellagent/ui';
import { useFormEngineContext, TValues } from '@shellagent/form-engine';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { customSnakeCase } from '@shellagent/shared/utils';

import { FormRef } from '@shellagent/ui';
import { useEffect, useRef, useCallback } from 'react';
import { get, values } from 'lodash-es';

enum ChangeType {
  ReplaceKey = 'replaceKey',
  AddKey = 'addKey',
}

export function useFieldWatch(
  formRef: React.RefObject<FormRef>,
  params?: {
    stateId?: string;
  },
) {
  const prevValuesRef = useRef<Map<string, TValues | undefined>>(new Map());

  const handleChange = useCallback(
    (newValue: TValues, prevValue?: TValues, name?: string) => {
      if (!name) return;

      // 处理context
      if (name.startsWith(reservedKeySchema.Enum.context)) {
        // 从完整路径中提取context key
        const contextKey = name.split('.')[1];

        // 获取新旧值中对应的context对象
        const oldContext = get(prevValue, ['context', contextKey]);
        const newContext = get(newValue, ['context', contextKey]);

        // 比较name是否发生变化
        // 修改name
        if (oldContext?.name !== newContext?.name) {
          // 生成新的key
          const newKey = customSnakeCase(newContext.name || '');
          console.log('>>>>', contextKey, newKey);
          // replaceKey(name, newKey);
        } else {
        }
      } else if (name.startsWith(reservedKeySchema.Enum.inputs)) {
      } else if (name.startsWith(reservedKeySchema.Enum.outputs)) {
      } else if (name.startsWith(reservedKeySchema.Enum.blocks)) {
      }
    },
    [],
  );

  // const replaceKey = (path: TPath, key: string, value?: TValue) => {
  //   const { parent: parentName } = fields[path] || {};
  //   let parentValue = getValues(parentName);
  //   const oldKey = path.replace(`${parentName}.`, '');
  //   const newKey = key;
  //   // 避免影响对象顺序
  //   parentValue = Object.keys(parentValue).reduce(
  //     (prev: { [key: string]: any }, curr) => {
  //       if (curr === oldKey) {
  //         const oldValue = parentValue[curr];
  //         prev[newKey] =
  //           typeof oldValue === 'object' && value
  //             ? merge(oldValue, value)
  //             : value || oldValue;
  //       } else {
  //         prev[curr] = parentValue[curr];
  //       }
  //       return prev;
  //     },
  //     {},
  //   );
  //   setValue(parentName, parentValue);
  // };

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
