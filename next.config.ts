import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/MY_Portfolio',
  assetPrefix: '/MY_Portfolio',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
