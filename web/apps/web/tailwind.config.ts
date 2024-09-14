// tailwind config is required for editor support

import type { Config } from 'tailwindcss';
import sharedConfig from '@shellagent/tailwind-config';

const config: Pick<Config, 'content' | 'presets'> = {
  content: [
    './src/app/**/*.tsx',
    './src/components/**/*.tsx',
    './src/components/**/*.ts',
  ],
  presets: [sharedConfig],
};

export default config;
