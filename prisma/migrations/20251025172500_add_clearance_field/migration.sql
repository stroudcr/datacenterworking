-- AlterTable
ALTER TABLE "Job" ADD COLUMN "clearance" TEXT;

-- CreateIndex
CREATE INDEX "Job_clearance_idx" ON "Job"("clearance");
