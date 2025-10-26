import type { NextConfig } from 'next';
// @ts-ignore - No types available
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

// Ensure Cloudinary cloud name is set
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  console.warn('Warning: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. Image uploads will not work.');
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
