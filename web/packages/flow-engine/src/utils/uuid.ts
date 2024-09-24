function uuid(offset: number = 0): Lowercase<string> {
  const timestamp = (new Date().getTime() + offset).toString();
  const randomString = timestamp.slice(-16);

  return `key_${randomString}` as Lowercase<string>;
}

const uuidRegex = /key_\d{13}/g;
export { uuid, uuidRegex };
