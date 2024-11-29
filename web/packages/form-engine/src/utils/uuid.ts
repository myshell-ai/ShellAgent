import { customSnakeCase } from '@shellagent/shared/utils';

function uuid() {
  const timestamp = new Date().getTime().toString();
  const randomString = timestamp.slice(-16);

  return `key_${randomString}`;
}

function getVariableKey(
  xKey: string,
  value: Record<string, any> = {},
  newItem: Record<string, any> = {},
) {
  if (!xKey || !/{{(\w+)}}/.test(xKey)) {
    return '';
  }

  // 先替换非counter变量
  let parsedKey = xKey;
  const variables =
    xKey.match(/{{(\w+)}}/g)?.map(v => v.replace(/[{}]/g, '')) || [];
  variables.forEach(variable => {
    if (variable !== 'counter' && newItem[variable]) {
      parsedKey = parsedKey.replace(`{{${variable}}}`, newItem[variable]);
    }
  });

  // 处理counter变量
  if (parsedKey.includes('{{counter}}')) {
    // 构建前缀匹配模式
    const prefix = parsedKey.split('{{counter}}')[0];
    const pattern = customSnakeCase(prefix) + '(\\d+)';
    const regex = new RegExp(`^${pattern}$`, 'i');

    // 找到匹配前缀的最大index
    let maxCounter = 0;
    Object.keys(value).forEach(key => {
      const match = key.match(regex);
      if (match) {
        const counter = parseInt(match[1], 10);
        maxCounter = Math.max(maxCounter, counter);
      }
    });

    // 替换counter为最大值+1
    parsedKey = parsedKey.replace('{{counter}}', String(maxCounter + 1));
  }

  return customSnakeCase(parsedKey);
}

export { uuid, getVariableKey };
