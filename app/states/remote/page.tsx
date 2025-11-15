import { Metadata } from 'next';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { JobListingsClient } from '@/components/JobListingsClient';
import { MapPin, Briefcase, Globe } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';

export const metadata: Metadata = {
  title: 'Remote Data Center Jobs | Work From Anywhere | Work In Data Center',
  description:
    'Browse remote data center jobs that allow you to work from anywhere. Find opportunities in IT, cloud infrastructure, network operations, security, and more.',
  openGraph: {
    title: 'Remote Data Center Jobs | Work From Anywhere',
    description:
      'Browse remote data center jobs that allow you to work from anywhere. Find opportunities in IT, cloud infrastructure, network operations, security, and more.',
    url: `${siteUrl}/states/remote`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remote Data Center Jobs',
    description:
      'Browse remote data center jobs that allow you to work from anywhere.',
  },
  alternates: {
    canonical: `${siteUrl}/states/remote`,
  },
};

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function RemoteJobsPage() {
  // Fetch remote jobs (no state assigned)
  const jobs = await db.job.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      state: null,
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 150,
  });

  // Get job counts by category for remote jobs
  const categoryCounts = await db.job.groupBy({
    by: ['category'],
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      state: null,
    },
    _count: {
      id: true,
    },
  });

  const topCategories = categoryCounts
    .sort((a, b) => b._count.id - a._count.id)
    .slice(0, 5);

  // Structured data for breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'States',
        item: `${siteUrl}/states`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Remote Jobs',
        item: `${siteUrl}/states/remote`,
      },
    ],
  };

  // Structured data for job collection
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Remote Data Center Jobs',
    description: 'Browse remote data center jobs that allow you to work from anywhere',
    url: `${siteUrl}/states/remote`,
    numberOfItems: jobs.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
              Remote Data Center Jobs
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            {jobs.length === 0
              ? 'No remote data center jobs available at the moment. Check back soon!'
              : `Browse ${jobs.length} remote ${jobs.length === 1 ? 'opportunity' : 'opportunities'} - Work from anywhere`}
          </p>
        </div>

        {/* Stats Cards */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Job Count */}
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Remote Jobs</p>
                  <p className="text-2xl font-bold text-white">{jobs.length}</p>
                </div>
              </div>
            </GlassCard>

            {/* Top Category */}
            {topCategories.length > 0 && (
              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Top Category</p>
                    <p className="text-sm font-semibold text-white truncate">
                      {topCategories[0].category}
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {/* Remote Work Benefits */}
        {jobs.length > 0 && (
          <div className="mb-8">
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-3">
                Why Choose Remote Data Center Work?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Work From Anywhere</p>
                    <p className="text-sm">No commute, choose your ideal location</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Flexible Schedule</p>
                    <p className="text-sm">Better work-life balance</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Global Opportunities</p>
                    <p className="text-sm">Work with teams worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Cost Savings</p>
                    <p className="text-sm">Save on transportation and relocation</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Job Categories */}
        {topCategories.length > 0 && (
          <div className="mb-8">
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-3">Popular Remote Categories</h2>
              <div className="flex flex-wrap gap-2">
                {topCategories.map((cat) => (
                  <span
                    key={cat.category}
                    className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300 border border-white/10"
                  >
                    {cat.category} ({cat._count.id})
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Job Listings */}
        <Suspense fallback={<div className="text-center py-12 text-gray-400">Loading jobs...</div>}>
          <JobListingsClient
            jobs={jobs}
            initialCategory=""
            initialType=""
            initialShift=""
            initialClearance=""
            initialCertifications=""
            initialSort="latest"
          />
        </Suspense>

        {/* No Jobs Message */}
        {jobs.length === 0 && (
          <div className="mt-8">
            <GlassCard className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Remote Jobs Available</h2>
              <p className="text-gray-400 mb-6">
                We don't currently have any remote job listings, but new opportunities are added
                daily. Check back soon or browse jobs by state.
              </p>
              <a
                href="/states"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Browse Jobs by State
              </a>
            </GlassCard>
          </div>
        )}
      </div>
    </>
  );
}
