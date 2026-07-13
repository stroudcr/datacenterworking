import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { employerPages, type EmployerPageSlug } from '@/lib/employer-pages';
import { absoluteUrl } from '@/lib/site-config';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { FunnelLink } from '@/components/FunnelLink';

export function generateStaticParams() { return Object.keys(employerPages).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const page = employerPages[slug as EmployerPageSlug];
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: absoluteUrl(`/employers/${slug}`) }, openGraph: { title: page.title, description: page.description, url: absoluteUrl(`/employers/${slug}`) } };
}

export default async function EmployerSpecialtyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const page = employerPages[slug as EmployerPageSlug]; if (!page) notFound();
  return <main className="min-h-screen px-4 py-20"><div className="container mx-auto max-w-5xl">
    <p className="text-sm font-semibold uppercase tracking-widest text-ice-400">Employer hiring guide</p>
    <h1 className="mt-4 max-w-4xl text-5xl font-bold text-white">{page.headline}</h1>
    <p className="mt-6 max-w-3xl text-xl text-silver-300">{page.intro}</p>
    <div className="mt-8 flex flex-col gap-4 sm:flex-row"><FunnelLink href="/post-job?plan=standard" placement={`seo_${slug}`}><Button size="lg">Post a 30-day job — $249</Button></FunnelLink><FunnelLink href="/employers#consultation" placement={`seo_${slug}`}><Button variant="outline" size="lg">Discuss hiring needs</Button></FunnelLink></div>
    <section className="mt-16 grid gap-6 md:grid-cols-3">{page.topics.map((topic) => <GlassCard key={topic}><CheckCircle className="h-6 w-6 text-ice-400"/><h2 className="mt-4 text-lg font-semibold text-white">{topic}</h2><p className="mt-2 text-sm text-silver-400">Include concrete responsibilities, required experience, location, schedule and compensation so candidates can assess fit before applying.</p></GlassCard>)}</section>
    <section className="mt-16"><GlassCard><h2 className="text-2xl font-bold text-white">What every effective listing should include</h2><div className="mt-5 grid gap-4 text-silver-300 md:grid-cols-2"><p>• A specific title that matches the work candidates search for</p><p>• Facility location, travel expectations and shift pattern</p><p>• Must-have experience, certifications and clearance</p><p>• Compensation range and a clear application route</p></div></GlassCard></section>
  </div></main>;
}
