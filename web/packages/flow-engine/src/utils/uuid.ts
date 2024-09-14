function uuid(): Lowercase<string> {
  const timestamp = new Date().getTime().toString();
  const randomString = timestamp.slice(-16);

  return `key_${randomString}` as Lowercase<string>;
}

export { uuid };
