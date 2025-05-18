/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
  // 配置静态资源目录
  output: 'standalone',
  outputFileTracing: true,
  // 允许处理大文件上传
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

module.exports = nextConfig;
