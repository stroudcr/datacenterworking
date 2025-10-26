import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import Link from 'next/link';
import {
  Shield,
  Briefcase,
  Users,
  DollarSign,
  Eye,
  Trash2,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

export default async function AdminPanel() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch all jobs
  const jobs = await db.job.findMany({
    where: {
      status: { not: 'DELETED' },
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch stats
  const totalUsers = await db.user.count();
  const totalJobs = await db.job.count({ where: { status: 'ACTIVE' } });
  const totalPayments = await db.payment.count({ where: { status: 'completed' } });
  const totalRevenue = await db.payment.aggregate({
    where: { status: 'completed' },
    _sum: { amount: true },
  });

  const revenue = (totalRevenue._sum.amount || 0) / 100;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-ice-400" />
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-silver-400">Moderate jobs and view platform analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-ice-500/20">
                <Users className="w-6 h-6 text-ice-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{totalUsers}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Briefcase className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Active Jobs</p>
                <p className="text-2xl font-bold text-white">{totalJobs}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${revenue.toFixed(0)}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Eye className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Payments</p>
                <p className="text-2xl font-bold text-white">{totalPayments}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Jobs Management */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">All Job Postings</h2>
            <div className="flex gap-2">
              <select className="glass rounded-lg px-4 py-2 text-white text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
              <select className="glass rounded-lg px-4 py-2 text-white text-sm">
                <option value="all">All Categories</option>
                <option value="featured">Featured Only</option>
              </select>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-silver-600 mx-auto mb-4" />
              <p className="text-silver-400">No jobs to display</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-silver-400">Job</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-silver-400">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-silver-400">Posted By</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-silver-400">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-silver-400">Stats</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-silver-400">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-silver-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const isExpired = new Date(job.expiresAt) < new Date();

                    return (
                      <tr key={job.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-4">
                          <div>
                            <Link
                              href={`/jobs/${job.slug}`}
                              className="font-medium text-white hover:text-ice-400 transition-colors"
                            >
                              {job.title}
                            </Link>
                            <div className="text-sm text-silver-400 mt-1">
                              {job.location} • {job.type}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-silver-300">{job.company}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="text-silver-300">{job.user.name}</div>
                            <div className="text-silver-500">{job.user.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-silver-400">
                            {job.category.split('&')[0].trim()}...
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-silver-400">
                            <div>{job.viewCount} views</div>
                            <div>{job.applicationCount} applies</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            {job.isFeatured && (
                              <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit">
                                Featured
                              </span>
                            )}
                            {isExpired ? (
                              <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30 w-fit">
                                Expired
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30 w-fit">
                                Active
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/jobs/${job.slug}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                            <form action={`/api/admin/jobs/${job.id}/delete`} method="POST">
                              <Button variant="ghost" size="sm" type="submit">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        {/* Warning */}
        <GlassCard className="mt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-1">Admin Actions</h3>
              <p className="text-sm text-silver-400">
                Deleting a job will permanently remove it from the platform and cannot be undone.
                Users will no longer be able to view or apply to deleted jobs.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
