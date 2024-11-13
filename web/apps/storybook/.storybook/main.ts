import type { StorybookConfig } from '@storybook/nextjs';

import { dirname, join } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
  staticDirs: ['../public', join(getAbsolutePath('image-canvas'), 'public')],
  webpackFinal: async (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      // Modify config for development
    }
    if (configType === 'PRODUCTION') {
      // Modify config for production
    }
    config!.module!.rules!.push({
      test: /\.less$/i,
      include: getAbsolutePath('react-colors-beauty'),
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: { implementation: require.resolve('less') },
        },
      ],
    });

    config!.resolve!.alias = {
      ...config!.resolve!.alias,
      '@/styles/md-viewer.scss': false,
      '@/common/assets/audio-playing.json': false,
      '@/components/rewards-center/reward-redemption/components/redemption-success-modal/assets/images/reward-success-bg.png':
        false,
      '@/common/assets/images/workshop/BotDetailBg.png': false,
    };
    return config;
  },
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
        legacyDecorator: true,
      },
      parser: {
        syntax: 'typescript',
        decorators: true,
      },
    },
  }),
};
export default config;
