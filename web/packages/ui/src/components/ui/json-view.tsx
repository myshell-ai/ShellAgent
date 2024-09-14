import React from 'react';
import { lazy, Suspense } from 'react';
import { ReactJsonViewProps } from 'react-json-view';
// 避免ssr
const ReactJson = lazy(() => import('react-json-view'));

export interface JSONViewProps extends Omit<ReactJsonViewProps, 'src'> {
  defaultValue: object;
}

const JSONView = ({ defaultValue }: JSONViewProps) => {
  return (
    <Suspense fallback={'loading...'}>
      <ReactJson
        src={defaultValue}
        name={false}
        enableClipboard={false}
        displayDataTypes={false}
        displayObjectSize={false}
      />
    </Suspense>
  );
};

export { JSONView };
