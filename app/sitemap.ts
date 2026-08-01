import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { resources } from '@/lib/resources-data';
import { getAllStates } from '@/lib/locations';
import { SITE_URL, absoluteUrl } from '@/lib/site-config';
import { employerPages } from '@/lib/employer-pages';

// Cache sitemap for 1 hour to reduce database operations from frequent crawler requests
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeJobsWhere = {
    status: 'ACTIVE' as const,
    expiresAt: {
      gte: new Date(),
    },
  };

  // Fetch all active jobs for dynamic sitemap
  const jobs = await db.job.findMany({
    where: activeJobsWhere,
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const remoteJobCount = await db.job.count({
    where: {
      ...activeJobsWhere,
      country: 'US',
      state: null,
    },
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/employers'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...Object.keys(employerPages).map((slug) => ({
      url: absoluteUrl(`/employers/${slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/pricing'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/post-job'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/resources'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/privacy'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/terms'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic job pages
  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: absoluteUrl(`/jobs/${job.slug}`),
    lastModified: job.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Resource pages
  const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: absoluteUrl(`/resources/${resource.slug}`),
    lastModified: new Date(resource.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // State pages
  const allStates = getAllStates();
  const stateContentReviewedAt = new Date('2026-08-01T00:00:00.000Z');
  const statePages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/states'),
      lastModified: stateContentReviewedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...(remoteJobCount > 0
      ? [
          {
            url: absoluteUrl('/states/remote'),
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
          },
        ]
      : []),
    ...allStates.map((state) => ({
      url: absoluteUrl(`/states/${state.slug}`),
      lastModified: stateContentReviewedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];

  return [...staticPages, ...jobPages, ...resourcePages, ...statePages];
}
