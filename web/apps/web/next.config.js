/** @type {import('next').NextConfig} */
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
    // Important: return the modified config
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/styles/md-viewer.scss': false,
      '@/common/assets/audio-playing.json': false,
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
