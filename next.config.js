/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // firebase-admin など Node.js 専用パッケージはサーバーバンドルに含めず外部解決させる
  // これで「Critical dependency: the request of a dependency is an expression」の警告が消える
  serverExternalPackages: ['firebase-admin'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // firebase-admin の依存解析エラーを抑制
      config.ignoreWarnings = [
        ...(config.ignoreWarnings ?? []),
        { module: /node_modules\/@grpc\/grpc-js/ },
        { module: /node_modules\/@opentelemetry/ },
        { module: /node_modules\/firebase-admin/ },
        { message: /Critical dependency: the request of a dependency is an expression/ },
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
