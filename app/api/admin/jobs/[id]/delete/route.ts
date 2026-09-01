import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { invalidatePublicJobData } from '@/lib/public-job-data';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Delete the job (soft delete)
    const job = await db.job.update({
      where: { id },
      data: { status: 'DELETED' },
      select: { slug: true },
    });
    invalidatePublicJobData({ slug: job.slug });

    // Redirect back to admin panel
    return NextResponse.redirect(new URL('/admin', request.url));
  } catch (error: any) {
    console.error('Delete job error:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
