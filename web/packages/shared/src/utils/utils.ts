// export function customSnakeCase(s: string) {
//   if (typeof s !== 'string') return s;

//   // 如果已经是snake_case格式（只包含小写字母、数字和下划线），直接返回
//   if (/^[a-z0-9_]+$/.test(s)) {
//     return s;
//   }

//   // 更新正则表达式以包含数字
//   const parts = s.split(/([a-zA-Z0-9\s#]+)/);

//   return parts
//     .map(part => {
//       if (!part) return '';

//       if (/[a-zA-Z0-9\s#]/.test(part)) {
//         const withoutHash = part.replace(/#/g, '_');
//         const r = withoutHash.split(/(?<![A-Z])(?=[A-Z])|\s+/);
//         return r.map(i => i.toLowerCase()).join('_');
//       }

//       return Array.from(part)
//         .map(char => char.codePointAt(0)?.toString(16))
//         .join('_');
//     })
//     .filter(Boolean)
//     .join('_');
// }

export const removeBrackets = (key: string): string => {
  return key.replace(/\{\{\s*(.*?)\s*\}\}/g, '$1');
};

export function customSnakeCase(s: string) {
  if (!s) return s;
  const str = removeBrackets(s);
  const r = str.split(/(?<![A-Z])(?=[A-Z])|\#|\s+/);
  return r.map(i => i.toLowerCase()).join('_');
}
