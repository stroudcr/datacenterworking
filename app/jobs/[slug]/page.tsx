import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { SaveJobButton } from '@/components/SaveJobButton';
import { ViewTracker } from '@/components/ViewTracker';
import { ApplyButton } from '@/components/ApplyButton';
import { TrackedApplyLink } from '@/components/TrackedApplyLink';
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  Building2,
  Calendar,
  ExternalLink,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { isLegacyId } from '@/lib/slugify';
import type { Metadata } from 'next';
import { cache } from 'react';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site-config';

// This page reads cookie-backed session state, so it must use one consistent
// rendering mode for generated, newly created, and unknown job slugs.
export const dynamic = 'force-dynamic';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

function getSchemaEmploymentType(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes('full')) return 'FULL_TIME';
  if (normalized.includes('part')) return 'PART_TIME';
  if (normalized.includes('contract')) return 'CONTRACTOR';
  if (normalized.includes('temporary')) return 'TEMPORARY';
  if (normalized.includes('intern')) return 'INTERN';
  if (normalized.includes('per diem')) return 'PER_DIEM';
  if (normalized.includes('remote')) return 'OTHER';

  return 'OTHER';
}

// Cached job fetch function to deduplicate queries between metadata and page render
// This ensures we only query the database once per request, not twice
const getJobBySlug = cache(async (slug: string) => {
  // Check if this is an old-style ID URL
  if (isLegacyId(slug)) {
    const legacyJob = await db.job.findUnique({
      where: { id: slug },
      select: { slug: true },
    });
    return { isLegacy: true, redirectSlug: legacyJob?.slug };
  }

  // Fetch job by slug with all needed data
  const job = await db.job.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          company: true,
        },
      },
    },
  });

  return { isLegacy: false, job };
});

