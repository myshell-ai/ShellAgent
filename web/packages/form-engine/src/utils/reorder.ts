const reorder = (value: any, start: number, end: number) => {
  if (value instanceof Array) {
    const result = Array.from(value);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result;
  }
  if (value instanceof Object) {
    const result = Object.keys(value);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result.reduce((prev: { [key: string]: any }, key: string) => {
      prev[key] = value[key];
      return prev;
    }, {});
  }
  return value;
};

export { reorder };
