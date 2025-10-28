import type { NextConfig } from 'next';

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
  // Explicitly include Prisma engine files in the deployment
  outputFileTracingIncludes: {
    '/': ['./node_modules/.prisma/client/**/*', './node_modules/@prisma/client/**/*'],
    '/api/**/*': ['./node_modules/.prisma/client/**/*', './node_modules/@prisma/client/**/*'],
  },
};

export default nextConfig;
