#!/usr/bin/env tsx
/**
 * Import real data center jobs from JSearch API (via RapidAPI)
 *
 * Usage:
 *   npx tsx scripts/import-jobs-jsearch.ts                        # Import with defaults (5 pages, recent jobs)
 *   npx tsx scripts/import-jobs-jsearch.ts --dry-run              # Preview without importing
 *   npx tsx scripts/import-jobs-jsearch.ts --pages=50             # Fetch 50 pages (~500 jobs)
 *   npx tsx scripts/import-jobs-jsearch.ts --date-filter=month    # Jobs from last month
 *   npx tsx scripts/import-jobs-jsearch.ts --limit=50             # Import top 50 jobs
 */

import { db } from '../lib/db';
import { fetchJobs } from '../lib/jobs-api/jsearch';
import { getTopJobs, deduplicateJobs } from '../lib/jobs-api/filter';
import { mapJSearchJobs } from '../lib/jobs-api/mapper';
import { ImportStats } from '../lib/jobs-api/types';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitArg = args.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 100;
const pagesArg = args.find(arg => arg.startsWith('--pages='));
const pages = pagesArg ? parseInt(pagesArg.split('=')[1]) : 5;
const dateFilterArg = args.find(arg => arg.startsWith('--date-filter='));
const dateFilter = (dateFilterArg ? dateFilterArg.split('=')[1] : 'week') as 'all' | 'today' | '3days' | 'week' | 'month';

console.log('🚀 JSearch Job Import Script');
console.log('=' .repeat(50));
console.log(`Mode: ${isDryRun ? 'DRY RUN (preview only)' : 'LIVE IMPORT'}`);
console.log(`Pages: ${pages} (~${pages * 10} raw jobs)`);
console.log(`Date Filter: ${dateFilter}`);
console.log(`Target: Top ${limit} data center jobs`);
console.log('=' .repeat(50));
console.log('');

async function main() {
  const stats: ImportStats = {
    totalFetched: 0,
    totalScored: 0,
    totalImported: 0,
    totalSkipped: 0,
    duplicates: 0,
    errors: 0,
    apiCallsUsed: 0,
  };

  try {
    // Step 1: Fetch jobs from JSearch API
    console.log('📡 Step 1: Fetching jobs from JSearch API...');
    console.log(`This will use ${pages} API calls (${pages} pages)...`);
    console.log('');

    const rawJobs = await fetchJobs({ pages, datePosted: dateFilter });
    stats.totalFetched = rawJobs.length;
    stats.apiCallsUsed = pages;

    console.log(`✅ Fetched ${stats.totalFetched} raw jobs from API`);
    console.log('');

    // Step 2: Score and filter jobs
    console.log(`🎯 Step 2: Scoring and filtering for data center relevance...`);

    const scoredJobs = getTopJobs(rawJobs, limit * 2); // Get 2x for deduplication buffer
    stats.totalScored = scoredJobs.length;

    console.log(`✅ Found ${stats.totalScored} relevant data center jobs`);
    console.log('');

    // Step 3: Deduplicate
    console.log(`🔍 Step 3: Removing duplicates...`);

    const uniqueJobs = deduplicateJobs(scoredJobs).slice(0, limit);
    stats.duplicates = stats.totalScored - uniqueJobs.length;

    console.log(`✅ ${uniqueJobs.length} unique jobs after deduplication`);
    console.log(`   (${stats.duplicates} duplicates removed)`);
    console.log('');

    // Step 4: Map to our schema
    console.log(`🗺️  Step 4: Mapping jobs to database schema...`);

    const mappedJobs = mapJSearchJobs(uniqueJobs);

    console.log(`✅ Mapped ${mappedJobs.length} jobs`);
    console.log('');

    // Display sample jobs
    console.log('📋 Sample jobs to be imported:');
    console.log('-'.repeat(50));
    mappedJobs.slice(0, 5).forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Company: ${job.company}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   Category: ${job.category}`);
      console.log(`   Type: ${job.type}`);
      if (job.salaryMin && job.salaryMax) {
        console.log(`   Salary: $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`);
      }
      console.log(`   Score: ${uniqueJobs[index].relevanceScore}`);
      console.log('');
    });

    if (mappedJobs.length > 5) {
      console.log(`   ... and ${mappedJobs.length - 5} more jobs`);
      console.log('');
    }

    // Step 5: Import to database (unless dry run)
    if (isDryRun) {
      console.log('🔍 DRY RUN MODE - No jobs were imported');
      console.log('   Remove --dry-run flag to perform actual import');
    } else {
      console.log(`💾 Step 5: Importing jobs to database...`);

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

      console.log(`✅ Import complete!`);
    }

    // Final statistics
    console.log('');
    console.log('📊 Import Statistics');
    console.log('='.repeat(50));
    console.log(`API Calls Used:      ${stats.apiCallsUsed}`);
    console.log(`Total Fetched:       ${stats.totalFetched} raw jobs`);
    console.log(`Relevant Jobs:       ${stats.totalScored} (after scoring)`);
    console.log(`Unique Jobs:         ${uniqueJobs.length} (after dedup)`);
    console.log(`Duplicates Removed:  ${stats.duplicates}`);

    if (!isDryRun) {
      console.log(`Imported:            ${stats.totalImported} ✅`);
      console.log(`Skipped (existing):  ${stats.totalSkipped}`);
      console.log(`Errors:              ${stats.errors}`);
    }

    console.log('='.repeat(50));
    console.log('');

    if (!isDryRun && stats.totalImported > 0) {
      console.log('✨ Success! Your job board now has real data center jobs.');
      console.log('');
      console.log('Next steps:');
      console.log('  • Visit your homepage to see the imported jobs');
      console.log('  • Check the admin panel to manage external jobs');
      console.log('  • You can run this script again next month when API limit resets');
    }

  } catch (error) {
    console.error('');
    console.error('❌ Error during import:', error);
    console.error('');

    if (error instanceof Error && error.message.includes('RAPIDAPI_KEY')) {
      console.error('⚠️  RAPIDAPI_KEY is not set in your environment variables');
      console.error('');
      console.error('To fix this:');
      console.error('  1. Sign up at https://rapidapi.com/');
      console.error('  2. Subscribe to JSearch API (free tier)');
      console.error('  3. Add RAPIDAPI_KEY to your .env file');
      console.error('');
    }

    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
