import {
  getFirstError,
  TValue,
  IValidatorRules,
} from '@shellagent/form-engine';
import { IFlow } from '@shellagent/flow-engine';
import { Text } from '@shellagent/ui';
import { debounce } from 'lodash-es';
import { useInjection } from 'inversify-react';
import React, { useEffect, useState } from 'react';

import {
  contextTempReg,
  genAutomata,
  replaceContextByAutomata,
} from '@/stores/app/utils/data-transformer';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';

interface ValidateRenderProps {
  rules: IValidatorRules[];
  value: TValue;
}

function ValidateRender({ rules, value }: ValidateRenderProps) {
  const [warning, setWarning] = useState<null | string>(null);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const getDebounceError = debounce(() => {
    const reactflow = appBuilder.flowInstance?.toObject() as IFlow;
    const automata = genAutomata(reactflow, appBuilder.nodeData);
    const content = replaceContextByAutomata(value, automata);
    getFirstError(rules, content)
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

export { ValidateRender };
