import { useFormContext } from '@shellagent/ui';
import { omit, set, merge } from 'lodash-es';
import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  SchemaReactComponents,
  TFields,
  TPath,
  TValues,
  TValue,
  TFieldMode,
} from '../../types';
import { getDefaultValueBySchema } from '../../utils/generate-schema';
import { reorder as order } from '../../utils/reorder';
import { uuid } from '../../utils/uuid';
import { customSnakeCase } from '@shellagent/shared/utils';

const FormEngineContext = createContext<{
  components: SchemaReactComponents;
  fields: TFields;
  parent?: string;
  layout?: 'Horizontal' | 'Vertical';
  remove: (paht: TPath) => void;
  append: (path: TPath, key?: string, obj?: TValues) => void;
  replaceKey: (path: TPath, key: string, value?: TValue) => void;
  reorder: (path: TPath, startIndex: number, endIndex: number) => void;
  modeMap?: Record<string, TFieldMode>;
  onModeChange?: (name: string, mode: TFieldMode) => void;
  onStatusChange?: (obj: { [key: string]: string }) => void;
}>({
  components: {},
  fields: {},
  remove: () => {},
  append: () => {},
  reorder: () => {},
  replaceKey: () => {},
});

export interface IFormEngineProviderProps {
  fields: TFields;
  components: SchemaReactComponents;
  parent?: string;
  layout?: 'Horizontal' | 'Vertical';
  modeMap?: Record<string, TFieldMode>;
  onModeChange?: (name: string, mode: TFieldMode) => void;
  onStatusChange?: (obj: { [key: string]: string }) => void;
  children: React.ReactNode | React.ReactNode[];
}

export const useFormEngineContext = () => {
  return useContext(FormEngineContext);
};

export const FormEngineProvider: React.FC<IFormEngineProviderProps> = props => {
  const { children, fields, components, parent, layout, onStatusChange } =
    props;
  const { getValues, setValue } = useFormContext();
  const counterRef = useRef<{ [path: string]: number }>({});

  // TODO计数器的初始化
  // useEffect(() => {
  //   if (parent) {
  //     const parentValue = getValues(parent);
  //     if (parentValue && typeof parentValue === 'object') {
  //       counterRef.current[parent] = Object.keys(parentValue).length;
  //     }
  //   }
  // }, [parent]);

  const [modeMap, setModeMap] = useState(props.modeMap || {});

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setModeMap(prevModeMap => ({
        ...prevModeMap,
        [name]: mode,
      }));
      props.onModeChange?.(name, mode);
    },
    [props.onModeChange],
  );

  const remove = (path: TPath) => {
    const { parent: parentName } = fields[path] || {};
    const parentValue = getValues(parentName);

    if (Array.isArray(parentValue)) {
      const idx = Number(path.replace(`${parentName}.`, ''));

      if (!isNaN(idx)) {
        setValue(
          parentName,
          parentValue.filter((_, i) => i !== idx),
        );
      }
    } else {
      const key = path.replace(`${parentName}.`, '');
      setValue(parentName, omit(parentValue, [key]));
    }
  };

  const append = (path: TPath, key?: string, obj?: TValues) => {
    const value = getValues(path);
    const { schema } = fields[path];
    const { additionalProperties, additionalItems } = schema;

    if (additionalItems && typeof additionalItems === 'object') {
      let { anyOf, ...newItem } =
        obj || getDefaultValueBySchema(additionalItems);
      if (anyOf !== undefined) {
        newItem = {
          ...newItem,
          type: '',
        };
      }
      if (additionalItems.type === 'string') {
        setValue(path, [
          ...(Array.isArray(value) ? value : []),
          additionalItems.default || '',
        ]);
      } else {
        setValue(path, [...(Array.isArray(value) ? value : []), newItem]);
      }
    } else if (
      additionalProperties &&
      typeof additionalProperties === 'object'
    ) {
      const { 'x-key': xKey } = additionalProperties;
      const newItem: TValues =
        obj || getDefaultValueBySchema(additionalProperties);
      let newKey;

      if (key) {
        newKey = key;
      } else if (xKey && /{{(\w+)}}/.test(xKey)) {
        const variables =
          xKey.match(/{{(\w+)}}/g)?.map(v => v.replace(/[{}]/g, '')) || [];
        let parsedKey = xKey;

        if (Array.isArray(variables) && variables.indexOf('counter') !== -1) {
          if (isNaN(counterRef.current[path])) {
            counterRef.current[path] = 1;
          } else {
            counterRef.current[path]++;
          }
          parsedKey = parsedKey.replace(
            '{{counter}}',
            String(counterRef.current[path]),
          );
        }

        variables.forEach(variable => {
          if (variable !== 'counter' && newItem[variable]) {
            const newValue = newItem[variable];
            parsedKey = parsedKey.replace(`{{${variable}}}`, newValue);
          }
        });

        newKey = customSnakeCase(parsedKey);
      } else {
        newKey = uuid();
      }

      setValue(path, set(value || {}, newKey, newItem));
    }
  };

  const replaceKey = (path: TPath, key: string, value?: TValue) => {
    const { parent: parentName } = fields[path] || {};
    let parentValue = getValues(parentName);
    const oldKey = path.replace(`${parentName}.`, '');
    const newKey = key;
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
    setValue(parentName, parentValue);
  };

  const reorder = (path: TPath, startIndex: number, endIndex: number) => {
    const { parent: parentName } = fields[path] || {};
    const parentValue = getValues(parentName);
    const newValue = order(parentValue, startIndex, endIndex);
    setValue(parentName, newValue);
  };

  return (
    <FormEngineContext.Provider
      value={{
        components,
        fields,
        parent,
        layout,
        remove,
        append,
        replaceKey,
        reorder,
        modeMap,
        onModeChange,
        onStatusChange,
      }}>
      {children}
    </FormEngineContext.Provider>
  );
};
