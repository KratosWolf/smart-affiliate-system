/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore for production build
  },
  // typedRoutes: true, // Disabled for production build
};

module.exports = nextConfig;