import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Briefcase, FileText, Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { format } from 'date-fns';

interface PageProps {
  searchParams: Promise<{ jobId?: string }>;
}

export default async function ApplicationSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const jobId = params.jobId;

  if (!jobId) {
    redirect('/');
  }

  const session = await getSession();
  if (!session || session.role !== 'JOB_SEEKER') {
    redirect('/login');
  }

  // Get the job details
  const job = await db.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    redirect('/');
  }

  // Get the application details
  const application = await db.application.findUnique({
    where: {
      jobId_userId: {
        jobId: job.id,
        userId: session.userId,
      },
    },
  });

  if (!application) {
    redirect(`/jobs/${job.slug}`);
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Application Submitted!
          </h1>
          <p className="text-xl text-silver-400">
            Your application has been sent to the employer
          </p>
        </div>

        {/* Application Summary */}
        <GlassCard className="mb-6">
          <div className="flex items-start gap-4 mb-4 pb-4 border-b border-white/10">
            <div className="p-3 rounded-lg bg-ice-500/20">
              <Briefcase className="w-6 h-6 text-ice-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-1">
                {job.title}
              </h2>
              <div className="flex flex-wrap gap-3 text-silver-400 text-sm">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-silver-300">
            <div className="flex justify-between">
              <span>Application submitted:</span>
              <span className="text-white font-medium">
                {format(new Date(application.createdAt), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Application status:</span>
              <span className="text-white font-medium capitalize">
                <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
                  Pending Review
                </span>
              </span>
            </div>
            {application.coverLetter && (
              <div className="flex justify-between">
                <span>Cover letter:</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Included
                </span>
              </div>
            )}
            {application.resume && (
              <div className="flex justify-between">
                <span>Resume:</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Attached
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link href={`/jobs/${job.slug}`}>
              <Button variant="outline" fullWidth>
                View Job Posting Again
              </Button>
            </Link>
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            What Happens Next?
          </h3>
          <div className="space-y-3 text-silver-300">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ice-500 text-white text-sm font-semibold flex items-center justify-center">
                1
              </div>
              <div>
                <p className="font-medium text-white">Your application is under review</p>
                <p className="text-sm text-silver-400">
                  The employer will review your application materials
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ice-500 text-white text-sm font-semibold flex items-center justify-center">
                2
              </div>
              <div>
                <p className="font-medium text-white">Keep an eye on your email</p>
                <p className="text-sm text-silver-400">
                  The employer will contact you directly if they're interested
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ice-500 text-white text-sm font-semibold flex items-center justify-center">
                3
              </div>
              <div>
                <p className="font-medium text-white">Track your applications</p>
                <p className="text-sm text-silver-400">
                  View all your applications and their status in your dashboard
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tips */}
        <GlassCard className="mb-6 bg-gradient-to-br from-ice-500/10 to-purple-500/10 border-ice-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Tips While You Wait
          </h3>
          <div className="space-y-2 text-sm text-silver-300">
            <p className="flex items-start gap-2">
              <span className="text-ice-400 mt-1">•</span>
              <span>Continue applying to other positions to increase your chances</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-ice-400 mt-1">•</span>
              <span>Keep your email notifications on to respond promptly to employers</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-ice-400 mt-1">•</span>
              <span>Research the company to prepare for potential interviews</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-ice-400 mt-1">•</span>
              <span>Update your skills and certifications to stand out</span>
            </p>
          </div>
        </GlassCard>

        {/* Call to Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/seeker">
            <Button variant="primary" fullWidth size="lg">
              Go to My Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" fullWidth size="lg">
              Browse More Jobs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
