export interface PublicJobListing {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
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
  featuredUntil: string | null;
  applicationCount: number;
  createdAt: string;
  source: string;
}

export interface PublicJobDetail {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  isRemote: boolean;
  type: string;
  category: string;
  description: string;
  requirements: string;
  salary: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  applyUrl: string | null;
  applyEmail: string | null;
  enableInternalApplications: boolean;
  tags: string[];
  status: string;
  isFeatured: boolean;
  featuredUntil: string | null;
  expiresAt: string;
  createdAt: string;
  source: string;
}

export interface PublicJobStats {
  stateJobCounts: Record<string, number>;
  stateCategoryCounts: Record<string, Array<{ category: string; count: number }>>;
  remoteJobCount: number;
  remoteCategoryCounts: Array<{ category: string; count: number }>;
  totalLocatedJobs: number;
}

export interface PublicSitemapJob {
  slug: string;
  updatedAt: string;
}
