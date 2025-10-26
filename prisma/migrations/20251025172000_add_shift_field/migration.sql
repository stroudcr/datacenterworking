-- AlterTable
ALTER TABLE "Job" ADD COLUMN "shift" TEXT;

-- CreateIndex
CREATE INDEX "Job_shift_idx" ON "Job"("shift");
