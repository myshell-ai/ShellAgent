import { merge, get, some, isObject } from 'lodash-es';

import { exec } from './exec';
import {
  ISchema,
  XReactions,
  TContext,
  TValues,
  TField,
  TPath,
  TFields,
} from '../types';

// 收否为嵌套数组
function isNestedArray(arr: any[]) {
  // 确保传入的确实是一个数组
  if (!Array.isArray(arr)) {
    return false;
  }

  return some(arr, item => Array.isArray(item));
}

function flat(
  schema: ISchema,
  values: TValues,
  path: TPath[] = [],
  parent: TPath[] = [],
  context: TContext,
) {
  const rets: TField[] = [];
  const value = path.length > 0 ? get(values, path.join('.')) : values;
  const newProperties: { [key: string]: ISchema } = {};
  const newItems: ISchema[] = [];

  if (schema.allOf) {
    schema = {
      ...(schema.allOf?.reduce(
        (memo, subSchema) => merge(memo, subSchema),
        schema,
      ) as ISchema),
    };
  }

  if (Array.isArray(value) && Array.isArray(schema.items)) {
    const anyOf = isObject(schema?.additionalItems)
      ? (schema?.additionalItems.properties?.anyOf as ISchema[])
      : undefined;

    if (anyOf) {
      schema.items = value.map((item: TValues) => {
        const { type } = item;
        if (type) {
          const optionSchema = (anyOf?.find(
            option => option?.properties?.type?.const === type,
          ) || item) as ISchema;
          if (typeof optionSchema?.properties?.type === 'object') {
            optionSchema.properties.type['x-raw'] = false;
          }
          return {
            ...optionSchema,
            'x-anyof': anyOf,
          };
        }
        return {
          ...anyOf?.[0],
          title: `Item`,
          properties: {
            type: {
              ...anyOf?.[0].properties?.type,
              'x-raw': false,
            },
          },
          required: ['type'],
          'x-anyof': anyOf,
        } as ISchema;
      });
    }
  }

  const {
    type,
    title,
    properties,
    additionalProperties,
    items,
    additionalItems,
  } = schema;
  let newTitle = title;

  if (title && /{{.*?}}/.test(title)) {
    newTitle = title.replace(/{{(.*?)}}/, (matched, variable) => {
      if (context[variable]) {
        return context[variable];
      }

      return matched;
    });
  }

  if (type === 'object' || type === 'void') {
    if (properties) {
      Object.keys(properties).forEach(key => {
        properties?.[key] &&
          rets.push(
            ...flat(
              properties[key],
              values,
              [...(type === 'void' ? parent : path), key],
              type === 'void' ? parent : path,
              { ...context },
            ),
          );
      });
    } else if (
      additionalProperties &&
      typeof additionalProperties === 'object' &&
      value
    ) {
      Object.keys(value).forEach($key => {
        if (typeof additionalProperties === 'object') {
          rets.push(
            ...flat(
              additionalProperties,
              values,
              [...(type === 'void' ? parent : path), $key],
              type === 'void' ? parent : path,
              { ...context, key: $key },
            ),
          );
          newProperties[$key] = additionalProperties;
        }
      });
    }
  } else if (type === 'array') {
    if (items) {
      (Array.isArray(items) ? items : [items]).forEach((item, i) => {
        rets.push(
          ...flat(item, values, [...path, String(i)], path, { ...context }),
        );
      });
    } else if (
      additionalItems &&
      typeof additionalItems === 'object' &&
      Array.isArray(value) &&
      value.length
    ) {
      value.forEach((_: any, i: number) => {
        if (typeof additionalItems === 'object') {
          rets.push(
            ...flat(additionalItems, values, [...path, String(i)], path, {
              ...context,
              currentIndex: i,
              totalLength: value.length,
            }),
          );
          newItems.push(additionalItems);
        }
      });
    }
  }

  rets.push({
    path: path.join('.'),
    parent: parent.join('.'),
    schema: {
      ...schema,
      ...(Object.keys(newProperties).length
        ? { properties: newProperties }
        : {}),
      ...(newItems.length ? { items: newItems } : {}),
      title: newTitle,
    },
    error: isNestedArray(value),
    context: {
      $this: {
        value,
      },
      ...context,
    },
  });

  return rets;
}

function execReactions(source: TFields): TFields {
  return Object.keys(source).reduce<TFields>((prev, name) => {
    const { schema, context, parent } = source[name];
    const { 'x-reactions': xReactions } = schema;

    if (xReactions) {
      const scope = parent;

      (Array.isArray(xReactions) ? xReactions : [xReactions]).forEach(
        (reaction: XReactions) => {
          const target = scope
            ? [scope, reaction.target].join('.')
            : reaction.target;
          const { when, fullfill, otherwise } = reaction;
          const stdout = exec(when, context);

          prev[target] = merge(prev[target], stdout ? fullfill : otherwise);
        },
      );
    }

    return prev;
  }, {});
}

function createFields(schema: ISchema, values: TValues): TFields {
  const dest = flat(schema, values, [], [], {}).reduce<TFields>(
    (prev, item) => {
      prev[item.path] = item;

      return prev;
    },
    {},
  );

  const source = execReactions(dest);

  return merge({}, dest, source);
}

export default createFields;
