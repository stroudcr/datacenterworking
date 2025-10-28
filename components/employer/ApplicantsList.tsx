'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Mail, Clock, Eye, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Application {
  id: string;
  coverLetter: string | null;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ApplicantsListProps {
  jobId: string;
  applications: Application[];
}

export function ApplicantsList({ jobId, applications }: ApplicantsListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hasMarkedReviewed, setHasMarkedReviewed] = useState(false);

  // Auto-mark pending applications as reviewed when page loads
  useEffect(() => {
    const markAsReviewed = async () => {
      if (hasMarkedReviewed) return;

      try {
        const response = await fetch('/api/applications/bulk-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobId }),
        });

        if (response.ok) {
          setHasMarkedReviewed(true);
          // Optionally refresh the page to show updated statuses
          // window.location.reload();
        }
      } catch (error) {
        console.error('Failed to mark applications as reviewed:', error);
      }
    };

    markAsReviewed();
  }, [jobId, hasMarkedReviewed]);

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Eye className="w-3 h-3 mr-1" />
            Reviewed
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-silver-500/10 text-silver-400 border border-silver-500/30">
            Position Closed
          </span>
        );
      default:
        return null;
    }
  };

  if (applications.length === 0) {
    return (
      <GlassCard>
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-silver-600 mx-auto mb-4" />
          <p className="text-silver-400 mb-4">No applications yet</p>
          <p className="text-sm text-silver-500">
            Applications will appear here when job seekers apply to this position
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-ice-500 text-white'
              : 'glass text-silver-300 hover:bg-white/10'
          }`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-amber-500 text-white'
              : 'glass text-silver-300 hover:bg-white/10'
          }`}
        >
          Pending ({applications.filter((a) => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('reviewed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'reviewed'
              ? 'bg-blue-500 text-white'
              : 'glass text-silver-300 hover:bg-white/10'
          }`}
        >
          Reviewed ({applications.filter((a) => a.status === 'reviewed').length})
        </button>
      </div>

      {/* Applicants List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <GlassCard key={application.id} className="hover:bg-white/10 transition-all">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {application.user.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-silver-400">
                    <a
                      href={`mailto:${application.user.email}`}
                      className="inline-flex items-center gap-1 text-ice-400 hover:text-ice-300 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {application.user.email}
                    </a>
                    <span>•</span>
                    <span>Applied {format(new Date(application.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(application.status)}
                </div>
              </div>

              {/* Cover Letter */}
              {application.coverLetter && (
                <div>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === application.id ? null : application.id)
                    }
                    className="flex items-center gap-2 text-sm text-ice-400 hover:text-ice-300 transition-colors"
                  >
                    {expandedId === application.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Cover Letter
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        View Cover Letter
                      </>
                    )}
                  </button>

                  {expandedId === application.id && (
                    <div className="mt-3 p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-silver-300 whitespace-pre-wrap">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-8">
          <p className="text-silver-400">No {filter} applications</p>
        </div>
      )}
    </div>
  );
}
