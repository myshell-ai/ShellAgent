import emoji from 'emojilib';
import { pinyin } from 'pinyin-pro';
import emojiRegex from 'emoji-regex'; // 导入 emoji-regex 库

function emojiUnicode(emoji: string) {
  var comp;
  if (emoji.length === 1) {
    comp = emoji.charCodeAt(0);
  }
  comp =
    (emoji.charCodeAt(0) - 0xd800) * 0x400 +
    (emoji.charCodeAt(1) - 0xdc00) +
    0x10000;
  if (comp < 0) {
    comp = emoji.charCodeAt(0);
  }
  return comp.toString(16);
}

export const removeBrackets = (key: string): string => {
  return key.replace(/\{\{\s*(.*?)\s*\}\}/g, '$1');
};

export function customSnakeCase(s: string) {
  if (!s) return s;
  const chineseRegex = /[\u4e00-\u9fa5]+/g;

  s = s
    .replace(/([\u4e00-\u9fa5])([^ \u4e00-\u9fa5])/g, '$1 $2')
    .replace(/([^ \u4e00-\u9fa5])([\u4e00-\u9fa5])/g, '$1 $2');

  s = s.replace(emojiRegex(), match => {
    if (emoji[match]?.[0]) {
      return ` ${emoji[match][0]} `;
    } else {
      return ` ${emojiUnicode(match)} `;
      // return ` ${slug(match)} `
    }
  });

  s = s.replace(chineseRegex, match => {
    return pinyin(match, { toneType: 'none' });
  });
  s = s.trim();
  const str = removeBrackets(s);
  const r = str.split(/(?<![A-Z])(?=[A-Z])|\#|\s+/);
  return r.map(i => i.toLowerCase()).join('_');
}
