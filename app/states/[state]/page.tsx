import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Bell } from 'lucide-react';
import { JobListingsClient } from '@/components/JobListingsClient';
import { Newsletter } from '@/components/Newsletter';
import { StateCareerGuide } from '@/components/StateCareerGuide';
import { StateOutline } from '@/components/StateOutline';
import { SortSelect } from '@/components/SortSelect';
import { db } from '@/lib/db';
import { getAllStates, getStateAbbreviation, getStateFromSlug } from '@/lib/locations';
import {
  buildStateFaqs,
  getStateProfile,
  possessiveStateName,
} from '@/lib/state-profiles';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';

type StateSearchParams = Record<string, string | string[] | undefined>;

interface StatePageProps {
  params: Promise<{ state: string }>;
  searchParams: Promise<StateSearchParams>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllStates().map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params, searchParams }: StatePageProps): Promise<Metadata> {
  const [{ state: stateSlug }, query] = await Promise.all([params, searchParams]);
  const stateName = getStateFromSlug(stateSlug);

  if (!stateName) return { title: 'State Not Found' };

  const stateAbbr = getStateAbbreviation(stateName);
  if (!stateAbbr) return { title: 'State Not Found' };
  const jobCount = await db.job.count({
    where: {
      status: 'ACTIVE',
      expiresAt: { gte: new Date() },
      country: 'US',
      locationStates: { has: stateAbbr },
    },
  });
  const hasQueryParams = Object.values(query).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
  const title = `Data Center Jobs in ${stateName}`;
  const description = jobCount > 0
    ? `Browse ${jobCount} active data center ${jobCount === 1 ? 'job' : 'jobs'} in ${stateName}, plus a state-specific career guide covering power, cooling, technical skills, and training.`
    : `Explore data center careers in ${stateName}, including state-specific guidance on power, cooling, technical skills, training, and future job openings.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/states/${stateSlug}`) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/states/${stateSlug}`),
      images: [{ url: absoluteUrl('/images/state-hero-grid-blue.png') }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: hasQueryParams ? { index: false, follow: true } : undefined,
  };
}

export default async function StatePage({ params, searchParams }: StatePageProps) {
  const [{ state: stateSlug }, query] = await Promise.all([params, searchParams]);
  const stateName = getStateFromSlug(stateSlug);

  if (!stateName) notFound();

  const stateAbbr = getStateAbbreviation(stateName);
  const profile = getStateProfile(stateAbbr);
  if (!stateAbbr || !profile) notFound();

  const now = new Date();
  const where = {
    status: 'ACTIVE' as const,
    expiresAt: { gte: now },
    country: 'US',
    locationStates: { has: stateAbbr },
  };
  const [jobs, totalJobCount, categoryCounts] = await Promise.all([
    db.job.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 150,
    }),
    db.job.count({ where }),
    db.job.groupBy({
      by: ['category'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    }),
  ]);
  const activeCategories = categoryCounts.map((item) => item.category);
  const faqs = buildStateFaqs(profile, activeCategories);
  const possessiveName = possessiveStateName(stateName);
  const pageUrl = absoluteUrl(`/states/${stateSlug}`);
  const initial = (key: string) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'States', item: absoluteUrl('/states') },
      { '@type': 'ListItem', position: 3, name: stateName, item: pageUrl },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Data Center Jobs in ${stateName}`,
    description: `Data center job listings and career guidance for ${stateName}.`,
    url: pageUrl,
    numberOfItems: totalJobCount,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalJobCount,
      itemListElement: jobs.slice(0, 10).map((job, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${job.title} at ${job.company}`,
        url: absoluteUrl(`/jobs/${job.slug}`),
      })),
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <main className="state-page min-h-screen">
      {[breadcrumbSchema, collectionSchema, faqSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative isolate overflow-hidden border-b border-white/10 px-4 py-7 md:py-8">
        <Image
          src="/images/state-hero-grid-blue.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.86)_48%,rgba(2,6,23,0.34)_100%)]" />
        <div className="container mx-auto max-w-7xl">
          <nav className="mb-5 flex items-center gap-2 text-sm text-silver-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Jobs</Link>
            <span aria-hidden="true">/</span>
            <Link href="/states" className="hover:text-white">States</Link>
            <span aria-hidden="true">/</span>
            <span className="text-silver-200">{stateName}</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-silver-300">
                Work In Data Center <span className="px-1 text-silver-500">·</span>{' '}
                <span className="text-ice-400">{stateName}</span>
              </p>
              <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl">
                Power{' '}
                <span className="animated-gradient bg-clip-text text-transparent">
                  {possessiveName}
                </span>
                <br />
                Digital Future
              </h1>
              <h2 className="mt-4 text-xl font-semibold text-white md:text-2xl">
                Data Center Jobs in {stateName}
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-silver-300">
                From operations and facilities to engineering and IT, build your career in the
                systems powering {stateName}&apos;s digital infrastructure.
              </p>
              <div className="mt-5">
                <a
                  href="#state-job-alerts"
                  className="inline-flex items-center gap-2 text-sm font-medium text-silver-300 underline decoration-white/30 underline-offset-4 hover:text-white"
                >
                  <Bell className="h-4 w-4" aria-hidden="true" /> Get {stateName} job alerts
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <StateOutline abbreviation={stateAbbr} />
            </div>
          </div>
        </div>
      </section>

      <section id="state-jobs" className="scroll-mt-24 bg-[#071426] px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-3xl font-bold text-white md:text-4xl">Data center jobs in {stateName}</h2>
              <span className="text-sm text-silver-400">
                {totalJobCount.toLocaleString()} {totalJobCount === 1 ? 'job' : 'jobs'}
              </span>
            </div>
            {jobs.length > 0 && (
              <Suspense fallback={null}>
                <SortSelect basePath={`/states/${stateSlug}`} />
              </Suspense>
            )}
          </div>

          <Suspense fallback={<div className="py-16 text-center text-silver-400">Loading jobs…</div>}>
            <JobListingsClient
              jobs={jobs}
              initialCategory={initial('category')}
              initialType={initial('type')}
              initialShift={initial('shift')}
              initialClearance={initial('clearance')}
              initialCertifications={initial('certifications')}
              initialSort={initial('sort') || 'latest'}
              basePath={`/states/${stateSlug}`}
              hideListHeader
              emptyTitle={`No active ${stateName} jobs match right now`}
              emptyDescription={`The ${stateName} career guide and alert signup below are still available while you wait for the next listing.`}
            />
          </Suspense>

          <StateCareerGuide profile={profile} activeCategories={activeCategories} />

          <div id="state-job-alerts" className="mx-auto mt-12 max-w-2xl scroll-mt-24">
            <Newsletter
              title={`Get ${stateName} job alerts`}
              description={`Be notified when new data center opportunities are added for ${stateName}.`}
              successDescription={`You'll receive alerts when new ${stateName} data center jobs are posted.`}
              categories={[`State:${stateAbbr}`]}
              buttonText={`Subscribe to ${stateAbbr} alerts`}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
