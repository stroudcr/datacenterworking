import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, coverLetter, resume } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    // Validate at least one field is provided
    if (!coverLetter && !resume) {
      return NextResponse.json(
        { error: 'Please provide either a cover letter or resume' },
        { status: 400 }
      );
    }

    // Check if job exists and is active
    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if already applied
    const existingApplication = await db.application.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId: session.userId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Already applied to this job' },
        { status: 400 }
      );
    }

    // Create application with cover letter and/or resume
    await db.application.create({
      data: {
        jobId,
        userId: session.userId,
        coverLetter: coverLetter || null,
        resume: resume || null,
        status: 'pending',
      },
    });

    // Increment application count
    await db.job.update({
      where: { id: jobId },
      data: {
        applicationCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
