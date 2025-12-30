import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    // SVG loader
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'], // SVG'yi React component olarak import et
    });

    return config;
  },
};

export default nextConfig;
