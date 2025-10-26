-- AlterTable
ALTER TABLE "Job" ADD COLUMN "certifications" TEXT;

-- CreateIndex
CREATE INDEX "Job_certifications_idx" ON "Job"("certifications");
