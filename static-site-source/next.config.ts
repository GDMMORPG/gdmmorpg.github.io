import type { NextConfig } from "next";

export const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;