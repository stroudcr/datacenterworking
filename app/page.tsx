import { db } from '@/lib/db';
import { JobCard } from '@/components/JobCard';
import { GlassCard } from '@/components/GlassCard';
import { SearchBar } from '@/components/SearchBar';
import { SortSelect } from '@/components/SortSelect';
import { Newsletter } from '@/components/Newsletter';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Briefcase, TrendingUp, Shield } from 'lucide-react';

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

  // Fetch jobs
  const jobs = await db.job.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: {
        gte: new Date(),
      },
      ...(category && { category }),
      ...(type && { type }),
      ...(shift && { shift }),
      ...(clearance && { clearance }),
      ...(certifications && { certifications }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy:
      sort === 'applications'
        ? { applicationCount: 'desc' }
        : { createdAt: 'desc' },
    take: 50,
  });

  // Get featured jobs
  const featuredJobs = await db.job.findMany({
    where: {
      status: 'ACTIVE',
      isFeatured: true,
      featuredUntil: {
        gte: new Date(),
      },
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
            <GlassCard className="text-center">
              <Briefcase className="w-8 h-8 text-ice-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{jobs.length}+</div>
              <div className="text-sm text-silver-400">Active Jobs</div>
            </GlassCard>
            <GlassCard className="text-center">
              <TrendingUp className="w-8 h-8 text-ice-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">$249</div>
              <div className="text-sm text-silver-400">30-Day Listing</div>
            </GlassCard>
            <GlassCard className="text-center">
              <Shield className="w-8 h-8 text-ice-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Verified</div>
              <div className="text-sm text-silver-400">Premium Quality</div>
            </GlassCard>
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

      {/* Main Content with Sidebar */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Filter Sidebar */}
            <FilterSidebar
              category={category}
              type={type}
              shift={shift}
              clearance={clearance}
              certifications={certifications}
            />

            {/* Job Listings */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {category || type || shift || clearance || certifications || 'All Jobs'} ({jobs.length})
                </h2>
                <SortSelect />
              </div>

              {jobs.length === 0 ? (
                <GlassCard className="text-center py-12">
                  <p className="text-silver-400 text-lg">
                    No jobs found. Try adjusting your filters.
                  </p>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto max-w-2xl">
          <Newsletter />
        </div>
      </section>
    </main>
  );
}
