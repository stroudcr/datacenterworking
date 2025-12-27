import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { resources } from '@/lib/resources-data';
import { getAllStates } from '@/lib/locations';

// Cache sitemap for 1 hour to reduce database operations from frequent crawler requests
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.workindatacenter.com';

  // Fetch all active jobs for dynamic sitemap
  const jobs = await db.job.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: {
        gte: new Date(),
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic job pages
  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${siteUrl}/jobs/${job.slug}`,
    lastModified: job.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Resource pages
  const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${siteUrl}/resources/${resource.slug}`,
    lastModified: new Date(resource.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // State pages
  const allStates = getAllStates();
  const statePages: MetadataRoute.Sitemap = [
    // States index page
    {
      url: `${siteUrl}/states`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // Remote jobs page
    {
      url: `${siteUrl}/states/remote`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // Individual state pages
    ...allStates.map((state) => ({
      url: `${siteUrl}/states/${state.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ];

  return [...staticPages, ...jobPages, ...resourcePages, ...statePages];
}
