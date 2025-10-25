import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const jobId = formData.get('jobId') as string;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    // Check if already saved
    const existingSave = await db.savedJob.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: session.userId,
        },
      },
    });

    if (existingSave) {
      // Unsave
      await db.savedJob.delete({
        where: {
          jobId_userId: {
            jobId,
            userId: session.userId,
          },
        },
      });
      return NextResponse.json({ saved: false });
    } else {
      // Save
      await db.savedJob.create({
        data: {
          jobId,
          userId: session.userId,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error: any) {
    console.error('Save job error:', error);
    return NextResponse.json(
      { error: 'Failed to save job' },
      { status: 500 }
    );
  }
}
