import { unstable_cache, revalidateTag } from 'next/cache';
import { cache } from 'react';
import { db } from '@/lib/db';
import type {
  PublicJobDetail,
  PublicJobListing,
  PublicJobStats,
  PublicSitemapJob,
} from '@/lib/public-job-types';

const PUBLIC_JOB_INDEX_CACHE_TAG = 'jobs:public:index';
const PUBLIC_JOB_DETAILS_CACHE_TAG = 'jobs:public:details';
const PUBLIC_JOB_SNAPSHOT_SECONDS = 60 * 60;
const PUBLIC_JOB_DETAIL_SECONDS = 24 * 60 * 60;
const PUBLIC_LISTING_RESULT_LIMIT = 150;

type CachedPublicJob = PublicJobListing & {
  searchText: string;
  expiresAt: string;
  updatedAt: string;
  country: string;
  isRemote: boolean;
  state: string | null;
  locationStates: string[];
};

function serializeListing(row: {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  state: string | null;
  locationStates: string[];
  isRemote: boolean;
  country: string;
  type: string;
  category: string;
  shift: string | null;
  clearance: string | null;
  certifications: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  tags: string[];
  isFeatured: boolean;
  featuredUntil: Date | null;
  expiresAt: Date;
  updatedAt: Date;
  applicationCount: number;
  createdAt: Date;
  source: string;
}): CachedPublicJob {
  const searchText = [
    row.title,
    row.company,
    row.location,
    row.state,
    row.locationStates.join(' '),
    row.category,
    row.tags.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    company: row.company,
    companyLogo: row.companyLogo,
    location: row.location,
    type: row.type,
    category: row.category,
    shift: row.shift,
    clearance: row.clearance,
    certifications: row.certifications,
    salaryMin: row.salaryMin,
    salaryMax: row.salaryMax,
    hourlyRateMin: row.hourlyRateMin,
    hourlyRateMax: row.hourlyRateMax,
    tags: row.tags,
    isFeatured: row.isFeatured,
    featuredUntil: row.featuredUntil?.toISOString() ?? null,
    applicationCount: row.applicationCount,
    createdAt: row.createdAt.toISOString(),
    source: row.source,
    searchText,
    expiresAt: row.expiresAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    country: row.country,
    isRemote: row.isRemote,
    state: row.state,
    locationStates: row.locationStates,
  };
}

const readCachedPublicJobData = unstable_cache(
  async (): Promise<CachedPublicJob[]> => {
    const now = new Date();
    const where = { status: 'ACTIVE' as const, expiresAt: { gte: now } };
    const rows = await db.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        company: true,
        companyLogo: true,
        location: true,
        state: true,
        locationStates: true,
        isRemote: true,
        country: true,
        type: true,
        category: true,
        shift: true,
        clearance: true,
        certifications: true,
        salaryMin: true,
        salaryMax: true,
        hourlyRateMin: true,
        hourlyRateMax: true,
        tags: true,
        isFeatured: true,
        featuredUntil: true,
        expiresAt: true,
        applicationCount: true,
        createdAt: true,
        updatedAt: true,
        source: true,
      },
    });

    return rows.map(serializeListing);
  },
  ['public-job-snapshot-v1'],
  { revalidate: PUBLIC_JOB_SNAPSHOT_SECONDS, tags: [PUBLIC_JOB_INDEX_CACHE_TAG] }
);

const getLivePublicJobData = cache(async () => {
  const cached = await readCachedPublicJobData();
  const now = Date.now();
  return cached
    .filter((job) => Date.parse(job.expiresAt) >= now)
    .map((job) => ({
      ...job,
      isFeatured:
        job.isFeatured &&
        Boolean(job.featuredUntil && Date.parse(job.featuredUntil) >= now),
    }));
});

function toPublicListing(job: CachedPublicJob): PublicJobListing {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.company,
    companyLogo: job.companyLogo,
    location: job.location,
    type: job.type,
    category: job.category,
    shift: job.shift,
    clearance: job.clearance,
    certifications: job.certifications,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    hourlyRateMin: job.hourlyRateMin,
    hourlyRateMax: job.hourlyRateMax,
    tags: job.tags,
    isFeatured: job.isFeatured,
    featuredUntil: job.featuredUntil,
    applicationCount: job.applicationCount,
    createdAt: job.createdAt,
    source: job.source,
  };
}

export async function getPublicJobListings(
  search?: string,
  searchState?: string | null
): Promise<PublicJobListing[]> {
  const listings = await getLivePublicJobData();
  const normalizedSearch = search?.trim().toLocaleLowerCase();
  const matches = normalizedSearch
    ? listings.filter(
        (job) =>
          job.searchText.includes(normalizedSearch) ||
          Boolean(
            searchState &&
              (job.state === searchState || job.locationStates.includes(searchState))
          )
      )
    : listings;

  return matches.slice(0, PUBLIC_LISTING_RESULT_LIMIT).map(toPublicListing);
}

export async function getPublicJobsForState(state: string): Promise<PublicJobListing[]> {
  const listings = await getLivePublicJobData();
  return listings
    .filter((job) => job.country === 'US' && job.locationStates.includes(state))
    .slice(0, PUBLIC_LISTING_RESULT_LIMIT)
    .map(toPublicListing);
}

