import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';

export type ProofMetric = { label: string; value: string };

export const getEmployerProof = unstable_cache(async (): Promise<ProofMetric[]> => {
  try {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const [subscribers, applications, paidJobs] = await Promise.all([
    db.newsletter.count({ where: { isActive: true } }),
    db.application.count({ where: { createdAt: { gte: ninetyDaysAgo } } }),
    db.payment.findMany({ where: { status: 'completed' }, select: { job: { select: { company: true } } } }),
    ]);
    const employers = new Set(paidJobs.map((payment) => payment.job.company.trim().toLowerCase())).size;
    return [
    subscribers >= 100 && { value: `${subscribers.toLocaleString()}+`, label: 'active job-alert subscribers' },
    applications >= 25 && { value: `${applications.toLocaleString()}+`, label: 'on-site applications in the last 90 days' },
    employers >= 10 && { value: `${employers}+`, label: 'employers that have purchased listings' },
    ].filter((metric): metric is ProofMetric => Boolean(metric));
  } catch (error) {
    console.error('Employer proof metrics unavailable:', error);
    return [];
  }
}, ['employer-proof-v2'], { revalidate: 24 * 60 * 60 });
