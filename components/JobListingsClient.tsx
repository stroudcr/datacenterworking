'use client';

import { Fragment, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FilterSidebar } from '@/components/FilterSidebar';
import { JobCard } from '@/components/JobCard';
import { GlassCard } from '@/components/GlassCard';
import { SortSelect } from '@/components/SortSelect';
import { ArrowRight, Bell, SlidersHorizontal } from 'lucide-react';
import type { PublicJobListing } from '@/lib/public-job-types';

interface JobListingsClientProps {
  jobs: PublicJobListing[];
  initialCategory?: string;
  initialType?: string;
  initialShift?: string;
  initialClearance?: string;
  initialCertifications?: string;
  initialSort?: string;
  basePath?: string;
  hideListHeader?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function JobListingsClient({
  jobs,
  basePath,
  hideListHeader = false,
  emptyTitle = 'No jobs found',
  emptyDescription = 'Try adjusting your filters.',
}: JobListingsClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortTimestamp] = useState(() => Date.now());
  const searchParams = useSearchParams();

  // The URL is the source of truth so removing a filter cannot revive its stale
  // server-rendered initial value after a native history update.
  const category = searchParams.get('category') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const shift = searchParams.get('shift') ?? undefined;
  const clearance = searchParams.get('clearance') ?? undefined;
  const certifications = searchParams.get('certifications') ?? undefined;
  const sort = searchParams.get('sort') ?? 'latest';

  // Client-side filtering and sorting
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs;

    // Apply filters
    if (category) {
      filtered = filtered.filter(job => job.category === category);
    }
    if (type) {
      filtered = filtered.filter(job => job.type === type);
    }
    if (shift) {
      filtered = filtered.filter(job => job.shift === shift);
    }
    if (clearance) {
      filtered = filtered.filter(job => job.clearance === clearance);
    }
    if (certifications) {
      filtered = filtered.filter(job => job.certifications === certifications);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const aFeatured = a.isFeatured && a.featuredUntil && new Date(a.featuredUntil).getTime() >= sortTimestamp ? 1 : 0;
      const bFeatured = b.isFeatured && b.featuredUntil && new Date(b.featuredUntil).getTime() >= sortTimestamp ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      if (sort === 'applications') {
        return b.applicationCount - a.applicationCount;
      }
      // Default: latest (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [jobs, category, type, shift, clearance, certifications, sort, sortTimestamp]);

  const activeFilterCount = [category, type, shift, clearance, certifications].filter(Boolean).length;

  if (jobs.length === 0) {
    return (
      <GlassCard className="py-14 text-center md:py-18">
        <h3 className="text-2xl font-semibold text-white">{emptyTitle}</h3>
        <p className="mx-auto mt-3 max-w-2xl text-silver-400">{emptyDescription}</p>
      </GlassCard>
    );
  }

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 px-4 py-3 bg-ice-500 rounded-full shadow-lg hover:bg-ice-600 transition-[background-color,transform] hover:scale-105 flex items-center gap-2"
      >
        <SlidersHorizontal className="w-5 h-5 text-white" />
        <span className="text-sm font-medium text-white">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-white/20 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar
          category={category}
          type={type}
          shift={shift}
          clearance={clearance}
          certifications={certifications}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          basePath={basePath}
        />

        {/* Job Listings */}
        <div>
          {!hideListHeader && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {category || type || shift || clearance || certifications || 'All Jobs'} ({filteredAndSortedJobs.length})
              </h2>
              <SortSelect basePath={basePath} />
            </div>
          )}

          {filteredAndSortedJobs.length === 0 ? (
            <GlassCard className="text-center py-12">
              <h3 className="text-xl font-semibold text-white">{emptyTitle}</h3>
              <p className="mt-2 text-silver-400">{emptyDescription}</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredAndSortedJobs.map((job, index) => (
                <Fragment key={job.id}>
                  <JobCard job={job} />
                  {index === 9 ? (
                    <aside
                      aria-label="Job alerts"
                      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ice-500/10 text-ice-400">
                          <Bell className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-medium text-silver-100">Want the next role to find you?</p>
                          <p className="text-sm text-silver-400">Get new data center jobs delivered to your inbox.</p>
                        </div>
                      </div>
                      <Link
                        href="/job-alerts"
                        className="group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ice-400 transition-colors hover:text-ice-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-400 focus-visible:ring-offset-2 focus-visible:ring-offset-silver-900 sm:self-auto"
                      >
                        Get job alerts
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </aside>
                  ) : null}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
