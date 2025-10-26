'use client';

import { MapPin, Clock, DollarSign, Bookmark, Star } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { format } from 'date-fns';

interface JobCardPreviewProps {
  title?: string;
  company?: string;
  companyLogo?: string;
  location?: string;
  type?: string;
  category?: string;
  salary?: string;
  hourlyRate?: string;
  isFeatured?: boolean;
  tags?: string[];
}

export function JobCardPreview({
  title,
  company,
  companyLogo,
  location,
  type,
  category,
  salary,
  hourlyRate,
  isFeatured,
  tags = [],
}: JobCardPreviewProps) {
  // Use salary if available, otherwise use hourlyRate
  const displaySalary = salary || hourlyRate;

  return (
    <div>
      <GlassCard className="relative">
        {isFeatured && (
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
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={company || 'Company'}
                className="w-12 h-12 rounded-lg object-cover glass"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg glass flex items-center justify-center text-ice-400 font-bold">
                {company ? company.charAt(0).toUpperCase() : '?'}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {title || 'Job Title'}
              </h3>
              <p className="text-silver-300">{company || 'Company Name'}</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-sm text-silver-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location || 'Location'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {type || 'Job Type'}
            </div>
            {displaySalary && (
              <div className="flex items-center gap-1 text-ice-400 font-medium">
                <DollarSign className="w-4 h-4" />
                {displaySalary}
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full glass text-xs text-ice-400 border border-ice-500/30">
              {category || 'Category'}
            </span>
            <span className="text-xs text-silver-500">
              {format(new Date(), 'MMM d, yyyy')}
            </span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded text-xs text-silver-400 bg-white/5"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 5 && (
                <span className="px-2 py-1 rounded text-xs text-silver-500">
                  +{tags.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bookmark Button - Bottom Right */}
        <div className="absolute bottom-6 right-6">
          <button
            className="p-2 rounded-lg glass-hover cursor-default"
            onClick={(e) => e.preventDefault()}
          >
            <Bookmark className="w-5 h-5 text-silver-400" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