export async function getPublicRemoteJobs(): Promise<PublicJobListing[]> {
  const listings = await getLivePublicJobData();
  return listings
    .filter((job) => job.country === 'US' && job.isRemote)
    .slice(0, PUBLIC_LISTING_RESULT_LIMIT)
    .map(toPublicListing);
}

export async function getPublicJobStats(): Promise<PublicJobStats> {
  const index = await getLivePublicJobData();
  const stateJobCounts: Record<string, number> = {};
  const categoryCountsByState = new Map<string, Map<string, number>>();
  const remoteCategoryCounts = new Map<string, number>();
  let remoteJobCount = 0;
  let totalLocatedJobs = 0;

  for (const job of index) {
    if (job.country !== 'US') continue;

    if (job.locationStates.length > 0) totalLocatedJobs += 1;
    for (const state of job.locationStates) {
      stateJobCounts[state] = (stateJobCounts[state] ?? 0) + 1;
      const stateCategories = categoryCountsByState.get(state) ?? new Map<string, number>();
      stateCategories.set(job.category, (stateCategories.get(job.category) ?? 0) + 1);
      categoryCountsByState.set(state, stateCategories);
    }

    if (job.isRemote) {
      remoteJobCount += 1;
      remoteCategoryCounts.set(job.category, (remoteCategoryCounts.get(job.category) ?? 0) + 1);
    }
  }

  return {
    stateJobCounts,
    stateCategoryCounts: Object.fromEntries(
      Array.from(categoryCountsByState, ([state, categories]) => [
        state,
        Array.from(categories, ([category, count]) => ({ category, count })).sort(
          (a, b) => b.count - a.count
        ),
      ])
    ),
    remoteJobCount,
    remoteCategoryCounts: Array.from(remoteCategoryCounts, ([category, count]) => ({
      category,
      count,
    })).sort((a, b) => b.count - a.count),
    totalLocatedJobs,
  };
}

export async function getPublicSitemapJobs(): Promise<PublicSitemapJob[]> {
  const index = await getLivePublicJobData();
  return index.map(({ slug, updatedAt }) => ({ slug, updatedAt }));
}

async function loadPublicJobBySlug(slug: string): Promise<PublicJobDetail | null> {
  const job = await db.job.findFirst({
    where: { slug, status: 'ACTIVE' },
    select: {
        id: true,
        slug: true,
        title: true,
        company: true,
        companyLogo: true,
        location: true,
        isRemote: true,
        type: true,
        category: true,
        description: true,
        requirements: true,
        salary: true,
        salaryMin: true,
        salaryMax: true,
        hourlyRateMin: true,
        hourlyRateMax: true,
        applyUrl: true,
        applyEmail: true,
        enableInternalApplications: true,
        tags: true,
        status: true,
        isFeatured: true,
        featuredUntil: true,
        expiresAt: true,
        createdAt: true,
        source: true,
    },
  });

  if (!job) return null;
  return {
    ...job,
    status: job.status,
    source: job.source,
    isFeatured:
      job.isFeatured &&
      Boolean(job.featuredUntil && job.featuredUntil.getTime() >= Date.now()),
    featuredUntil: job.featuredUntil?.toISOString() ?? null,
    expiresAt: job.expiresAt.toISOString(),
    createdAt: job.createdAt.toISOString(),
  };
}

export const getPublicJobBySlug = cache(async (slug: string): Promise<PublicJobDetail | null> => {
  const readCachedPublicJobBySlug = unstable_cache(
    () => loadPublicJobBySlug(slug),
    ['public-job-detail-v2', slug],
    {
      revalidate: PUBLIC_JOB_DETAIL_SECONDS,
      tags: [PUBLIC_JOB_DETAILS_CACHE_TAG, `job:public:${slug}`],
    }
  );
  const job = await readCachedPublicJobBySlug();
  if (!job || job.status !== 'ACTIVE' || Date.parse(job.expiresAt) <= Date.now()) return null;
  if (job.isFeatured && job.featuredUntil && Date.parse(job.featuredUntil) <= Date.now()) {
    return { ...job, isFeatured: false };
  }
  return job;
});

const readCachedSlugByLegacyId = unstable_cache(
  async (id: string) => {
    const job = await db.job.findUnique({ where: { id }, select: { slug: true } });
    return job?.slug ?? null;
  },
  ['public-job-legacy-slug-v1'],
  { revalidate: PUBLIC_JOB_DETAIL_SECONDS, tags: [PUBLIC_JOB_INDEX_CACHE_TAG] }
);

export const getPublicJobSlugByLegacyId = cache(readCachedSlugByLegacyId);

export function invalidatePublicJobData({
  slug,
  allDetails = false,
}: { slug?: string; allDetails?: boolean } = {}) {
  revalidateTag(PUBLIC_JOB_INDEX_CACHE_TAG, { expire: 0 });
  if (allDetails) {
    revalidateTag(PUBLIC_JOB_DETAILS_CACHE_TAG, { expire: 0 });
  } else if (slug) {
    revalidateTag(`job:public:${slug}`, { expire: 0 });
  }
}
