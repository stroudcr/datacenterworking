import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendApplicationNotification } from '@/lib/email';

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

    // Check if job exists and is active, and fetch user info for applicant and employer
    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        user: {
          select: {
            email: true,
            notificationPreferences: true,
          },
        },
      },
    });

    if (!job || job.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get applicant info
    const applicant = await db.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true },
    });

    if (!applicant) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

    // Send email notification to employer (non-blocking)
    const employerEmail = job.user?.email || job.email; // Use registered user email or guest email

    // Check notification preferences for registered employers
    const shouldSendEmail = job.userId
      ? job.user?.notificationPreferences?.newApplications !== false // Default to true if not set
      : true; // Always send for guest posters

    console.log('[APPLICATION] Email notification check:', {
      hasEmployerEmail: !!employerEmail,
      employerEmail: employerEmail || 'NOT SET',
      shouldSendEmail,
      jobId: job.id,
      jobTitle: job.title,
    });

    if (employerEmail && shouldSendEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.workindatacenter.com';
      const applicantsPageUrl = job.userId
        ? `${baseUrl}/dashboard/employer/jobs/${job.id}/applicants`
        : `${baseUrl}/jobs/manage/${job.id}?token=${job.managementToken}`;

      console.log('[APPLICATION] Sending notification email to:', employerEmail);

      try {
        const result = await sendApplicationNotification({
          to: employerEmail,
          jobTitle: job.title,
          company: job.company,
          applicantName: applicant.name || 'Anonymous',
          applicantEmail: applicant.email,
          coverLetter: coverLetter || undefined,
          resumeUrl: resume || undefined,
          applicantsPageUrl,
        });
        console.log('[APPLICATION] Email notification result:', result);
      } catch (error) {
        console.error('[APPLICATION] Failed to send application notification email:', error);
        // Don't fail the application submission if email fails
      }
    } else {
      console.log('[APPLICATION] Skipping email notification. Reasons:', {
        hasEmployerEmail: !!employerEmail,
        shouldSendEmail,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
