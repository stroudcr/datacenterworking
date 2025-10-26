'use client';

import { useState } from 'react';
import { FilterSidebar } from '@/components/FilterSidebar';
import { JobCard } from '@/components/JobCard';
import { GlassCard } from '@/components/GlassCard';
import { SortSelect } from '@/components/SortSelect';
import { SlidersHorizontal } from 'lucide-react';
import type { Job } from '@prisma/client';

interface JobListingsClientProps {
  jobs: Job[];
  category?: string;
  type?: string;
  shift?: string;
  clearance?: string;
  certifications?: string;
}

export function JobListingsClient({
  jobs,
  category,
  type,
  shift,
  clearance,
  certifications,
}: JobListingsClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
    </>
  );
}
