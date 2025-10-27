import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Star,
  Building2,
  Calendar,
  Eye,
  Users,
  ExternalLink,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { isLegacyId } from '@/lib/slugify';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const session = await getSession();

  // Check if this is an old-style ID URL and redirect if so
  if (isLegacyId(slug)) {
    const job = await db.job.findUnique({
      where: { id: slug },
      select: { slug: true },
    });
    if (job) {
      redirect(`/jobs/${job.slug}`);
    }
    notFound();
  }

  // Fetch job by slug
  const job = await db.job.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          company: true,
        },
      },
    },
  });

  if (!job || job.status !== 'ACTIVE') {
    notFound();
  }

  // Increment view count
  await db.job.update({
    where: { id: job.id },
    data: { viewCount: { increment: 1 } },
  });

  // Check if user has saved this job
  let isSaved = false;
  let hasApplied = false;
  if (session) {
    const savedJob = await db.savedJob.findUnique({
      where: {
        jobId_userId: {
          jobId: job.id,
          userId: session.userId,
        },
      },
    });
    isSaved = !!savedJob;

    // Check if already applied
    const application = await db.application.findUnique({
      where: {
        jobId_userId: {
          jobId: job.id,
          userId: session.userId,
        },
      },
    });
    hasApplied = !!application;
  }

  const isExpired = new Date(job.expiresAt) < new Date();

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-silver-400 hover:text-white mb-6 transition-colors">
          ← Back to Jobs
        </Link>

        {/* Header Card */}
        <GlassCard className="mb-6">
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-20 h-20 rounded-xl object-cover glass"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl glass flex items-center justify-center text-2xl text-ice-400 font-bold">
                {job.company.charAt(0)}
              </div>
            )}

            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  {job.isFeatured && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold mb-2">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-silver-300">
                    <Building2 className="w-5 h-5" />
                    <span className="text-lg">{job.company}</span>
                  </div>
                </div>

                {/* Actions */}
                {session && session.role === 'JOB_SEEKER' && (
                  <div className="flex gap-2">
                    <form action="/api/jobs/save" method="POST">
                      <input type="hidden" name="jobId" value={job.id} />
                      <Button
                        type="submit"
                        variant={isSaved ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-silver-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {job.type}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2 text-ice-400 font-medium">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mt-4 text-sm text-silver-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {job.viewCount} views
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {job.applicationCount} applicants
                </div>
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 rounded-full glass text-sm text-ice-400 border border-ice-500/30">
                {job.category}
              </span>
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/5 text-sm text-silver-400 inline-flex items-center"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-4">
                Job Description
              </h2>
              <div className="prose prose-invert prose-ice max-w-none">
                <p className="text-silver-300 whitespace-pre-wrap leading-relaxed">
                  {job.description}
                </p>
              </div>
            </GlassCard>

            {/* Requirements */}
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-4">
                Requirements
              </h2>
              <div className="prose prose-invert prose-ice max-w-none">
                <p className="text-silver-300 whitespace-pre-wrap leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">
                Apply for this job
              </h3>

              {!session ? (
                <div className="space-y-3">
                  <p className="text-sm text-silver-400 mb-4">
                    Sign in or create an account to apply
                  </p>
                  <Link href="/login">
                    <Button variant="primary" fullWidth>
                      Sign In to Apply
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" fullWidth>
                      Create Account
                    </Button>
                  </Link>
                </div>
              ) : session.role === 'EMPLOYER' ? (
                <p className="text-sm text-silver-400">
                  Employer accounts cannot apply to jobs.
                </p>
              ) : hasApplied ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm">
                    ✓ You have already applied to this job
                  </div>
                  <Link href="/dashboard/seeker">
                    <Button variant="secondary" fullWidth>
                      View Application
                    </Button>
                  </Link>
                </div>
              ) : isExpired ? (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                  This job posting has expired
                </div>
              ) : (
                <div className="space-y-3">
                  {job.applyUrl && (
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" fullWidth>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply on Company Site
                      </Button>
                    </a>
                  )}
                  {job.applyEmail && (
                    <a href={`mailto:${job.applyEmail}`}>
                      <Button variant={job.applyUrl ? 'outline' : 'primary'} fullWidth>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Application
                      </Button>
                    </a>
                  )}
                  {!job.applyUrl && !job.applyEmail && (
                    <form action="/api/applications" method="POST">
                      <input type="hidden" name="jobId" value={job.id} />
                      <Button type="submit" variant="primary" fullWidth>
                        Apply Now
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </GlassCard>

            {/* Company Info */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">
                About the Company
              </h3>
              <div className="space-y-2 text-silver-300">
                <p className="font-medium text-white">{job.company}</p>
                {job.user?.company && job.user.company !== job.company && (
                  <p className="text-sm">Posted by: {job.user.company}</p>
                )}
              </div>
            </GlassCard>

            {/* Job Details */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">
                Job Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-silver-400">Job Type</span>
                  <span className="text-white">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-silver-400">Category</span>
                  <span className="text-white text-right">{job.category}</span>
                </div>
                {job.salaryMin && job.salaryMax && (
                  <div className="flex justify-between">
                    <span className="text-silver-400">Salary Range</span>
                    <span className="text-white">
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-silver-400">Posted</span>
                  <span className="text-white">
                    {format(new Date(job.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-silver-400">Expires</span>
                  <span className="text-white">
                    {format(new Date(job.expiresAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  );
}
