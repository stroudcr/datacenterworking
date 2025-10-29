'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterSidebar } from '@/components/FilterSidebar';
import { JobCard } from '@/components/JobCard';
import { GlassCard } from '@/components/GlassCard';
import { SortSelect } from '@/components/SortSelect';
import { SlidersHorizontal } from 'lucide-react';
import type { Job } from '@prisma/client';

interface JobListingsClientProps {
  jobs: Job[];
  initialCategory?: string;
  initialType?: string;
  initialShift?: string;
  initialClearance?: string;
  initialCertifications?: string;
  initialSort?: string;
}

export function JobListingsClient({
  jobs,
  initialCategory,
  initialType,
  initialShift,
  initialClearance,
  initialCertifications,
  initialSort,
}: JobListingsClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();

  // Get current filters from URL (for instant updates)
  const category = searchParams.get('category') || initialCategory;
  const type = searchParams.get('type') || initialType;
  const shift = searchParams.get('shift') || initialShift;
  const clearance = searchParams.get('clearance') || initialClearance;
  const certifications = searchParams.get('certifications') || initialCertifications;
  const sort = searchParams.get('sort') || initialSort || 'latest';

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
      if (sort === 'applications') {
        return b.applicationCount - a.applicationCount;
      }
      // Default: latest (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [jobs, category, type, shift, clearance, certifications, sort]);

  const activeFilterCount = [category, type, shift, clearance, certifications].filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 px-4 py-3 glass rounded-full shadow-lg hover:bg-white/20 transition-all flex items-center gap-2"
      >
        <SlidersHorizontal className="w-5 h-5 text-white" />
        <span className="text-sm font-medium text-white">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-ice-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
        />

        {/* Job Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {category || type || shift || clearance || certifications || 'All Jobs'} ({filteredAndSortedJobs.length})
            </h2>
            <SortSelect />
          </div>

          {filteredAndSortedJobs.length === 0 ? (
            <GlassCard className="text-center py-12">
              <p className="text-silver-400 text-lg">
                No jobs found. Try adjusting your filters.
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredAndSortedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
