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
import { GlassCard } from '@/components/GlassCard';
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
      why: 'Power-distribution, UPS, generator, controls, and energy-management skills support facility reliability.',
      source: sources[0],
      icon: Zap,
    },
    {
      title: 'Climate and cooling resilience',
      body: profile.climate,
      why: 'HVAC, monitoring, preventive maintenance, and emergency-response skills help protect uptime.',
      source: sources[1],
      icon: CloudSun,
    },
    {
      title: 'Skilled trades and technical workforce',
      body: profile.workforce,
      why: 'Experience with complex equipment, safety procedures, or always-on systems transfers well to data center work.',
      source: sources[2],
      icon: Wrench,
    },
    {
      title: 'Training and credential pathways',
      body: `${profile.name} job seekers can combine employer training with technical education, registered apprenticeships, industry certifications, and state licensing for regulated trades.`,
      why: 'Documented safety, troubleshooting, electrical, mechanical, or networking fundamentals demonstrate job readiness.',
      source: sources[3],
      icon: GraduationCap,
    },
  ];

  const preparationSteps = [
    {
      title: 'Build transferable fundamentals',
      body: 'Develop electrical, mechanical, HVAC, controls, networking, server, or construction skills that support physical infrastructure.',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Add role-relevant credentials',
      body: 'Consider CompTIA, Cisco, cloud, electrical, HVAC, project-management, or data center credentials that fit your target role.',
      icon: BadgeCheck,
    },
    {
      title: 'Show safety and shift readiness',
      body: 'Highlight lockout/tagout, change control, incident response, documentation, teamwork, and on-call experience.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="state-career-guide"
      className="mt-16 scroll-mt-28 [content-visibility:auto]"
      aria-labelledby="state-career-guide-title"
    >
      <GlassCard className="border-ice-500/25">
        <div className="border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ice-400">
            State career profile
          </p>
          <h2 id="state-career-guide-title" className="mt-2 text-3xl font-bold text-white md:text-4xl">
            {profile.name} Data Center Career Guide
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-silver-300 md:text-base">
            How {profile.name}&apos;s power system, operating environment, workforce, and training
            pathways connect to the teams that keep digital infrastructure running.
          </p>
        </div>

        <div className="grid gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div>
            <h3 className="text-xl font-semibold text-white">
              What shapes data center work in {profile.name}
            </h3>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {researchTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <article key={topic.title} className="flex gap-3">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-ice-500/30 bg-ice-500/[0.06] text-ice-400">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{topic.title}</h4>
                      <p className="mt-1.5 text-sm leading-6 text-silver-300">{topic.body}</p>
                      <p className="mt-1.5 text-xs leading-5 text-silver-400">
                        <span className="font-semibold text-silver-300">Why it matters:</span>{' '}
                        {topic.why}
                      </p>
                      <a
                        href={topic.source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex text-xs font-medium text-ice-400 hover:text-ice-300 hover:underline"
                      >
                        {topic.source.shortLabel}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0" aria-labelledby="prepare-title">
            <h3 id="prepare-title" className="text-xl font-semibold text-white">
              Preparing for {profile.name} data center roles
            </h3>
            <div className="mt-5 space-y-5">
              {preparationSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex gap-3">
                    <Icon className="mt-0.5 h-5 w-5 flex-none text-ice-400" aria-hidden="true" />
                    <div>
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-silver-300">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white">More state job guides</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedStates.map((state) => (
                  <Link
                    key={state.abbreviation}
                    href={`/states/${state.slug}`}
                    className="rounded-full border border-ice-500/20 bg-ice-500/[0.05] px-3 py-1.5 text-xs text-silver-300 transition-colors hover:border-ice-400/50 hover:text-white"
                  >
                    {state.name}
                  </Link>
                ))}
              </div>
              <Link href="/states" className="mt-4 inline-flex text-xs font-semibold text-ice-400 hover:text-ice-300 hover:underline">
                Browse every state
              </Link>
            </div>
          </aside>
        </div>
      </GlassCard>

      <div className="mt-10 border-t border-white/10 pt-8">
        <h3 className="text-2xl font-semibold text-white">
          Frequently asked questions about data center careers in {profile.name}
        </h3>
        <div className="mt-6 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="border-l border-ice-500/25 pl-4">
              <h4 className="font-semibold leading-6 text-white">{faq.question}</h4>
              <p className="mt-2 text-sm leading-6 text-silver-300">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs leading-5 text-silver-500 md:flex-row md:items-start md:justify-between">
        <p>
          Research sources:{' '}
          {sources.map((source, index) => (
            <span key={source.label}>
              {index > 0 && ' · '}
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="hover:text-silver-300 hover:underline">
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
