import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { invalidatePublicJobData } from '@/lib/public-job-data';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Verify the job belongs to the user
    const job = await db.job.findUnique({
      where: { id },
    });

    if (!job || job.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the job (soft delete)
    await db.job.update({
      where: { id },
      data: { status: 'DELETED' },
    });
    if (job.status === 'ACTIVE') invalidatePublicJobData({ slug: job.slug });

    // Redirect back to employer dashboard
    return NextResponse.redirect(new URL('/dashboard/employer', request.url));
  } catch (error: any) {
    console.error('Delete job error:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
