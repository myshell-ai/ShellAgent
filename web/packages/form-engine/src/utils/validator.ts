import { z } from 'zod';

import { ISchema } from '../types';
import { IValidatorRules } from '../types/validator';

function genStringFormat(
  schema: z.ZodString,
  format: string,
  message?: string,
) {
  if (format === 'url') {
    return schema.url({ message });
  }
  if (format === 'email') {
    return schema.email({ message });
  }
  if (format === 'ipv6') {
    return schema.ip({ version: 'v6', message });
  }
  if (format === 'ipv4') {
    return schema.ip({ version: 'v4', message });
  }
  if (format === 'number') {
    return schema.refine(arg => /^[+-]?\d+(\.\d+)?$/.test(arg), message);
  }
  if (format === 'integer') {
    return schema.refine(arg => /^[+-]?\d+$/.test(arg), message);
  }
  if (format === 'money') {
    return schema.refine(
      arg =>
        /^([\u0024\u00A2\u00A3\u00A4\u20AC\u00A5\u20B1\u20B9\uFFE5]\s*)(\d+,?)+(\.\d+)?\s*$/.test(
          arg,
        ),
      message,
    );
  }
  if (format === 'date') {
    return schema.refine(arg => {
      const date = z.coerce.date();

      return date.safeParse(arg).success;
    }, message);
  }

  return schema;
}

function genStringValidatorRules(
  rules: IValidatorRules[],
  schema: z.ZodString,
): z.ZodString {
  return rules.reduce<z.ZodString>((prev, rule) => {
    const { message, max, min, length, maxLength, minLength, pattern } = rule;

    if (max) {
      prev = prev.max(max, { message });
    }

    if (maxLength) {
      prev = prev.max(maxLength, { message });
    }

    if (min) {
      prev = prev.min(min, { message });
    }

    if (minLength) {
      prev = prev.min(minLength, { message });
    }

    if (length) {
      prev = prev.length(length, { message });
    }

    if (pattern) {
      prev = prev.regex(pattern, { message });
    }

    return prev;
  }, schema);
}

function genNumberValidatorRules(
  rules: IValidatorRules[],
  schema: z.ZodNumber,
): z.ZodNumber {
  return rules.reduce<z.ZodNumber>((prev, rule) => {
    const {
      message,
      max,
      min,
      maximum,
      minimum,
      exclusiveMaximum,
      exclusiveMinimum,
      multipleOf,
    } = rule;

    if (max) {
      prev = prev.lt(max, { message });
    }

    if (maximum) {
      prev = prev.lt(maximum, { message });
    }

    if (exclusiveMaximum) {
      prev = prev.lte(exclusiveMaximum, { message });
    }

    if (min) {
      prev = prev.gt(min, { message });
    }

    if (minimum) {
      prev = prev.gt(minimum, { message });
    }

    if (exclusiveMinimum) {
      prev = prev.gte(exclusiveMinimum, { message });
    }

    if (multipleOf) {
      prev = prev.multipleOf(multipleOf, { message });
    }

    return prev;
  }, schema);
}

export function createValidator(schema: ISchema) {
  const { type, 'x-validator': rules = [] } = schema;
  const { required: requiredRule, message: requiredMessage } =
    rules?.find?.(item => item.required) || {};
  const { format: formatRule, message: formatMessage } =
    rules?.findLast?.(item => item.format) || {};
  const { const: constRule, message: constMessage } =
    rules?.findLast?.(item => item.const) || {};
  const { enum: enumRule, message: enumMessage } =
    rules?.findLast?.(item => item.enum) || {};
  let ret = null;

  if (type === 'string') {
    const source: z.ZodString = genStringValidatorRules(
      rules,
      z.string({ required_error: requiredMessage }),
    );

    if (formatRule) {
      ret = genStringFormat(source, formatRule, formatMessage);
    } else {
      ret = source;
    }

    if (enumRule) {
      ret = ret?.refine(data => enumRule.includes(data), {
        message: enumMessage,
      });
    }

    if (constRule) {
      ret = ret?.refine(arg => arg === constRule, constMessage);
    }

    if (requiredRule) {
      ret = ret?.refine(data => data.trim() !== '', requiredMessage);
    }
  } else if (type === 'number') {
    ret = genNumberValidatorRules(
      rules,
      z.number({ required_error: requiredMessage }),
    );

    if (enumRule) {
      ret = ret?.refine(data => enumRule.includes(data), {
        message: enumMessage,
      });
    }

    if (constRule) {
      ret = ret?.refine(arg => arg === constRule, constMessage);
    }
  }

  return ret;
}
