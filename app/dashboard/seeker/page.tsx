import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { GlassCard } from '@/components/GlassCard';
import { JobCard } from '@/components/JobCard';
import { Button } from '@/components/Button';
import Link from 'next/link';
import {
  Bookmark,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Settings,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

export default async function SeekerDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'JOB_SEEKER') {
    redirect('/login');
  }

  // Fetch saved jobs
  const savedJobs = await db.savedJob.findMany({
    where: {
      userId: session.userId,
    },
    include: {
      job: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch applications
  const applications = await db.application.findMany({
    where: {
      userId: session.userId,
    },
    include: {
      job: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate stats
  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a) => a.status === 'pending').length;
  const reviewedApplications = applications.filter((a) => a.status === 'reviewed').length;
  const totalSaved = savedJobs.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'reviewed':
        return <Eye className="w-4 h-4 text-blue-400" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-silver-400" />;
      default:
        return <Clock className="w-4 h-4 text-silver-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'reviewed':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'closed':
        return 'text-silver-400 bg-white/5 border-white/10';
      default:
        return 'text-silver-400 bg-white/5 border-white/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Application Submitted';
      case 'reviewed':
        return 'Application Viewed';
      case 'closed':
        return 'Position Closed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Job Seeker Dashboard</h1>
            <p className="text-silver-400">Track your applications and saved jobs</p>
          </div>
          <Link href="/dashboard/seeker/settings">
            <Button variant="secondary" size="lg">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-ice-500/20">
                <FileText className="w-6 h-6 text-ice-400" />
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
                <Clock className="w-6 h-6 text-amber-400" />
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
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Reviewed</p>
                <p className="text-2xl font-bold text-white">{reviewedApplications}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Bookmark className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-silver-400">Saved Jobs</p>
                <p className="text-2xl font-bold text-white">{totalSaved}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Applications Section */}
        <GlassCard className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">My Applications</h2>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-silver-600 mx-auto mb-4" />
              <p className="text-silver-400 mb-4">You haven't applied to any jobs yet</p>
              <Link href="/">
                <Button variant="primary">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="glass rounded-lg p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/jobs/${application.job.slug}`}
                          className="text-xl font-semibold text-white hover:text-ice-400 transition-colors"
                        >
                          {application.job.title}
                        </Link>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {getStatusLabel(application.status)}
                        </span>
                      </div>

                      <p className="text-silver-300 mb-3">{application.job.company}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-silver-400">
                        <span>{application.job.location}</span>
                        <span>•</span>
                        <span>{application.job.type}</span>
                        <span>•</span>
                        <span>Applied {format(new Date(application.createdAt), 'MMM d, yyyy')}</span>
                      </div>

                      {application.coverLetter && (
                        <details className="mt-3">
                          <summary className="text-sm text-ice-400 cursor-pointer hover:text-ice-300">
                            View cover letter
                          </summary>
                          <p className="mt-2 text-sm text-silver-300 whitespace-pre-wrap p-3 glass rounded">
                            {application.coverLetter}
                          </p>
                        </details>
                      )}
                    </div>

                    <Link href={`/jobs/${application.job.slug}`}>
                      <Button variant="secondary" size="sm">
                        View Job
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Saved Jobs Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Saved Jobs</h2>

          {savedJobs.length === 0 ? (
            <GlassCard>
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-silver-600 mx-auto mb-4" />
                <p className="text-silver-400 mb-4">No saved jobs yet</p>
                <p className="text-sm text-silver-500 mb-4">
                  Save jobs you're interested in to review them later
                </p>
                <Link href="/">
                  <Button variant="primary">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savedJobs.map((saved) => (
                <JobCard key={saved.id} job={saved.job} />
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-3">Job Search Tips</h3>
            <ul className="space-y-2 text-sm text-silver-300">
              <li>• Set up email alerts for your preferred categories</li>
              <li>• Apply early - jobs get competitive quickly</li>
              <li>• Customize your cover letter for each application</li>
              <li>• Save interesting jobs to review later</li>
            </ul>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-3">Application Status Guide</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-silver-300"><strong className="text-white">Application Submitted:</strong> Your application has been received</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-silver-300"><strong className="text-white">Application Viewed:</strong> Employer has reviewed your application</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-silver-400" />
                <span className="text-silver-300"><strong className="text-white">Position Closed:</strong> This position is no longer available</span>
              </div>
            </div>
            <p className="text-xs text-silver-500 mt-4">
              If an employer is interested, they will contact you directly via email.
            </p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
