import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { GlassCard } from '@/components/GlassCard';
import { ApplicationFormPage } from '@/components/ApplicationFormPage';
import { isLegacyId } from '@/lib/slugify';
import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import { Building2, MapPin, DollarSign } from 'lucide-react';
import { SITE_NAME, absoluteUrl } from '@/lib/site-config';

// Cache this page for 5 minutes
export const revalidate = 300;

interface ApplyPageProps {
  params: Promise<{ slug: string }>;
}

// Cached job fetch function
const getJobBySlug = cache(async (slug: string) => {
  // Check if this is an old-style ID URL
  if (isLegacyId(slug)) {
    const legacyJob = await db.job.findUnique({
      where: { id: slug },
      select: { slug: true },
    });
    return { isLegacy: true, redirectSlug: legacyJob?.slug };
  }

  // Fetch job by slug
  const job = await db.job.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      company: true,
      companyLogo: true,
      location: true,
      salary: true,
      type: true,
      status: true,
      expiresAt: true,
      slug: true,
    },
  });

  return { isLegacy: false, job };
});

// Generate metadata for SEO
export async function generateMetadata({ params }: ApplyPageProps): Promise<Metadata> {
  const { slug } = await params;

  const result = await getJobBySlug(slug);

  if (result.isLegacy) {
    return {
      title: result.redirectSlug ? 'Redirecting...' : 'Job Not Found',
    };
  }

  const { job } = result;
  if (!job) {
    return {
      title: 'Job Not Found',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `Apply to ${job.title} at ${job.company}`;
  const description = `Submit your application for ${job.title} at ${job.company}. Upload your resume and cover letter to apply.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/jobs/${slug}/apply`),
      siteName: SITE_NAME,
      images: job.companyLogo ? [
        {
          url: job.companyLogo,
          width: 1200,
          height: 630,
          alt: `${job.company} logo`,
        }
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    robots: {
      index: false, // Don't index application pages
      follow: true,
    },
  };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { slug } = await params;

  // Get user session - must be logged in to apply
  const session = await getSession();
  if (!session) {
    redirect(`/login?redirect=/jobs/${slug}/apply`);
  }

  // Only job seekers can apply
  if (session.role !== 'JOB_SEEKER') {
    redirect(`/jobs/${slug}`);
  }

  // Fetch job data
  const result = await getJobBySlug(slug);

  // Handle legacy ID redirects
  if (result.isLegacy) {
    if (result.redirectSlug) {
      redirect(`/jobs/${result.redirectSlug}/apply`);
    }
    notFound();
  }

  const { job } = result;
  if (!job || job.status !== 'ACTIVE') {
    notFound();
  }

  // Check if job is expired
  const isExpired = new Date(job.expiresAt) < new Date();
  if (isExpired) {
    redirect(`/jobs/${slug}`);
  }

  // Check if user has already applied
  const existingApplication = await db.application.findUnique({
    where: {
      jobId_userId: {
        jobId: job.id,
        userId: session.userId,
      },
    },
  });

  if (existingApplication) {
    redirect(`/jobs/${slug}`);
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href={`/jobs/${slug}`}
          className="inline-flex items-center gap-2 text-silver-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to Job
        </Link>

        {/* Job Summary Card */}
        <GlassCard className="mb-6">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-16 h-16 rounded-lg object-cover glass flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg glass flex items-center justify-center text-xl text-ice-400 font-bold flex-shrink-0">
                {job.company.charAt(0)}
              </div>
            )}

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white mb-2">
                Apply for {job.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-silver-300">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {job.company}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1 text-ice-400">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Application Form */}
        <ApplicationFormPage
          jobId={job.id}
          jobSlug={slug}
        />
      </div>
    </main>
  );
}
