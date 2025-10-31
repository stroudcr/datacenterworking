import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyCronRequest } from '@/lib/cron';

/**
 * Cron job to clean up expired jobs and reset featured flags
 * Runs daily at 3 AM UTC
 *
 * Tasks:
 * 1. Mark jobs with expiresAt < now() as EXPIRED
 * 2. Reset isFeatured flag for jobs with featuredUntil < now()
 */
export async function GET(request: NextRequest) {
  // Verify this request is from Vercel Cron
  if (!verifyCronRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const now = new Date();
  let jobsExpired = 0;
  let featuredReset = 0;

  try {
    // 1. Mark expired jobs as EXPIRED
    const expiredJobsResult = await db.job.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lt: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    jobsExpired = expiredJobsResult.count;
    console.log(`Marked ${jobsExpired} jobs as EXPIRED`);

    // 2. Reset featured flag for expired featured jobs
    const featuredResetResult = await db.job.updateMany({
      where: {
        isFeatured: true,
        featuredUntil: {
          lt: now,
        },
      },
      data: {
        isFeatured: false,
      },
    });

    featuredReset = featuredResetResult.count;
    console.log(`Reset featured flag on ${featuredReset} jobs`);

    return NextResponse.json({
      success: true,
      jobsExpired,
      featuredReset,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Error in cleanup-jobs cron:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cleanup jobs',
        jobsExpired,
        featuredReset,
      },
      { status: 500 }
    );
  }
}
