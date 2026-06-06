import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    typedRoutes: true
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'makriva.com' }],
        destination: 'https://www.makriva.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
