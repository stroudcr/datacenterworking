'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Eye, Users, Calendar, AlertCircle, CheckCircle, Trash2, Edit3 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { format } from 'date-fns';

export default function ManageJobPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const token = searchParams.get('token');

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid management link');
      setLoading(false);
      return;
    }

    fetchJob();
  }, [jobId, token]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/manage/${jobId}?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch job');
      }

      setJob(data.job);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/jobs/manage/${jobId}?token=${token}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      router.push('/?deleted=true');
    } catch (err: any) {
      setError(err.message);
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-silver-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <GlassCard className="text-center">
            <div className="inline-flex p-4 rounded-full bg-red-500/20 mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Invalid Management Link
            </h1>
            <p className="text-silver-400 mb-6">
              This link may have expired or is invalid. Please check your email for the correct link.
            </p>
            <Link href="/">
              <Button variant="primary">Go to Homepage</Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  const isExpired = new Date(job.expiresAt) < new Date();
  const isFeaturedActive = job.isFeatured && job.featuredUntil && new Date(job.featuredUntil) > new Date();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Manage Your Job</h1>
          <p className="text-silver-400">
            View and manage your job posting
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Views</p>
                <p className="text-2xl font-bold text-white">{job.viewCount}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Applications</p>
                <p className="text-2xl font-bold text-white">{job.applicationCount}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-ice-500/20">
                <Calendar className="w-5 h-5 text-ice-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">
                  {isExpired ? 'Expired' : 'Expires'}
                </p>
                <p className="text-lg font-bold text-white">
                  {format(new Date(job.expiresAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Job Details */}
        <GlassCard className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {job.title}
              </h2>
              <p className="text-silver-400 mb-3">
                {job.company} • {job.location}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full glass text-sm text-silver-300">
                  {job.type}
                </span>
                <span className="px-3 py-1 rounded-full glass text-sm text-silver-300">
                  {job.category}
                </span>
                {isFeaturedActive && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold">
                    Featured
                  </span>
                )}
                {isExpired && (
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold">
                    Expired
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-silver-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Description</h3>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Requirements</h3>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </div>

            {job.tags && job.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-2">Skills & Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full glass text-sm text-ice-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
            <Link href={`/jobs/${job.slug}`} className="flex-1">
              <Button variant="secondary" fullWidth>
                <Eye className="w-4 h-4 mr-2" />
                View Public Listing
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        </GlassCard>

        {/* Create Account CTA */}
        {job.userId === null && (
          <GlassCard className="bg-gradient-to-br from-ice-500/20 to-purple-500/20 border-ice-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ice-500/20">
                <CheckCircle className="w-6 h-6 text-ice-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Want to do more with your job posting?
                </h3>
                <p className="text-silver-300 text-sm mb-4">
                  Create a free employer account to edit your job, track detailed analytics, and post multiple jobs from one dashboard.
                </p>
                <Link href={`/register?email=${encodeURIComponent(job.email)}&role=EMPLOYER`}>
                  <Button variant="primary">
                    Create Free Employer Account
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <GlassCard className="max-w-md w-full">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-red-500/20 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Delete Job Posting?
                </h3>
                <p className="text-silver-400">
                  This action cannot be undone. Your job posting will be permanently removed.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Job'}
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
