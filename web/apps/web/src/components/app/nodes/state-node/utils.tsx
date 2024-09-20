import { FieldValues } from '@shellagent/ui';
import { uuid } from '@shellagent/flow-engine';
import { generateUUID } from '@/utils/common-helper';
import { produce } from 'immer';
import { IButtonType } from '@/components/app/node-form/widgets/button-editor';

export const initData = (data: FieldValues) => {
  const newData = produce(data, draft => {
    // 更新 render.buttons 下的 id 和 on_click
    if (draft?.render?.buttons) {
      draft.render.buttons = draft?.render?.buttons?.map(
        (button: IButtonType) => ({
          ...button,
          id: generateUUID(),
          on_click: {
            event: '',
            payload: {},
          },
        }),
      );
    }

    // 更新 input 和 output 中的 key
    const updateKeys = (obj: { [key: string]: FieldValues }) => {
      const keyMap: { [oldKey: string]: string } = {};

      Object.entries(obj).forEach(([key, value], index) => {
        const newKey = uuid(index);
        keyMap[key] = newKey;
        delete obj[key];
        obj[newKey] = value;
      });

      return keyMap;
    };

    const replaceKeyInData = (
      data: any,
      keyMap: { [oldKey: string]: string },
    ): any => {
      if (typeof data === 'string') {
        for (const oldKey in keyMap) {
          data = data.replace(
            new RegExp(`{{.*(${oldKey})(.*)}}`, 'g'),
            `{{${keyMap[oldKey]}}}`,
          );
        }
        return data;
      } else if (Array.isArray(data)) {
        return data.map(item => replaceKeyInData(item, keyMap));
      } else if (typeof data === 'object' && data !== null) {
        for (const k in data) {
          data[k] = replaceKeyInData(data[k], keyMap);
        }
      }
      return data;
    };

    const inputKeyMap = updateKeys(draft?.input || {});
    const outputKeyMap = updateKeys(draft?.output || {});

    const combinedKeyMap = { ...inputKeyMap, ...outputKeyMap };

    draft.input = replaceKeyInData(draft?.input || {}, combinedKeyMap);
    draft.output = replaceKeyInData(draft?.output || {}, combinedKeyMap);
    draft.render = replaceKeyInData(draft?.render || {}, combinedKeyMap);
    draft.blocks = replaceKeyInData(draft?.blocks || [], combinedKeyMap);
  });

  return newData;
};
