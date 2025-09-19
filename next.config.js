/** @type {import('next').NextConfig} */
const nextConfig = {
  // The subdomain routing is now handled by middleware
  // This ensures better control and error handling

  // Temporarily disable minification to debug React error #310
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Disable minification in production temporarily
      config.optimization.minimize = false;
    }
    return config;
  },
};

module.exports = nextConfig;