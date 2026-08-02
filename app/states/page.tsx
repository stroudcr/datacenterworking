import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getAllStates } from '@/lib/locations';
import { GlassCard } from '@/components/GlassCard';
import { ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Browse Data Center Jobs by State',
    description:
      'Find data center jobs across the United States. Browse opportunities in facilities, engineering, IT, operations, and more by location.',
    openGraph: {
      title: 'Browse Data Center Jobs by State',
      description:
        'Find data center jobs across the United States. Browse opportunities in facilities, engineering, IT, operations, and more by location.',
      url: absoluteUrl('/states'),
    },
    alternates: {
      canonical: absoluteUrl('/states'),
    },
  };
}

export default async function StatesPage() {
  const allStates = getAllStates();

  // Get job counts per state
  const jobCountsByState = await db.job.groupBy({
    by: ['state'],
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      state: { not: null },
    },
    _count: {
      id: true,
    },
  });

  // Get remote job count
  const remoteJobCount = await db.job.count({
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      state: null,
    },
  });

  // Create a map of state abbreviation to job count
  const stateJobCounts = jobCountsByState.reduce((acc, item) => {
    if (item.state) {
      acc[item.state] = item._count.id;
    }
    return acc;
  }, {} as Record<string, number>);

  // Add job counts to states
  const statesWithCounts = allStates.map((state) => ({
    ...state,
    jobCount: stateJobCounts[state.abbreviation] || 0,
  }));

  // Sort by job count (descending), then alphabetically
  const sortedStates = statesWithCounts.sort((a, b) => {
    if (b.jobCount !== a.jobCount) {
      return b.jobCount - a.jobCount;
    }
    return a.name.localeCompare(b.name);
  });

  const totalJobs = Object.values(stateJobCounts).reduce((sum, count) => sum + count, 0);
  const statesWithOpenRoles = sortedStates.filter((state) => state.jobCount > 0);

  // Structured data for breadcrumbs
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
        name: 'States',
        item: absoluteUrl('/states'),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
            Browse Data Center Jobs by State
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {totalJobs > 0
              ? `Explore ${totalJobs.toLocaleString()} active data center ${
                  totalJobs === 1 ? 'opportunity' : 'opportunities'
                } across the United States.`
              : 'Browse data center hiring markets across the United States.'}{' '}
            Find roles in facilities, engineering, IT, operations, and more.
          </p>
        </div>

        {/* Remote Jobs Card */}
        {remoteJobCount > 0 && (
          <div className="mb-8">
            <Link href="/states/remote">
              <GlassCard className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-ice-400 to-ice-700">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Remote Jobs</h3>
                      <p className="text-gray-400 text-sm">Work from anywhere</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Briefcase className="w-5 h-5" />
                    <span className="text-2xl font-bold">{remoteJobCount}</span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </div>
        )}

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedStates.map((state) => {
            return (
              <Link key={state.abbreviation} href={`/states/${state.slug}`} className="group">
              <GlassCard
                className="h-full cursor-pointer border-ice-500/20 transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-ice-400/45"
              >
                <div className="flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{state.name}</h3>
                    <span className="font-mono text-xs text-ice-400">{state.abbreviation}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-silver-300">
                      <Briefcase className="h-4 w-4 text-ice-400" aria-hidden="true" />
                      {state.jobCount === 0
                        ? 'Career guide · 0 jobs'
                        : `${state.jobCount} ${state.jobCount === 1 ? 'job' : 'jobs'}`}
                    </span>
                    <ArrowRight className="h-4 w-4 text-silver-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </div>
              </GlassCard>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center">
          <GlassCard className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">Why Browse by State?</h2>
            <p className="text-gray-300 mb-4">
              Each state page combines current job listings with useful career context about energy,
              climate resilience, technical workforce pathways, and job preparation. Every guide remains
              available between hiring cycles, so you can research a market before the next role appears.
            </p>
            {statesWithOpenRoles.length > 0 && (
              <p className="text-gray-300 mb-4">
                Current listings are available in{' '}
                {statesWithOpenRoles
                  .slice(0, 6)
                  .map((state) => state.name)
                  .join(', ')}
                {statesWithOpenRoles.length > 6 ? ', and additional markets' : ''}.
              </p>
            )}
            <p className="text-gray-400 text-sm">Job counts reflect active listings and update as roles are added or expire.</p>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
