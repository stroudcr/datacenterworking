import type { Metadata } from 'next';
import { ArrowRight, BriefcaseBusiness, Search, CreditCard, Users, Wrench, Building2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { EmployerLeadForm } from '@/components/EmployerLeadForm';
import { FunnelLink, FunnelView } from '@/components/FunnelLink';
import { getEmployerProof } from '@/lib/employer-proof';
import { absoluteUrl } from '@/lib/site-config';
import { PRICING } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hire Data Center Talent',
  description: 'Post data center jobs or discuss multi-role hiring with a focused data center job board.',
  alternates: { canonical: absoluteUrl('/employers') },
  openGraph: { title: 'Hire Data Center Talent', description: 'Reach people searching for data center operations, critical facilities, construction and infrastructure roles.', url: absoluteUrl('/employers') },
};

const faqs = [
  ['How much does a job post cost?', `A standard 30-day listing is $${PRICING.BASE_LISTING / 100}. Featured placement is $${(PRICING.BASE_LISTING + PRICING.FEATURED_UPGRADE) / 100}.`],
  ['What roles can I advertise?', 'The board focuses on data center operations, critical facilities, engineering, construction, networks, security, leadership and related support roles.'],
  ['Can candidates apply through our ATS?', 'Yes. Choose an external application URL, an application email, or applications managed on Work In Data Center.'],
  ['Do you support multi-role hiring?', 'Yes. Share your roles, locations, volume and timeline in the hiring form and we will discuss an appropriate approach.'],
];

export default async function EmployersPage() {
  const proof = await getEmployerProof();
  const visibleProof = proof.length >= 2 ? proof : [];
  const schema = [{ '@context': 'https://schema.org', '@type': 'Service', name: 'Data center job advertising', provider: { '@type': 'Organization', name: 'Work In Data Center' }, areaServed: 'United States', url: absoluteUrl('/employers') }, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }];
  return <main className="min-h-screen">
    <FunnelView event="employer_landing_view" />
    {schema.map((item, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />)}
    <section className="px-4 py-20"><div className="container mx-auto max-w-6xl text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-ice-400">For data center employers</p>
      <h1 className="mx-auto max-w-4xl text-5xl font-bold text-white md:text-6xl">Put your role in front of people looking for data center work</h1>
      <p className="mx-auto mt-6 max-w-3xl text-xl text-silver-300">Advertise operations, critical facilities, construction and infrastructure roles on a job board built around the data center industry.</p>
      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <FunnelLink href="/post-job?plan=standard" placement="employer_hero"><Button size="lg">Post a job — ${PRICING.BASE_LISTING / 100}<ArrowRight className="ml-2 h-4 w-4" /></Button></FunnelLink>
        <FunnelLink href="#consultation" placement="employer_hero"><Button variant="outline" size="lg">Discuss volume hiring</Button></FunnelLink>
      </div>
    </div></section>
    <section className="px-4 pb-16"><div className="container mx-auto max-w-5xl grid gap-5 md:grid-cols-3">
      {(visibleProof.length ? visibleProof : [
        { value: 'Focused', label: 'data center audience and role taxonomy' }, { value: 'Flexible', label: 'on-site, email or ATS application paths' }, { value: 'Clear', label: '30-day listing with optional featured placement' },
      ]).map((metric) => <GlassCard key={metric.label} className="text-center"><p className="text-3xl font-bold text-white">{metric.value}</p><p className="mt-2 text-silver-400">{metric.label}</p></GlassCard>)}
    </div></section>
    <section className="bg-black/20 px-4 py-16"><div className="container mx-auto max-w-6xl"><h2 className="text-center text-3xl font-bold text-white">From vacancy to live listing in three steps</h2><div className="mt-10 grid gap-6 md:grid-cols-3">
      {[[BriefcaseBusiness,'Describe the role','Add the responsibilities, requirements, compensation and preferred application route.'],[CreditCard,'Choose placement','Select a standard listing or seven days of Featured priority, then complete secure Stripe checkout.'],[Search,'Reach relevant searches','Your active job becomes discoverable by title, category, location and data center-specific filters.']].map(([Icon,title,copy]) => { const I = Icon as typeof Search; return <GlassCard key={title as string}><I className="h-7 w-7 text-ice-400"/><h3 className="mt-4 text-xl font-semibold text-white">{title as string}</h3><p className="mt-2 text-silver-400">{copy as string}</p></GlassCard> })}
    </div></div></section>
    <section className="px-4 py-16"><div className="container mx-auto max-w-5xl grid gap-8 lg:grid-cols-[.8fr,1.2fr]"><div><h2 className="text-3xl font-bold text-white">Hiring more than one role?</h2><p className="mt-4 text-silver-300">Tell us what you are hiring for. Your request is saved before any email notification is sent, so it will not disappear if email delivery has an issue.</p><div className="mt-6 space-y-3 text-silver-300"><p className="flex gap-2"><Users className="text-ice-400"/> Multiple openings or locations</p><p className="flex gap-2"><Wrench className="text-ice-400"/> Specialized facilities and technical roles</p><p className="flex gap-2"><Building2 className="text-ice-400"/> Recruiter and agency inquiries</p></div></div><GlassCard><EmployerLeadForm /></GlassCard></div></section>
    <section className="px-4 py-16"><div className="container mx-auto max-w-4xl"><h2 className="text-center text-3xl font-bold text-white">Employer FAQ</h2><div className="mt-8 space-y-4">{faqs.map(([q,a]) => <GlassCard key={q}><h3 className="font-semibold text-white">{q}</h3><p className="mt-2 text-sm text-silver-300">{a}</p></GlassCard>)}</div></div></section>
  </main>;
}
