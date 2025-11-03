'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function adminDeleteJob(jobId: string) {
  try {
    // Get current session
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      throw new Error('Unauthorized - Admin access required');
    }

    // Find the job
    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { id: true, title: true },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Admin can hard delete or soft delete - using soft delete for consistency
    await db.job.update({
      where: { id: jobId },
      data: { status: 'DELETED' },
    });

    // Revalidate the admin page to show updated list
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Admin error deleting job:', error);
    throw new Error(error.message || 'Failed to delete job');
  }
}
