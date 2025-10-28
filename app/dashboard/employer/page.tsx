import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import Link from 'next/link';
import {
  Briefcase,
  Eye,
  Users,
  DollarSign,
  Star,
  Plus,
  Trash2,
  Edit,
  Clock,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

export default async function EmployerDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'EMPLOYER') {
    redirect('/login');
  }

  // Fetch user's jobs
  const jobs = await db.job.findMany({
    where: {
      userId: session.userId,
      status: { not: 'DELETED' },
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate stats
  const activeJobs = jobs.filter((j) => j.status === 'ACTIVE').length;
  const totalViews = jobs.reduce((sum, j) => sum + j.viewCount, 0);
  const totalApplications = jobs.reduce((sum, j) => sum + j.applicationCount, 0);
  const featuredJobs = jobs.filter((j) => j.isFeatured && j.featuredUntil && new Date(j.featuredUntil) > new Date()).length;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Employer Dashboard</h1>
            <p className="text-silver-400">Manage your job postings and view analytics</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/employer/settings">
              <Button variant="secondary" size="lg">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </Link>
            <Link href="/post-job">
              <Button variant="primary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-ice-500/20">
                <Briefcase className="w-6 h-6 text-ice-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Active Jobs</p>
                <p className="text-2xl font-bold text-white">{activeJobs}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Total Views</p>
                <p className="text-2xl font-bold text-white">{totalViews}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Applications</p>
                <p className="text-2xl font-bold text-white">{totalApplications}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Featured</p>
                <p className="text-2xl font-bold text-white">{featuredJobs}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Jobs List */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Your Job Postings</h2>
            <div className="flex gap-2">
              <select className="glass rounded-lg px-4 py-2 text-white text-sm">
                <option value="all">All Jobs</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-silver-600 mx-auto mb-4" />
              <p className="text-silver-400 mb-4">You haven't posted any jobs yet</p>
              <Link href="/post-job">
                <Button variant="primary">Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const isExpired = new Date(job.expiresAt) < new Date();
                const isFeaturedActive = job.isFeatured && job.featuredUntil && new Date(job.featuredUntil) > new Date();

                return (
                  <div
                    key={job.id}
                    className="glass rounded-lg p-6 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            href={`/jobs/${job.slug}`}
                            className="text-xl font-semibold text-white hover:text-ice-400 transition-colors"
                          >
                            {job.title}
                          </Link>
                          {isFeaturedActive && (
                            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </span>
                          )}
                          {isExpired && (
                            <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                              Expired
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-silver-400 mb-3">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                          <span>•</span>
                          <span>{job.category}</span>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-2 text-silver-300">
                            <Eye className="w-4 h-4" />
                            {job.viewCount} views
                          </div>
                          <Link href={`/dashboard/employer/jobs/${job.id}/applicants`}>
                            <div className="flex items-center gap-2 text-ice-400 hover:text-ice-300 transition-colors cursor-pointer">
                              <Users className="w-4 h-4" />
                              {job.applicationCount} applications
                            </div>
                          </Link>
                          <div className="flex items-center gap-2 text-silver-300">
                            <Clock className="w-4 h-4" />
                            Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                          </div>
                          {!isExpired && (
                            <div className="flex items-center gap-2 text-silver-300">
                              Expires {format(new Date(job.expiresAt), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/dashboard/employer/jobs/${job.id}/applicants`}>
                          <Button variant="secondary" size="sm">
                            <Users className="w-4 h-4 mr-1" />
                            View Applicants
                          </Button>
                        </Link>
                        <Link href={`/jobs/${job.slug}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <form action={`/api/jobs/${job.id}/delete`} method="POST">
                          <Button variant="ghost" size="sm" type="submit">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-3">Need More Visibility?</h3>
            <p className="text-silver-400 text-sm mb-4">
              Upgrade to a featured listing to get 7 days of homepage placement, priority in search, and social media promotion.
            </p>
            <Link href="/post-job">
              <Button variant="primary" fullWidth>
                <Star className="w-4 h-4 mr-2" />
                Post Featured Job
              </Button>
            </Link>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-3">Pricing</h3>
            <div className="space-y-2 text-sm text-silver-300 mb-4">
              <div className="flex justify-between">
                <span>30-Day Listing</span>
                <span className="text-white font-semibold">$249</span>
              </div>
              <div className="flex justify-between">
                <span>Featured Upgrade</span>
                <span className="text-white font-semibold">+$149</span>
              </div>
            </div>
            <p className="text-xs text-silver-500">
              All listings include unlimited edits and automatically expire after 30 days.
            </p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
