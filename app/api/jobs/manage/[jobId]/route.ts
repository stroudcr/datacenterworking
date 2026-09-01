import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseLocation } from '@/lib/locations';
import { invalidatePublicJobData } from '@/lib/public-job-data';

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { jobId } = params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    // Find job with matching ID and token
    const job = await db.job.findFirst({
      where: {
        id: jobId,
        managementToken: token,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Invalid job or token' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error: any) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { jobId } = params;
    const body = await request.json();
    const { token, ...updates } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    // Verify token matches
    const job = await db.job.findFirst({
      where: {
        id: jobId,
        managementToken: token,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Invalid job or token' },
        { status: 404 }
      );
    }

    const parsedLocation = typeof updates.location === 'string'
      ? parseLocation(updates.location)
      : null;

    // Update job (only allow certain fields)
    const allowedUpdates = {
      title: updates.title,
      company: updates.company,
      companyLogo: updates.companyLogo,
      location: updates.location,
      type: updates.type,
      category: updates.category,
      shift: updates.shift,
      clearance: updates.clearance,
      certifications: updates.certifications,
      description: updates.description,
      requirements: updates.requirements,
      salary: updates.salary,
      salaryMin: updates.salaryMin,
      salaryMax: updates.salaryMax,
      hourlyRate: updates.hourlyRate,
      hourlyRateMin: updates.hourlyRateMin,
      hourlyRateMax: updates.hourlyRateMax,
      applyUrl: updates.applyUrl,
      applyEmail: updates.applyEmail,
      tags: updates.tags,
      ...(parsedLocation && {
        city: parsedLocation.city,
        state: parsedLocation.state,
        locationStates: parsedLocation.states,
        isRemote: parsedLocation.isRemote,
        country: parsedLocation.country,
      }),
    };

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: allowedUpdates,
    });
    if (job.status === 'ACTIVE') invalidatePublicJobData({ slug: job.slug });

    return NextResponse.json({ job: updatedJob });
  } catch (error: any) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { jobId } = params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    // Verify token matches
    const job = await db.job.findFirst({
      where: {
        id: jobId,
        managementToken: token,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Invalid job or token' },
        { status: 404 }
      );
    }

    // Soft delete by updating status
    await db.job.update({
      where: { id: jobId },
      data: { status: 'DELETED' },
    });
    if (job.status === 'ACTIVE') invalidatePublicJobData({ slug: job.slug });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
