import { IFlow } from '@shellagent/flow-engine';
import {
  getFirstError,
  TValue,
  IValidatorRules,
} from '@shellagent/form-engine';
import { Text } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { debounce } from 'lodash-es';
import React, { useEffect, useState } from 'react';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import {
  genAutomata,
  replaceContextByAutomata,
} from '@/stores/app/utils/data-transformer';

interface ValidateRenderProps {
  rules: IValidatorRules[];
  value: TValue;
}

function ValidateRender({ rules, value }: ValidateRenderProps) {
  const [warning, setWarning] = useState<null | {
    message: string;
    critical?: boolean;
  }>(null);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const getDebounceError = debounce(async () => {
    const reactflow = appBuilder.flowInstance?.toObject() as IFlow;
    const automata = genAutomata(reactflow, appBuilder.nodeData);
    const content = replaceContextByAutomata(value, automata);
    getFirstError(rules, content)
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

export { ValidateRender };
