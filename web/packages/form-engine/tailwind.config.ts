import type { Config } from 'tailwindcss';
import sharedConfig from '@shellagent/tailwind-config';

const config: Pick<Config, 'presets' | 'content'> = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
};

export default config;
