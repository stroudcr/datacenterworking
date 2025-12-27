import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { getAllStates, getStateFromSlug, getStateAbbreviation } from '@/lib/locations';
import { JobListingsClient } from '@/components/JobListingsClient';
import { MapPin, Briefcase, Building2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

interface StatePageProps {
  params: Promise<{
    state: string;
  }>;
}

// Generate static params for all states at build time
export async function generateStaticParams() {
  const allStates = getAllStates();
  return allStates.map((state) => ({
    state: state.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const stateName = getStateFromSlug(stateSlug);

  if (!stateName) {
    return {
      title: 'State Not Found',
    };
  }

  const stateAbbr = getStateAbbreviation(stateName);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.workindatacenter.com';

  // Get job count for description
  const jobCount = await db.job.count({
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      state: stateAbbr,
    },
  });

  const title = `Data Center Jobs in ${stateName} | Work In Data Center`;
  const description = `Browse ${jobCount} active data center jobs in ${stateName}. Find opportunities in facilities, engineering, IT, operations, and more. Apply today!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/states/${stateSlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/states/${stateSlug}`,
    },
  };
}

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function StatePage({ params }: StatePageProps) {
  const { state: stateSlug } = await params;
  const stateName = getStateFromSlug(stateSlug);

  if (!stateName) {
    notFound();
  }

  const stateAbbr = getStateAbbreviation(stateName);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.workindatacenter.com';

  // Fetch jobs for this state
  const jobs = await db.job.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      state: stateAbbr,
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 150,
  });

  // Get unique cities in this state
  const cities = await db.job.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      state: stateAbbr,
      city: { not: null },
    },
    select: {
      city: true,
    },
    distinct: ['city'],
  });

  const uniqueCities = cities.map((c) => c.city).filter(Boolean) as string[];

  // Get job counts by category for this state
  const categoryCounts = await db.job.groupBy({
    by: ['category'],
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      state: stateAbbr,
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
        name: stateName,
        item: `${siteUrl}/states/${stateSlug}`,
      },
    ],
  };

  // Structured data for job collection
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Data Center Jobs in ${stateName}`,
    description: `Browse data center opportunities in ${stateName}`,
    url: `${siteUrl}/states/${stateSlug}`,
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
            <MapPin className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
              Data Center Jobs in {stateName}
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            {jobs.length === 0
              ? `No active data center jobs in ${stateName} at the moment. Check back soon!`
              : `Browse ${jobs.length} active ${jobs.length === 1 ? 'opportunity' : 'opportunities'} in ${stateName}`}
          </p>
        </div>

        {/* Stats Cards */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Job Count */}
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Jobs</p>
                  <p className="text-2xl font-bold text-white">{jobs.length}</p>
                </div>
              </div>
            </GlassCard>

            {/* Cities */}
            {uniqueCities.length > 0 && (
              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Cities</p>
                    <p className="text-2xl font-bold text-white">{uniqueCities.length}</p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Top Category */}
            {topCategories.length > 0 && (
              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
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

        {/* Cities in this state */}
        {uniqueCities.length > 0 && (
          <div className="mb-8">
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-3">Cities in {stateName}</h2>
              <div className="flex flex-wrap gap-2">
                {uniqueCities.sort().map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300 border border-white/10"
                  >
                    {city}
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
              <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                No Jobs Available in {stateName}
              </h2>
              <p className="text-gray-400 mb-6">
                We don't currently have any active job listings in {stateName}, but new opportunities
                are added daily.
              </p>
              <a
                href="/states"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Browse All States
              </a>
            </GlassCard>
          </div>
        )}
      </div>
    </>
  );
}
