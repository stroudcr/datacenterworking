import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Briefcase, Star, Eye, TrendingUp, BarChart, Mail, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PostJobSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect('/post-job');
  }

  // Check if user is already logged in
  const userSession = await getSession();

  try {
    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession || checkoutSession.payment_status !== 'paid') {
      redirect('/post-job?payment=failed');
    }

    // Get the job details
    const jobId = checkoutSession.metadata?.jobId;
    if (!jobId) {
      redirect('/post-job?payment=failed');
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      redirect('/post-job?payment=failed');
    }

    const email = job.email || checkoutSession.customer_email || '';

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-xl text-silver-400">
              Your job posting is now live
            </p>
          </div>

          {/* Job Summary */}
          <GlassCard className="mb-6">
            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="p-3 rounded-lg bg-ice-500/20">
                <Briefcase className="w-6 h-6 text-ice-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white mb-1">
                  {job.title}
                </h2>
                <p className="text-silver-400">
                  {job.company} • {job.location}
                </p>
              </div>
              {job.isFeatured && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Featured
                </span>
              )}
            </div>

            <div className="space-y-3 text-sm text-silver-300">
              <div className="flex justify-between">
                <span>Receipt sent to:</span>
                <span className="text-white font-medium">{email}</span>
              </div>
              <div className="flex justify-between">
                <span>Job posted on:</span>
                <span className="text-white font-medium">
                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Listing duration:</span>
                <span className="text-white font-medium">30 days</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <Link href={`/jobs/${job.slug}`}>
                <Button variant="primary" fullWidth>
                  View Your Job Posting
                </Button>
              </Link>
            </div>
          </GlassCard>

          {/* Account Creation CTA - Only show if not logged in */}
          {!userSession && (
            <GlassCard className="mb-6 bg-gradient-to-br from-ice-500/20 to-purple-500/20 border-ice-500/30">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Get the Most Out of Your Job Posting
                </h2>
                <p className="text-silver-300">
                  Create a free employer account to unlock powerful features
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ice-500/20">
                    <BarChart className="w-5 h-5 text-ice-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Track Performance</h3>
                    <p className="text-sm text-silver-400">
                      View real-time analytics on views and applications
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Manage Anytime</h3>
                    <p className="text-sm text-silver-400">
                      Edit your job posting whenever you need
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Briefcase className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Post Multiple Jobs</h3>
                    <p className="text-sm text-silver-400">
                      Manage all your listings from one dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email Alerts</h3>
                    <p className="text-sm text-silver-400">
                      Get notified when candidates apply
                    </p>
                  </div>
                </div>
              </div>

              <Link href={`/register?email=${encodeURIComponent(email)}&role=EMPLOYER`}>
                <Button variant="primary" size="lg" fullWidth>
                  Create Free Employer Account
                </Button>
              </Link>

              <p className="text-center text-sm text-silver-400 mt-4">
                Check your email for a management link to edit your job without an account
              </p>
            </GlassCard>
          )}

          {/* Next Steps */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">
              What Happens Next?
            </h3>
            <div className="space-y-3 text-silver-300">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ice-500 text-white text-sm font-semibold flex items-center justify-center">
                  1
                </div>
                <div>
                  <p className="font-medium text-white">Your job is now live</p>
                  <p className="text-sm text-silver-400">
                    Candidates can find and apply to your position immediately
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ice-500 text-white text-sm font-semibold flex items-center justify-center">
                  2
                </div>
                <div>
                  <p className="font-medium text-white">Check your email</p>
                  <p className="text-sm text-silver-400">
                    We've sent your receipt and a secure link to manage your posting
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ice-500 text-white text-sm font-semibold flex items-center justify-center">
                  3
                </div>
                <div>
                  <p className="font-medium text-white">Start receiving applications</p>
                  <p className="text-sm text-silver-400">
                    Applications will be sent to {job.applyEmail || 'your specified contact method'}
                  </p>
                </div>
              </div>

              {job.isFeatured && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-sm font-semibold flex items-center justify-center">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Featured for 7 days</p>
                    <p className="text-sm text-silver-400">
                      Your job will appear at the top of search results and on the homepage
                    </p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Call to Action */}
          <div className="mt-8 text-center space-y-4">
            <Link href="/">
              <Button variant="outline" size="lg">
                Browse All Jobs
              </Button>
            </Link>
            {userSession && (
              <div>
                <Link href="/dashboard/employer">
                  <Button variant="primary" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading success page:', error);
    redirect('/post-job?payment=failed');
  }
}
