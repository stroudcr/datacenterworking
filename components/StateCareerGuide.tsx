import Link from 'next/link';
import {
  BadgeCheck,
  BriefcaseBusiness,
  CloudSun,
  GraduationCap,
  ShieldCheck,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  buildStateFaqs,
  getRelatedStateProfiles,
  getStateSourceLinks,
  type StateProfile,
} from '@/lib/state-profiles';

interface StateCareerGuideProps {
  profile: StateProfile;
  activeCategories: string[];
}

export function StateCareerGuide({ profile, activeCategories }: StateCareerGuideProps) {
  const sources = getStateSourceLinks(profile);
  const faqs = buildStateFaqs(profile, activeCategories);
  const relatedStates = getRelatedStateProfiles(profile);

  const researchTopics = [
    {
      title: 'Energy and critical power',
      body: profile.energy,
      why: 'Why it matters: Power-distribution, UPS, generator, controls, and energy-management knowledge supports facilities reliability.',
      source: sources[0],
      icon: Zap,
    },
    {
      title: 'Climate and cooling resilience',
      body: profile.climate,
      why: 'Why it matters: HVAC, environmental monitoring, preventive maintenance, and emergency-response skills protect uptime.',
      source: sources[1],
      icon: CloudSun,
    },
    {
      title: 'Technical and skilled-trade workforce',
      body: profile.workforce,
      why: 'Why it matters: Hands-on experience with complex equipment, safety procedures, or always-on systems can shorten the path into data center work.',
      source: sources[2],
      icon: Wrench,
    },
    {
      title: 'Training and credential pathways',
      body: `${profile.name} job seekers can combine employer training with technical education, registered apprenticeships, industry certifications, and any state licensing required for regulated trades.`,
      why: 'Why it matters: A documented foundation in safety, troubleshooting, electrical or mechanical systems, or networking helps applicants show job readiness.',
      source: sources[3],
      icon: GraduationCap,
    },
  ];

  const preparationSteps = [
    {
      title: 'Build transferable fundamentals',
      body: 'Focus on electrical, mechanical, HVAC, controls, network, server, or construction systems that support physical infrastructure.',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Add role-relevant credentials',
      body: 'Consider CompTIA, Cisco, cloud, electrical, HVAC, project-management, or data center credentials that match the work you want.',
      icon: BadgeCheck,
    },
    {
      title: 'Show safety and shift readiness',
      body: 'Highlight lockout/tagout, change control, incident response, documentation, teamwork, and experience supporting scheduled or on-call operations.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      className="mt-16 scroll-mt-28 border-t pt-12"
      style={{ borderColor: `${profile.accentFrom}33` }}
      aria-labelledby="state-career-guide-title"
    >
      <div className="mb-10 max-w-4xl">
        <p
          className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]"
          style={{ color: profile.accentFrom }}
        >
          State career profile
        </p>
        <h2 id="state-career-guide-title" className="text-3xl font-bold text-white md:text-4xl">
          {profile.name} Data Center Career Guide
        </h2>
        <p className="mt-4 text-lg leading-8 text-silver-300">
          Data centers depend on continuous power, precise cooling, secure connectivity, and
          disciplined operations. This guide explains how {profile.name}&apos;s energy system,
          operating environment, workforce, and training pathways connect to careers that keep
          digital infrastructure available around the clock.
        </p>
      </div>

      <div className="grid gap-12 xl:grid-cols-[1.35fr_0.8fr]">
        <div>
          <h3 className="mb-6 text-2xl font-semibold text-white">
            What shapes data center work in {profile.name}
          </h3>
          <div className="divide-y divide-white/10">
            {researchTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <article key={topic.title} className="grid gap-4 py-6 sm:grid-cols-[44px_1fr]">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white/[0.03]"
                    style={{ borderColor: `${profile.accentFrom}55`, color: profile.accentFrom }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{topic.title}</h4>
                    <p className="mt-2 leading-7 text-silver-300">{topic.body}</p>
                    <p className="mt-2 text-sm leading-6 text-silver-400">{topic.why}</p>
                    <a
                      href={topic.source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-medium hover:underline"
                      style={{ color: profile.accentFrom }}
                    >
                      {topic.source.shortLabel}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="xl:border-l xl:border-white/10 xl:pl-10" aria-labelledby="prepare-title">
          <h3 id="prepare-title" className="mb-6 text-2xl font-semibold text-white">
            Preparing for {profile.name} data center roles
          </h3>
          <div className="space-y-7">
            {preparationSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex gap-4">
                  <Icon
                    className="mt-1 h-5 w-5 flex-none"
                    style={{ color: profile.accentTo }}
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{step.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-silver-300">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <h3 className="text-xl font-semibold text-white">More state job guides</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedStates.map((state) => (
                <Link
                  key={state.abbreviation}
                  href={`/states/${state.slug}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-silver-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  {state.name}
                </Link>
              ))}
            </div>
            <Link
              href="/states"
              className="mt-5 inline-flex text-sm font-semibold hover:underline"
              style={{ color: profile.accentFrom }}
            >
              Browse every state
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-14 border-t border-white/10 pt-10">
        <h3 className="text-2xl font-semibold text-white">
          Frequently asked questions about data center careers in {profile.name}
        </h3>
        <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h4 className="font-semibold leading-6 text-white">{faq.question}</h4>
              <p className="mt-2 text-sm leading-6 text-silver-300">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-silver-500 md:flex-row md:items-start md:justify-between">
        <p>
          Research sources:{' '}
          {sources.map((source, index) => (
            <span key={source.label}>
              {index > 0 && ' · '}
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-silver-300 hover:underline"
              >
                {source.label}
              </a>
            </span>
          ))}
        </p>
        <p className="flex-none">Information reviewed: August 2026</p>
      </div>
    </section>
  );
}
