/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      if (!config.externals) config.externals = [];
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        'mongoose',
        'mongodb',
        'bcryptjs',
      ];
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        mongodb: false,
        mongoose: false,
      };
    }
    return config;
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
    ];
  },
}

export default nextConfig
