import { useEffect, useState } from 'react';
import { Text } from '@shellagent/ui';
import { debounce } from 'lodash-es';

import { IValidatorRules } from '../../types/validator';
import { TValue } from '../../types';
import { getFirstError } from '../../utils/validator';

interface P {
  value: TValue;
  rules: IValidatorRules[];
}

export default function WarningValidate({ rules, value }: P) {
  const [warning, setWarning] = useState<null | {
    message: string;
    critical?: boolean;
  }>(null);

  const getDebounceError = debounce(() => {
    getFirstError(rules, value)
      .then(resp => {
        setWarning(resp);
      })
      .catch(err => {
        setWarning({
          message: err?.message || err,
        });
      });
  }, 500);

  useEffect(() => {
    getDebounceError();
    return () => {
      getDebounceError.cancel();
    };
  }, [value]);

  return (
    <Text color={warning?.critical ? 'critical' : 'warning'}>
      {warning?.message}
    </Text>
  );
}
