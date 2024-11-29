/** @type {import('next').NextConfig} */

const { copyFileSync } = require('fs');
const path = require('path');

module.exports = {
  output: 'export',
  distDir: 'dist',
  reactStrictMode: false,
  transpilePackages: [
    '@shellagent/ui',
    '@shellagent/flow-engine',
    '@shellagent/form-engine',
  ],
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    const srcFile = path.join(
      __dirname,
      'node_modules/image-canvas/public/fabric.js',
    );
    const destFile = path.join(__dirname, 'public/fabric.js');
    copyFileSync(srcFile, destFile);
    console.log('copied fabric.js');

    // Important: return the modified config
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/styles/md-viewer.scss': false,
      '@/common/assets/audio-playing.json': false,
      '@/components/rewards-center/reward-redemption/components/redemption-success-modal/assets/images/reward-success-bg.png': false,
      '@/common/assets/images/workshop/BotDetailBg.png': false,
      langium: false,
    };
    config.resolve.fallback = {
      ...config.resolve?.fallback,
      zlib: false,
    };
    config.optimization = {
      minimize: false,
    };
    config.plugins.push(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    );
    return config;
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: '/models_searcher/:path*',
        destination: `${
          process.env.NEXT_PUBLIC_MODELS_SEARCHER ||
          'https://shellagent.myshell.ai/models_searcher'
        }/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/app',
        permanent: true,
      },
    ];
  },
};
