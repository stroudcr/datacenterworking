import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCircle2, Mail, SlidersHorizontal } from 'lucide-react';
import { Newsletter } from '@/components/Newsletter';
import { absoluteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Data Center Job Alerts',
  description: 'Get new data center job opportunities delivered directly to your inbox.',
  alternates: {
    canonical: absoluteUrl('/job-alerts'),
  },
  openGraph: {
    title: 'Data Center Job Alerts',
    description: 'Be among the first to see new data center roles in operations, engineering, infrastructure, and more.',
    url: absoluteUrl('/job-alerts'),
  },
};

const benefits = [
  {
    icon: Bell,
    title: 'New openings, without the hunt',
    description: 'Hear about newly posted roles without checking the board every day.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Focused industry signal',
    description: 'Stay close to opportunities across the data center industry.',
  },
  {
    icon: CheckCircle2,
    title: 'Simple and in your control',
    description: 'Subscribe in seconds and unsubscribe whenever you want.',
  },
];

export default function JobAlertsPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 py-12 md:py-20">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[34rem] w-[70rem] -translate-x-1/2 rounded-full bg-ice-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-silver-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-400 focus-visible:ring-offset-2 focus-visible:ring-offset-silver-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to jobs
        </Link>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <section aria-labelledby="job-alerts-title">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ice-400/20 bg-ice-500/10 px-3 py-1.5 text-sm font-semibold text-ice-300">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Data center job alerts
            </div>

            <h1 id="job-alerts-title" className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The right opportunity,
              <span className="mt-1 block animated-gradient bg-clip-text text-transparent">delivered.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-silver-300">
              Be among the first to see new data center roles in operations, critical facilities, engineering, infrastructure, and more.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ice-400">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-semibold text-white">{benefit.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-silver-400">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-label="Create your job alert" className="relative">
            <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-ice-500/20 via-cyan-500/5 to-transparent blur-xl" aria-hidden="true" />
            <Newsletter
              headingLevel="h2"
              title="Create your job alert"
              description="Add your email and we'll keep you close to the newest opportunities."
              buttonText="Create My Job Alert"
              successDescription="You're all set. New data center opportunities will arrive in your inbox."
            />
            <p className="mt-5 text-center text-sm text-silver-400">
              Have a job seeker account?{' '}
              <Link href="/dashboard/seeker/settings#notifications" className="font-medium text-ice-400 transition-colors hover:text-ice-300">
                Manage notification preferences
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
