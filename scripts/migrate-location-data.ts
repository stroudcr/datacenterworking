/**
 * One-time data migration script to parse existing job locations
 * and populate the new city, state, and country fields
 *
 * Run with: npx tsx scripts/migrate-location-data.ts
 */

import { PrismaClient } from '@prisma/client';
import { parseLocation } from '../lib/locations';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting location data migration...\n');

  // Fetch all jobs
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      location: true,
      city: true,
      state: true,
      locationStates: true,
      isRemote: true,
      country: true,
    },
  });

  console.log(`Found ${jobs.length} jobs to process\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  const stateCounts: Record<string, number> = {};
  const remoteCount = { count: 0 };

  for (const job of jobs) {
    try {
      // Parse the location
      const parsed = parseLocation(job.location);

      const isUnchanged = job.city === parsed.city
        && job.state === parsed.state
        && job.country === parsed.country
        && job.isRemote === parsed.isRemote
        && job.locationStates.length === parsed.states.length
        && job.locationStates.every((state, index) => state === parsed.states[index]);

      if (isUnchanged) {
        skipped++;
        continue;
      }

      // Update the job
      await prisma.job.update({
        where: { id: job.id },
        data: {
          city: parsed.city,
          state: parsed.state,
          locationStates: parsed.states,
          isRemote: parsed.isRemote,
          country: parsed.country,
        },
      });

      // Track statistics
      if (parsed.state) {
        stateCounts[parsed.state] = (stateCounts[parsed.state] || 0) + 1;
      } else {
        remoteCount.count++;
      }

      console.log(
        `✅ Updated job ${job.id}: "${job.location}" → City: ${parsed.city || 'null'}, States: ${parsed.states.join(', ') || 'none'}, Remote: ${parsed.isRemote}`
      );
      updated++;
    } catch (error) {
      console.error(`❌ Error updating job ${job.id}:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`Total jobs processed: ${jobs.length}`);
  console.log(`✅ Successfully updated: ${updated}`);
  console.log(`⏭️  Skipped (already migrated): ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`\n📍 Remote/No State: ${remoteCount.count}`);

  console.log('\n📊 Jobs by State:');
  const sortedStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]);
  sortedStates.forEach(([state, count]) => {
    console.log(`   ${state}: ${count} jobs`);
  });

  console.log('\n✨ Migration completed!\n');
}

main()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
