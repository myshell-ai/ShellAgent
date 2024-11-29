import { z } from 'zod';

export const reservedStateName = {
  start: '@@@start',
  end: '@@@end',
} as const;

export const reservedStateNameSchema = z.nativeEnum(reservedStateName);
