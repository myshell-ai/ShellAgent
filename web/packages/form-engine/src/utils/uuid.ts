function uuid() {
  const timestamp = new Date().getTime().toString();
  const randomString = timestamp.slice(-16);

  return `key_${randomString}`;
}

export { uuid };
