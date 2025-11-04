import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { fetchJobsFreeTier } from '@/lib/jobs-api/jsearch';
import { getTopJobs, deduplicateJobs } from '@/lib/jobs-api/filter';
import { mapJSearchJobs } from '@/lib/jobs-api/mapper';
import { ImportStats } from '@/lib/jobs-api/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body for options
    const body = await request.json().catch(() => ({}));
    const limit = body.limit || 100;

    const stats: ImportStats = {
      totalFetched: 0,
      totalScored: 0,
      totalImported: 0,
      totalSkipped: 0,
      duplicates: 0,
      errors: 0,
      apiCallsUsed: 0,
    };

    // Step 1: Fetch jobs from JSearch API
    console.log('Fetching jobs from JSearch API...');
    const rawJobs = await fetchJobsFreeTier();
    stats.totalFetched = rawJobs.length;
    stats.apiCallsUsed = 100;

    // Step 2: Score and filter jobs
    console.log('Scoring and filtering jobs...');
    const scoredJobs = getTopJobs(rawJobs, limit * 2);
    stats.totalScored = scoredJobs.length;

    // Step 3: Deduplicate
    console.log('Deduplicating jobs...');
    const uniqueJobs = deduplicateJobs(scoredJobs).slice(0, limit);
    stats.duplicates = stats.totalScored - uniqueJobs.length;

    // Step 4: Map to our schema
    console.log('Mapping jobs to schema...');
    const mappedJobs = mapJSearchJobs(uniqueJobs);

    // Step 5: Import to database
    console.log('Importing jobs to database...');
    for (const job of mappedJobs) {
      try {
        // Check if job already exists by externalId
        const existing = await db.job.findUnique({
          where: { externalId: job.externalId },
        });

        if (existing) {
          stats.totalSkipped++;
          continue;
        }

        // Create job in database
        await db.job.create({
          data: {
            ...job,
            status: 'ACTIVE',
            isFeatured: false,
            enableInternalApplications: false,
          },
        });

        stats.totalImported++;
      } catch (error) {
        console.error(`Error importing job: ${job.title}`, error);
        stats.errors++;
      }
    }

    console.log('Import complete:', stats);

    return NextResponse.json({
      success: true,
      stats,
      message: `Successfully imported ${stats.totalImported} jobs`,
    });
  } catch (error: any) {
    console.error('Import jobs error:', error);

    let errorMessage = 'Failed to import jobs';
    if (error.message?.includes('RAPIDAPI_KEY')) {
      errorMessage = 'RAPIDAPI_KEY is not configured. Please add it to your environment variables.';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check import status/history
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get count of external jobs
    const externalJobsCount = await db.job.count({
      where: {
        source: 'EXTERNAL_JSEARCH',
        status: 'ACTIVE',
      },
    });

    // Get latest external job sync time
    const latestExternalJob = await db.job.findFirst({
      where: {
        source: 'EXTERNAL_JSEARCH',
      },
      orderBy: {
        lastSynced: 'desc',
      },
      select: {
        lastSynced: true,
      },
    });

    return NextResponse.json({
      externalJobsCount,
      lastSyncedAt: latestExternalJob?.lastSynced,
      rapidApiKeyConfigured: !!process.env.RAPIDAPI_KEY,
    });
  } catch (error: any) {
    console.error('Get import status error:', error);
    return NextResponse.json(
      { error: 'Failed to get import status' },
      { status: 500 }
    );
  }
}
