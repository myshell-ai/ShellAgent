import type { Config } from 'tailwindcss';
import sharedConfig from '@shellagent/tailwind-config';

const config: Config = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
};

export default config;
