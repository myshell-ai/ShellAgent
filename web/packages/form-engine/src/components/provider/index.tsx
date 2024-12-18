import { useFormContext } from '@shellagent/ui';
import { omit, set, merge } from 'lodash-es';
import React, { createContext, useContext } from 'react';

import {
  SchemaReactComponents,
  TFields,
  TPath,
  TValues,
  TValue,
} from '../../types';
import { getDefaultValueBySchema } from '../../utils/generate-schema';
import { reorder as order } from '../../utils/reorder';
import { uuid, getVariableKey } from '../../utils/uuid';

const FormEngineContext = createContext<{
  components: SchemaReactComponents;
  fields: TFields;
  parent?: string;
  layout?: 'Horizontal' | 'Vertical';
  remove: (paht: TPath) => void;
  append: (path: TPath, key?: string, obj?: TValues) => void;
  replaceKey: (path: TPath, key: string, value?: TValue) => void;
  reorder: (path: TPath, startIndex: number, endIndex: number) => void;
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
      } else if (xKey) {
        newKey = getVariableKey(xKey, value, newItem);
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
        onStatusChange,
      }}>
      {children}
    </FormEngineContext.Provider>
  );
};
