import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const bulkReviewSchema = z.object({
  jobId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'EMPLOYER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = bulkReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { jobId } = validation.data;

    // Verify the employer owns this job
    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { userId: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You do not have permission to view these applications' },
        { status: 403 }
      );
    }

    // Update all pending applications for this job to "reviewed"
    const result = await db.application.updateMany({
      where: {
        jobId: jobId,
        status: 'pending',
      },
      data: {
        status: 'reviewed',
      },
    });

    return NextResponse.json(
      {
        message: `${result.count} applications marked as reviewed`,
        count: result.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Bulk review error:', error);
    return NextResponse.json(
      { error: 'Failed to update applications' },
      { status: 500 }
    );
  }
}
