-- AlterTable
ALTER TABLE "Job" ADD COLUMN "slug" TEXT;

-- Create temporary slugs for existing jobs
UPDATE "Job" SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title || ' ' || location || ' ' || SUBSTRING(id, 1, 9), '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
);

-- Make slug required and unique
ALTER TABLE "Job" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
CREATE INDEX "Job_slug_idx" ON "Job"("slug");