// Generate metadata for SEO
export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;

  const result = await getJobBySlug(slug);

  // Handle legacy ID redirects
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

  const jobTitle = job.title.trim();
  const companyName = job.company.trim();
  const title = `${jobTitle} at ${companyName}`;
  const description = job.description.slice(0, 160) + (job.description.length > 160 ? '...' : '');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/jobs/${slug}`),
      siteName: SITE_NAME,
      images: job.companyLogo ? [
        {
          url: job.companyLogo,
          width: 1200,
          height: 630,
          alt: `${companyName} logo`,
        }
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: job.companyLogo ? [job.companyLogo] : [],
    },
    alternates: {
      canonical: absoluteUrl(`/jobs/${slug}`),
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;

  // Use cached job fetch (deduplicates with generateMetadata)
  const result = await getJobBySlug(slug);

  // Handle legacy ID redirects
  if (result.isLegacy) {
    if (result.redirectSlug) {
      redirect(`/jobs/${result.redirectSlug}`);
    }
    notFound();
  }

  const { job } = result;
  if (!job || job.status !== 'ACTIVE' || job.expiresAt <= new Date()) {
    notFound();
  }

  const session = await getSession();

  // Optimized: Fetch savedJob and application status in parallel if user is logged in
  let isSaved = false;
  let hasApplied = false;
  if (session) {
    const [savedJob, application] = await Promise.all([
      db.savedJob.findUnique({
        where: {
          jobId_userId: {
            jobId: job.id,
            userId: session.userId,
          },
        },
      }),
      db.application.findUnique({
        where: {
          jobId_userId: {
            jobId: job.id,
            userId: session.userId,
          },
        },
      }),
    ]);
    isSaved = !!savedJob;
    hasApplied = !!application;
  }

  // Note: View count increment moved to client-side component for non-blocking behavior
  // This prevents the database write from delaying page render

  const isRemote = job.isRemote;
  const jobTitle = job.title.trim();
  const companyName = job.company.trim();

  // Generate JSON-LD structured data for SEO (Schema.org JobPosting)
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: jobTitle,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    validThrough: job.expiresAt.toISOString(),
    employmentType: getSchemaEmploymentType(job.type),
    url: absoluteUrl(`/jobs/${job.slug}`),
    hiringOrganization: {
      '@type': 'Organization',
      name: companyName,
      ...(job.companyLogo && { logo: job.companyLogo }),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location.split(',')[0]?.trim() || job.location,
        addressRegion: job.location.split(',')[1]?.trim() || '',
        addressCountry: 'US',
      },
    },
    ...(isRemote && {
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements: {
        '@type': 'Country',
        name: 'United States',
      },
    }),
    ...(job.salaryMin && job.salaryMax && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salaryMin,
          maxValue: job.salaryMax,
          unitText: 'YEAR',
        },
      },
    }),
    ...(job.hourlyRateMin && job.hourlyRateMax && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.hourlyRateMin,
          maxValue: job.hourlyRateMax,
          unitText: 'HOUR',
        },
      },
    }),
    ...((job.enableInternalApplications || job.applyEmail || job.applyUrl) && {
      directApply: true,
      ...(job.applyUrl && {
        applicationContact: {
          '@type': 'ContactPoint',
          url: job.applyUrl,
        },
      }),
      ...(job.applyEmail && {
        applicationContact: {
          '@type': 'ContactPoint',
          email: job.applyEmail,
        },
      }),
    }),
    identifier: {
      '@type': 'PropertyValue',
      name: SITE_NAME,
      value: job.id,
    },
    industry: 'Data Centers',
    occupationalCategory: job.category,
    ...(job.requirements && {
      qualifications: job.requirements,
    }),
    ...(job.tags.length > 0 && {
      skills: job.tags.join(', '),
    }),
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Jobs',
        item: `${SITE_URL}/#jobs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: job.category,
        item: `${SITE_URL}/?category=${encodeURIComponent(job.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: jobTitle,
        item: absoluteUrl(`/jobs/${job.slug}`),
      },
    ],
  };

  return (
    <>
      {/* Track page view asynchronously */}
      <ViewTracker jobId={job.id} />

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-silver-400 hover:text-white mb-6 transition-colors">
          ← Back to Jobs
        </Link>

        {/* Header Card */}
        <GlassCard className="mb-6">
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={companyName}
                className="w-20 h-20 rounded-xl object-cover glass"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl glass flex items-center justify-center text-2xl text-ice-400 font-bold">
                {companyName.charAt(0)}
              </div>
            )}

            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  {job.isFeatured && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold mb-2">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-white mb-2">{jobTitle}</h1>
                  <div className="flex items-center gap-2 text-silver-300">
                    <Building2 className="w-5 h-5" />
                    <span className="text-lg">{companyName}</span>
                  </div>
                </div>

                {/* Actions */}
                {session && session.role === 'JOB_SEEKER' && (
                  <div className="flex gap-2">
                    <SaveJobButton
                      jobId={job.id}
                      initialSaved={isSaved}
                    />
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-silver-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {job.type}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2 text-ice-400 font-medium">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 rounded-full glass text-sm text-ice-400 border border-ice-500/30">
                {job.category}
              </span>
              {job.source === 'EXTERNAL_JSEARCH' && (
                <span className="px-3 py-1 rounded-full bg-ice-500/10 text-sm text-ice-400 border border-ice-500/20 inline-flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  via Google for Jobs
                </span>
              )}
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/5 text-sm text-silver-400 inline-flex items-center"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-4">
                Job Description
              </h2>
              <div
                className="prose prose-invert prose-ice max-w-none text-silver-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </GlassCard>

            {/* Requirements */}
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-4">
                Requirements
              </h2>
              <div
                className="prose prose-invert prose-ice max-w-none text-silver-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">
                Apply for this job
              </h3>

              {!session ? (
                <div className="space-y-3">
                  <p className="text-sm text-silver-400 mb-4">
                    Sign in or create an account to apply
                  </p>
                  <Link href="/login">
                    <Button variant="primary" fullWidth>
                      Sign In to Apply
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" fullWidth>
                      Create Account
                    </Button>
                  </Link>
                </div>
              ) : session.role === 'EMPLOYER' ? (
                <p className="text-sm text-silver-400">
                  Employer accounts cannot apply to jobs.
                </p>
              ) : hasApplied ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm">
                    ✓ You have already applied to this job
                  </div>
                  <Link href="/dashboard/seeker">
                    <Button variant="secondary" fullWidth>
                      View Application
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {job.applyUrl && (
                    <TrackedApplyLink jobId={job.id} href={job.applyUrl}>
                      <Button variant="primary" fullWidth>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply on Company Site
                      </Button>
                    </TrackedApplyLink>
                  )}
                  {job.applyEmail && (
                    <TrackedApplyLink jobId={job.id} href={`mailto:${job.applyEmail}`}>
                      <Button variant={job.applyUrl ? 'outline' : 'primary'} fullWidth>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Application
                      </Button>
                    </TrackedApplyLink>
                  )}
                  {(job.enableInternalApplications || (!job.applyUrl && !job.applyEmail)) && (
                    <ApplyButton
                      jobId={job.id}
                      jobTitle={jobTitle}
                      companyName={companyName}
                      jobSlug={job.slug}
                    />
                  )}
                </div>
              )}
            </GlassCard>

            {/* Company Info */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">
                About the Company
              </h3>
              <div className="space-y-2 text-silver-300">
                <p className="font-medium text-white">{companyName}</p>
                {job.user?.company && job.user.company !== companyName && (
                  <p className="text-sm">Posted by: {job.user.company}</p>
                )}
              </div>
            </GlassCard>

            {/* Job Details */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">
                Job Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-silver-400">Job Type</span>
                  <span className="text-white">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-silver-400">Category</span>
                  <span className="text-white text-right">{job.category}</span>
                </div>
                {job.salaryMin && job.salaryMax && (
                  <div className="flex justify-between">
                    <span className="text-silver-400">Salary Range</span>
                    <span className="text-white">
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-silver-400">Posted</span>
                  <span className="text-white">
                    {format(new Date(job.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-silver-400">Expires</span>
                  <span className="text-white">
                    {format(new Date(job.expiresAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
