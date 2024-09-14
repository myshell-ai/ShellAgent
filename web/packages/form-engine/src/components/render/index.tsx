import React from 'react';

import { useFormEngineContext } from '../provider';

interface IRenderProps {
  name: string;
}

const Render: React.FC<IRenderProps> = props => {
  const { name } = props;
  const { fields, components } = useFormEngineContext();
  const { schema } = fields[name] || {};
  const { 'x-component': xComponent } = schema;

  if (!(xComponent && components[xComponent])) {
    return null;
  }

  return React.createElement(components[xComponent]);
};

export default React.memo(Render, () => true);
