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
  const [warning, setWarning] = useState<null | string>(null);

  const getDebounceError = debounce(() => {
    getFirstError(rules, value)
      .then(resp => {
        setWarning(resp);
      })
      .catch(err => {
        setWarning(err?.message || err);
      });
  }, 500);

  useEffect(() => {
    getDebounceError();
    return () => {
      getDebounceError.cancel();
    };
  }, [value]);

  return <Text color="warning">{warning}</Text>;
}
