'use client';

import Link from 'next/link';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { SaveJobButton } from './SaveJobButton';
import { format } from 'date-fns';

interface JobCardProps {
  job: {
    id: string;
    slug: string;
    title: string;
    company: string;
    companyLogo?: string | null;
    location: string;
    type: string;
    category: string;
    salary?: string | null;
    isFeatured: boolean;
    createdAt: Date;
    tags: string[];
  };
  isSaved?: boolean;
  showSaveButton?: boolean;
}

export function JobCard({ job, isSaved = false, showSaveButton = false }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.slug}`}>
      <GlassCard hover className="relative">
        {job.isFeatured && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover glass"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg glass flex items-center justify-center text-ice-400 font-bold">
                {job.company.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {job.title}
              </h3>
              <p className="text-silver-300">{job.company}</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-sm text-silver-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.type}
            </div>
            {job.salary && (
              <div className="flex items-center gap-1 text-ice-400 font-medium">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full glass text-xs text-ice-400 border border-ice-500/30">
              {job.category}
            </span>
            <span className="text-xs text-silver-500">
              {format(new Date(job.createdAt), 'MMM d, yyyy')}
            </span>
          </div>

          {/* Tags */}
          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded text-xs text-silver-400 bg-white/5 inline-flex items-center"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 5 && (
                <span className="px-2 py-1 rounded text-xs text-silver-500">
                  +{job.tags.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bookmark Button - Bottom Right */}
        {showSaveButton && (
          <div className="absolute bottom-6 right-6">
            <SaveJobButton
              jobId={job.id}
              initialSaved={isSaved}
              className="p-2 rounded-lg glass-hover"
            />
          </div>
        )}
      </GlassCard>
    </Link>
  );
}
