export const VAR_REGEX =
  /\{\{(#[a-zA-Z0-9_-]{1,50}(\.[a-zA-Z_][a-zA-Z0-9_]{0,29}){1,10}#)\}\}/gi;

export const VAR_REGEX_STRING = /^\{\{(.*)\}\}$/;

export const VAR_MARKUP_REGEX = /@\[([^\]]+)\]\(value:([^)]+)\)/;
