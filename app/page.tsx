import { db } from '@/lib/db';
import { JobCard } from '@/components/JobCard';
import { SearchBar } from '@/components/SearchBar';
import { JobListingsClient } from '@/components/JobListingsClient';
import { ArrowRight, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { getStateFullName, getStateSlug } from '@/lib/locations';

// Cache this page for 60 seconds to reduce database operations
export const revalidate = 60;

type HomeSearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasQueryParams = Object.values(params).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  return {
    title: 'Data Center Jobs',
    description:
      'Browse premium data center career opportunities in operations, engineering, IT infrastructure, security clearance positions, and more.',
    openGraph: {
      title: 'Data Center Jobs',
      description:
        'Browse premium data center career opportunities in operations, engineering, IT infrastructure, and more.',
      url: SITE_URL,
    },
    alternates: {
      canonical: SITE_URL,
    },
    robots: hasQueryParams
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string; type?: string; shift?: string; clearance?: string; certifications?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;
  const sort = params.sort || 'latest';
  const type = params.type;
  const shift = params.shift;
  const clearance = params.clearance;
  const certifications = params.certifications;

  const now = new Date();

  // Base where clause for active jobs
  const activeJobsWhere = {
    status: 'ACTIVE' as const,
    expiresAt: { gte: now },
  };

  // Fetch ALL active jobs for client-side filtering (cached for 60 seconds)
  // Note: Removed server-side filters (category, type, shift, etc.) for instant filtering
  const jobs = await db.job.findMany({
    where: {
      ...activeJobsWhere,
      // Keep search filter on server-side (more complex, involves text search)
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' }, // Default sort, client will handle sorting
    take: 150, // Increased limit for client-side filtering
  });

  // Get featured jobs (filter from main query results to avoid separate DB call)
  const featuredJobs = jobs
    .filter((job) => job.isFeatured && job.featuredUntil && job.featuredUntil >= now)
    .slice(0, 3);

  const stateCounts = await db.job.groupBy({
    by: ['state'],
    where: {
      ...activeJobsWhere,
      country: 'US',
      state: { not: null },
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 6,
  });
  const leadingStates = stateCounts.flatMap((item) => {
    const name = getStateFullName(item.state);
    return name ? [{ name, slug: getStateSlug(name), count: item._count.id }] : [];
  });

  // WebSite schema with SearchAction for sitelinks searchbox
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Work In Data Center',
    url: SITE_URL,
    description: 'Premium data center job board connecting professionals with top employers',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Keep the listing schema generic; detailed JobPosting schema lives on job detail pages.
  const itemListSchema = jobs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 10).map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${job.title} at ${job.company}`,
      url: absoluteUrl(`/jobs/${job.slug}`),
    })),
  } : null;

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Your Next{' '}
            <span className="animated-gradient bg-clip-text text-transparent">
              Data Center Job
            </span>
          </h1>
          <p className="text-xl text-silver-300 mb-8 max-w-2xl mx-auto">
            Connect with top data center employers. Discover premium opportunities
            in operations, engineering, IT infrastructure, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar initialSearch={search} />
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-12 px-4 bg-gradient-to-b from-transparent to-black/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="text-amber-400">★</span> Featured Jobs
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-5xl rounded-2xl border border-ice-400/20 bg-ice-500/10 p-6 md:flex md:items-center md:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-ice-400">Hiring data center talent?</p><h2 className="mt-2 text-2xl font-bold text-white">Advertise directly to a focused industry audience.</h2><p className="mt-2 text-silver-300">Post one role today or talk with us about recurring and multi-location hiring.</p></div>
          <div className="mt-5 flex gap-3 md:mt-0 md:ml-8"><Link href="/employers"><Button variant="outline">For Employers</Button></Link><Link href="/post-job?plan=standard"><Button>Post a Job</Button></Link></div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <JobListingsClient
            jobs={jobs}
            initialCategory={category}
            initialType={type}
            initialShift={shift}
            initialClearance={clearance}
            initialCertifications={certifications}
            initialSort={sort}
          />
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-6xl border-y border-white/10 py-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ice-400">Explore locally</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Find data center jobs in your state</h2>
            </div>
            <Link href="/states" className="inline-flex items-center gap-2 text-sm font-semibold text-ice-400 hover:text-ice-300">
              Browse every state <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {leadingStates.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {leadingStates.map((state) => (
                <Link
                  key={state.slug}
                  href={`/states/${state.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 transition-colors hover:border-ice-400/40 hover:bg-white/[0.06]"
                >
                  <span className="flex items-center gap-2 font-medium text-white">
                    <MapPin className="h-4 w-4 text-ice-400" aria-hidden="true" /> {state.name}
                  </span>
                  <span className="text-sm text-silver-400 group-hover:text-silver-200">{state.count} {state.count === 1 ? 'job' : 'jobs'}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-silver-400">Explore all 50 states and the District of Columbia for state-specific career guidance and future openings.</p>
          )}
        </div>
      </section>
    </main>
    </>
  );
}
