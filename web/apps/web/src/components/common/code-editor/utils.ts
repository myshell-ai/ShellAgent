import jsonSourceMap from 'json-source-map';
import JSON5 from 'json5';
import { JSONPath } from 'jsonpath-plus';

export function getJsonPathLine(
  jsonStr: string | undefined,
  query: string,
): number {
  if (!jsonStr) {
    return -1;
  }

  try {
    const jsonData = JSON5.parse(jsonStr);
    const sourceMap = jsonSourceMap.stringify(jsonData, null, 2);
    const result = JSONPath({ json: jsonData, path: query });

    if (result.length === 0) {
      return -1; // 若无匹配项，返回 -1
    }

    const pointer = JSONPath({
      json: jsonData,
      path: query,
      resultType: 'pointer',
    })[0];

    if (pointer in sourceMap.pointers) {
      const location = sourceMap.pointers[pointer];

      return (location.key ? location.key.line : location.value.line) + 1; // 返回位置的行号
    }
  } catch (error) {
    console.error('Get Jsonpath Line Error:', error);
  }

  return -1;
}
