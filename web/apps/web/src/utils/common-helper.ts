import { TValues } from '@shellagent/form-engine';
import {
  every,
  isEmpty,
  isNaN,
  isArray,
  isObject,
  map,
  reduce,
} from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';

export function secondsConverter(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${(minutes < 10 && minutes > 0 ? '0' : '') + minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export function durationFormatter(seconds: number): string {
  if (isNaN(seconds) || seconds === Infinity) {
    return '';
  }

  return secondsConverter(Math.floor(seconds));
}

export function generateUUID() {
  return uuidv4();
}

export function deleteKey(obj: any, key: string): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deleteKey(item, key));
  }

  return Object.keys(obj).reduce((newObj, prop) => {
    if (prop !== key) {
      newObj[prop] = deleteKey(obj[prop], key);
    }
    return newObj;
  }, {} as any);
}

export function isDeepEmpty(obj: any): boolean {
  if (isArray(obj)) {
    return every(obj, isDeepEmpty);
  }
  if (isObject(obj)) {
    return every(obj, value => isDeepEmpty(value));
  }
  return isEmpty(obj);
}

export const removeNulls = (obj: object): object => {
  if (isArray(obj)) {
    return map(obj, removeNulls);
  }
  if (isObject(obj)) {
    return reduce(
      obj,
      (result: any, value, key) => {
        if (value !== null) {
          result[key] = removeNulls(value);
        }
        return result;
      },
      {},
    );
  }
  return obj;
};

export function findDiffKeys(obj1: TValues, obj2: TValues): string[] {
  const diffKeys: string[] = [];

  function compareObjects(obj1: TValues, obj2: TValues, path: string[] = []) {
    Object.keys(obj1).forEach(key => {
      const newPath = [...path, key];
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        diffKeys.push(newPath.join('.'));
      } else {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (typeof value1 === 'object' && typeof value2 === 'object') {
          compareObjects(value1, value2, newPath);
        } else if (value1 !== value2) {
          diffKeys.push(newPath.join('.'));
        }
      }
    });
  }

  compareObjects(obj1, obj2);
  return diffKeys;
}

export const isMac = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return navigator.userAgent.toUpperCase().includes('MAC');
};

const specialKeysNameMap: Record<string, string | undefined> = {
  ctrl: '⌘',
  alt: '⌥',
};

export const getKeyboardKeyNameBySystem = (key: string) => {
  if (isMac()) return specialKeysNameMap[key] || key;

  return key;
};

const specialKeysCodeMap: Record<string, string | undefined> = {
  ctrl: 'meta',
};

export const getKeyboardKeyCodeBySystem = (key: string) => {
  if (isMac()) return specialKeysCodeMap[key] || key;

  return key;
};

export const isEventTargetInputArea = (target: HTMLElement) => {
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return true;

  if (target.contentEditable === 'true') return true;
  return false;
};
