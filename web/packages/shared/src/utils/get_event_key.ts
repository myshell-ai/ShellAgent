import { Button } from '../protocol/render-button';
import { CustomEventName } from '@shellagent/pro-config';
import { customSnakeCase } from './utils';

export const getEventKey: (
  value: Button['content'],
) => CustomEventName = value => {
  return `${customSnakeCase(value)}.on_click` as CustomEventName;
};
