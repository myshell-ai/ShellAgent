import { IFlow } from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import { Automata } from '@shellagent/pro-config';
import { Refs } from '@shellagent/shared/protocol/app-scope';

import { Metadata } from '@/services/home/type';

export type Config = {
  fieldsModeMap: Record<string, Record<string, TFieldMode>>;
  refs: Refs;
};

export type ShellAgent = {
  reactflow: IFlow;
  config: Config;
  metadata: Metadata;
  automata: Automata;
};

export type { Metadata };

export type NodeDataType = Record<string, TValues>;
