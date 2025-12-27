import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getAllStates } from '@/lib/locations';
import { GlassCard } from '@/components/GlassCard';
import { MapPin, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Browse Data Center Jobs by State | Work In Data Center',
  description:
    'Find data center jobs across all 50 US states. Browse opportunities in facilities, engineering, IT, operations, and more by location.',
  openGraph: {
    title: 'Browse Data Center Jobs by State',
    description:
      'Find data center jobs across all 50 US states. Browse opportunities in facilities, engineering, IT, operations, and more by location.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/states`,
  },
};

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function StatesPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.workindatacenter.com';
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
            Explore {totalJobs.toLocaleString()} active data center opportunities across the United States.
            Find your next career in facilities, engineering, IT, operations, and more.
          </p>
        </div>

        {/* Remote Jobs Card */}
        {remoteJobCount > 0 && (
          <div className="mb-8">
            <Link href="/states/remote">
              <GlassCard className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
          {sortedStates.map((state) => (
            <Link key={state.abbreviation} href={`/states/${state.slug}`}>
              <GlassCard
                className={`hover:scale-[1.02] transition-transform duration-200 cursor-pointer h-full ${
                  state.jobCount === 0 ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{state.name}</h3>
                    <span className="text-xs text-gray-400 font-mono">{state.abbreviation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 mt-auto">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {state.jobCount === 0
                        ? 'No jobs available'
                        : `${state.jobCount} ${state.jobCount === 1 ? 'job' : 'jobs'}`}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center">
          <GlassCard className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">Why Browse by State?</h2>
            <p className="text-gray-300 mb-4">
              Data center professionals often seek opportunities in specific regions due to cost of living,
              climate preferences, or proximity to major tech hubs. Our state-specific job pages make it
              easy to find the perfect role in your desired location.
            </p>
            <p className="text-gray-400 text-sm">
              Major data center hubs include Virginia (Ashburn - Data Center Alley), Texas (Dallas, Austin),
              California (Silicon Valley), Illinois (Chicago), and the Pacific Northwest (Oregon, Washington).
            </p>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
