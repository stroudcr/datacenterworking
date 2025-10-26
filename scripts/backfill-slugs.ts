import { PrismaClient } from '@prisma/client';
import { generateJobSlug } from '../lib/slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting slug backfill for existing jobs...\n');

  // Fetch all jobs
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      location: true,
      slug: true,
    },
  });

  console.log(`Found ${jobs.length} jobs to process\n`);

  let updated = 0;
  let skipped = 0;

  for (const job of jobs) {
    // Generate proper slug
    const newSlug = generateJobSlug(job.title, job.location, job.id);

    // Update if different from current slug
    if (job.slug !== newSlug) {
      try {
        await prisma.job.update({
          where: { id: job.id },
          data: { slug: newSlug },
        });
        console.log(`✓ Updated: ${job.title}`);
        console.log(`  Old: ${job.slug}`);
        console.log(`  New: ${newSlug}\n`);
        updated++;
      } catch (error) {
        console.error(`✗ Failed to update ${job.title}:`, error);
      }
    } else {
      skipped++;
    }
  }

  console.log('\n-------------------');
  console.log(`✅ Backfill complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total:   ${jobs.length}`);
}

main()
  .catch((e) => {
    console.error('Error during slug backfill:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
