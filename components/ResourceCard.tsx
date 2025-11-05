'use client';

import Link from 'next/link';
import { FileText, Clock, Calendar, Tag } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { format } from 'date-fns';
import { Resource } from '@/lib/resources-data';

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Industry Reports':
        return 'from-blue-500 to-cyan-500';
      case 'Career Guides':
        return 'from-green-500 to-emerald-500';
      case 'Certifications':
        return 'from-purple-500 to-pink-500';
      case 'News':
        return 'from-orange-500 to-amber-500';
      case 'Best Practices':
        return 'from-indigo-500 to-blue-500';
      default:
        return 'from-ice-500 to-silver-500';
    }
  };

  return (
    <Link href={`/resources/${resource.slug}`}>
      <GlassCard hover className="h-full">
        <div className="space-y-4">
          {/* Icon and Category Badge */}
          <div className="flex items-start justify-between gap-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(resource.category)} flex items-center justify-center`}>
              <FileText className="w-6 h-6 text-white" />
            </div>

            <span className="px-3 py-1 rounded-full glass text-xs text-ice-400 border border-ice-500/30">
              {resource.category}
            </span>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-silver-300 text-sm line-clamp-3">
              {resource.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-xs text-silver-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(resource.date), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {resource.readTime}
            </div>
            {resource.author && (
              <div className="flex items-center gap-1">
                By {resource.author}
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-silver-400 bg-white/5"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className="px-2 py-1 rounded text-xs text-silver-500">
                  +{resource.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}
