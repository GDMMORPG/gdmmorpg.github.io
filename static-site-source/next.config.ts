import type { NextConfig } from "next";

export const isProd = process.env.NODE_ENV === 'production';
const repoName = 'docs'; // GitHub repository name

// Support custom base path for preview builds
const customBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const defaultBasePath = isProd ? `/${repoName}` : '';
const basePath = customBasePath || defaultBasePath;

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;