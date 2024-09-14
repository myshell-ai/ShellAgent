const colorList = [
  'var(--flow-color-02)',
  'var(--flow-color-03)',
  'var(--flow-color-04)',
  'var(--flow-color-05)',
  'var(--flow-color-06)',
  'var(--flow-color-07)',
  'var(--flow-color-08)',
  'var(--flow-color-09)',
  'var(--flow-color-10)',
];

const typeColorMap: Record<string, string> = {
  '': 'var(--flow-color-01)',
  unknown: 'var(--flow-color-01)',
  string: 'var(--flow-color-01)',
  integer: 'var(--flow-color-01)',
  number: 'var(--flow-color-01)',
  boolean: 'var(--flow-color-01)',
};

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) % 0x7fffffff;
  }
  return hash;
}

function getColor(type: string) {
  if (!Object.prototype.hasOwnProperty.call(typeColorMap, type)) {
    const hash = hashString(type);
    const colorIndex = hash % colorList.length;
    return colorList[colorIndex];
  }
  return typeColorMap[type];
}

export { getColor };
