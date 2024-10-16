import { uuid, uuidRegex } from '@shellagent/flow-engine';
import { FieldValues } from '@shellagent/ui';
import { produce } from 'immer';

import { IButtonType } from '@/components/app/node-form/widgets/button-editor';
import {
  IWorkflowTask,
  IWidgetTask,
} from '@/components/app/node-form/widgets/tasks-config';
import { generateUUID } from '@/utils/common-helper';

// 生成uuid的偏移量
let offset = 0;

// 更新 input 和 output 中的 key
const updateKeys = (obj: { [key: string]: FieldValues }) => {
  const keyMap: { [oldKey: string]: string } = {};
  const newObj: { [key: string]: FieldValues } = {};

  Object.entries(obj).forEach(([key, value]) => {
    offset += 1;
    const newKey = uuid(offset);
    keyMap[key] = newKey;
    newObj[newKey] = value;
  });

  // 返回新的对象和 keyMap
  return { keyMap, newObj };
};

const replaceKeyInData = (
  data: any,
  keyMap: { [oldKey: string]: string },
): any => {
  if (typeof data === 'string') {
    data = data.replace(uuidRegex, match => {
      return keyMap[match] || match;
    });
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item: any) => replaceKeyInData(item, keyMap));
  }
  if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(k => {
      data[k] = replaceKeyInData(data[k], keyMap);
    });
  }
  return data;
};

export const initData = (data: FieldValues) => {
  const newData = produce(data, draft => {
    // 更新 render.buttons 下的 id 和 on_click
    if (draft?.render?.buttons) {
      draft.render.buttons = draft?.render?.buttons?.map(
        (button: IButtonType) => {
          const { keyMap: payloadMap, newObj: newPayload } = updateKeys(
            (button?.on_click as any)?.payload || {},
          );
          const id = generateUUID() as Lowercase<string>;
          return {
            ...button,
            id,
            on_click: {
              event: id,
              payload: replaceKeyInData(newPayload, payloadMap),
            },
          };
        },
      );
    }

    // 更新 blocks 中的 name 并生成 keyMap
    const blockKeyMap: { [oldKey: string]: string } = {};
    if (draft?.blocks) {
      draft.blocks = draft.blocks?.map((block: IWorkflowTask | IWidgetTask) => {
        offset += 1;
        const newName = uuid(offset);
        blockKeyMap[block?.name] = newName;
        return {
          ...block,
          name: newName,
        };
      });
    }

    const { keyMap: inputKeyMap, newObj: newInput } = updateKeys(
      draft?.inputs || {},
    );
    const { keyMap: outputKeyMap, newObj: newOutput } = updateKeys(
      draft?.outputs || {},
    );
    const combinedKeyMap = { ...inputKeyMap, ...outputKeyMap, ...blockKeyMap };

    draft.inputs = replaceKeyInData(newInput, combinedKeyMap);
    draft.outputs = replaceKeyInData(newOutput, combinedKeyMap);
    draft.render = replaceKeyInData(draft?.render || {}, combinedKeyMap);
    draft.blocks = draft.blocks?.map((block: IWorkflowTask | IWidgetTask) =>
      replaceKeyInData(block, combinedKeyMap),
    );
  });

  return newData;
};
