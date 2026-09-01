'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { invalidatePublicJobData } from '@/lib/public-job-data';

export async function deleteJob(jobId: string) {
  try {
    // Get current session
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized');
    }

    // Find the job and verify ownership
    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { userId: true, status: true, slug: true },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Verify user owns this job
    if (job.userId !== session.userId) {
      throw new Error('Unauthorized - you do not own this job');
    }

    // Soft delete the job (mark as DELETED instead of actually removing)
    await db.job.update({
      where: { id: jobId },
      data: { status: 'DELETED' },
    });
    if (job.status === 'ACTIVE') invalidatePublicJobData({ slug: job.slug });

    // Revalidate the dashboard to show updated list
    revalidatePath('/dashboard/employer');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting job:', error);
    throw new Error(error.message || 'Failed to delete job');
  }
}
