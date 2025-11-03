import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { GlassCard } from '@/components/GlassCard';
import { ApplicantsList } from '@/components/employer/ApplicantsList';
import { ArrowLeft, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await getSession();
  const { jobId } = await params;

  if (!session || session.role !== 'EMPLOYER') {
    redirect('/login');
  }

  // Fetch the job with applications
  const job = await db.job.findUnique({
    where: { id: jobId },
    include: {
      applications: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!job) {
    redirect('/dashboard/employer');
  }

  // Verify employer owns this job
  if (job.userId !== session.userId) {
    redirect('/dashboard/employer');
  }

  // Calculate stats
  const totalApplications = job.applications.length;
  const pendingApplications = job.applications.filter((a) => a.status === 'pending').length;
  const reviewedApplications = job.applications.filter((a) => a.status === 'reviewed').length;

  return (
    <main className="min-h-screen py-6 sm:py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard/employer"
            className="inline-flex items-center text-sm sm:text-base text-ice-400 hover:text-ice-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4">
            <div className="p-2.5 sm:p-3 rounded-lg bg-ice-500/20 w-fit">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-ice-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{job.title}</h1>
              <p className="text-sm sm:text-base text-silver-400">
                {job.location} • {job.type}
                <span className="hidden sm:inline"> • {job.category}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-ice-500/20">
                <Users className="w-6 h-6 text-ice-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Total Applications</p>
                <p className="text-2xl font-bold text-white">{totalApplications}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Pending</p>
                <p className="text-2xl font-bold text-white">{pendingApplications}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Reviewed</p>
                <p className="text-2xl font-bold text-white">{reviewedApplications}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Applicants List */}
        <ApplicantsList jobId={jobId} applications={job.applications} />
      </div>
    </main>
  );
}
