export const pathJoin = (parts: string[], sep = '/') =>
  parts.join(sep).replace(new RegExp(sep + '{1,}', 'g'), sep);
