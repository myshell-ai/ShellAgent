// import emoji from 'emojilib';
// import { pinyin } from 'pinyin-pro';
// import emojiRegex from 'emoji-regex'; // 导入 emoji-regex 库

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
  return key.replace(/[^a-zA-Z0-9_ ]/g, '');
};

export function customSnakeCase(s: string) {
  if (!s) return s;
  s = removeBrackets(s);
  s = s.trim();
  const r = s.split(/(?<![A-Z])(?=[A-Z])|\#|\s+/);
  return r.map(i => i.toLowerCase()).join('_');
}
