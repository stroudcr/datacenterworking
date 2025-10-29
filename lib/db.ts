import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Get database URL with connection pooling validation
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;

  // In production, warn if not using pooled connection
  // Pooled connections end with -pooler.neon.tech or -pooler.aws.neon.tech
  if (process.env.NODE_ENV === 'production' && url) {
    if (!url.includes('-pooler.')) {
      console.warn(
        '⚠️  WARNING: Not using connection pooling in production. ' +
        'For better performance with serverless, use the pooled connection URL from Neon dashboard.'
      );
    }
  }

  return url;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: getDatabaseUrl(),
  // Disable query logging in development to reduce overhead
  // Only log errors and warnings
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
