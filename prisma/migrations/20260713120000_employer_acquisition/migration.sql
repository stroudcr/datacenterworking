-- Add employer-funnel attribution and conversion measurement.
ALTER TABLE "Job" ADD COLUMN "applyClickCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Payment" ADD COLUMN "firstTouch" JSONB;
ALTER TABLE "Payment" ADD COLUMN "lastTouch" JSONB;

CREATE TYPE "EmployerInquiryType" AS ENUM ('SINGLE_ROLE', 'VOLUME_HIRING', 'RECRUITER_AGENCY', 'PARTNERSHIP');
CREATE TYPE "HiringVolume" AS ENUM ('ONE', 'TWO_TO_FIVE', 'SIX_TO_TWENTY', 'TWENTY_PLUS');
CREATE TYPE "HiringTimeline" AS ENUM ('NOW', 'THIRTY_DAYS', 'NINETY_DAYS', 'EXPLORING');
CREATE TYPE "EmployerLeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED');

CREATE TABLE "EmployerLead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "workEmail" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "inquiryType" "EmployerInquiryType" NOT NULL,
  "hiringVolume" "HiringVolume" NOT NULL,
  "roles" TEXT NOT NULL,
  "locations" TEXT,
  "timeline" "HiringTimeline" NOT NULL,
  "notes" TEXT,
  "status" "EmployerLeadStatus" NOT NULL DEFAULT 'NEW',
  "firstTouch" JSONB,
  "lastTouch" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmployerLead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EmployerLead_createdAt_idx" ON "EmployerLead"("createdAt");
CREATE INDEX "EmployerLead_status_idx" ON "EmployerLead"("status");
CREATE INDEX "EmployerLead_workEmail_idx" ON "EmployerLead"("workEmail");
