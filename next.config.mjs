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
