import { db } from '@/lib/db';
import { JobCard } from '@/components/JobCard';
import { GlassCard } from '@/components/GlassCard';
import { SearchBar } from '@/components/SearchBar';
import { Newsletter } from '@/components/Newsletter';
import { JobListingsClient } from '@/components/JobListingsClient';
import { Briefcase, TrendingUp, Shield } from 'lucide-react';
import type { Metadata } from 'next';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';

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

  // Get total active jobs count (only needed for display, not for filtering)
  const totalActiveJobs = await db.job.count({
    where: activeJobsWhere,
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
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Newsletter />
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
    </main>
    </>
  );
}
