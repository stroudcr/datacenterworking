import { JSearchJob, ScoredJob } from './types';

// Data center hub cities (major locations)
const DC_HUBS = [
  'ashburn', 'leesburg', 'sterling', // Northern Virginia
  'dallas', 'richardson', 'plano', // Dallas area
  'phoenix', 'mesa', 'chandler', // Phoenix area
  'chicago', 'elk grove', // Chicago area
  'santa clara', 'san jose', 'sunnyvale', 'palo alto', // Silicon Valley
  'los angeles', 'el segundo', // LA area
  'seattle', 'bellevue', 'redmond', // Seattle area
  'atlanta', 'alpharetta', // Atlanta area
  'new york', 'secaucus', // NYC/NJ area
  'denver', 'aurora', // Denver area
  'portland', 'hillsboro', // Portland area
  'boston', 'cambridge', // Boston area
];

// Required keywords that must be in title or description
const REQUIRED_KEYWORDS = [
  'data center',
  'datacenter',
  'data centre',
  'colocation',
  'colo facility',
  'critical facilities',
  'hyperscale',
  'dcim',
  'mission critical',
];

// Keywords that boost score
const BOOST_KEYWORDS = [
  'cdcp', 'cdcs', 'cdfom', // Data center certifications
  'uptime institute',
  'tier iii', 'tier iv',
  'cooling', 'hvac',
  'power distribution',
  'ups', 'generator',
  'raised floor',
  'cable management',
  'server room',
  'rack installation',
  'infrastructure',
  'facilities management',
  '24/7', '24x7',
  'shift work',
  'on-call',
];

// Job title keywords (positive indicators)
const TITLE_KEYWORDS = [
  'technician',
  'engineer',
  'manager',
  'operator',
  'electrician',
  'specialist',
  'coordinator',
  'director',
  'supervisor',
  'lead',
  'senior',
  'analyst',
];

// Exclude jobs with these keywords (false positives)
const EXCLUDE_KEYWORDS = [
  'data scientist',
  'data analyst',
  'data warehouse',
  'database administrator',
  'dba',
  'business intelligence',
  'data engineer', // Too generic, often refers to software/analytics
  'machine learning',
  'artificial intelligence',
  'ai engineer',
  'data mining',
  'big data',
  'hadoop',
  'spark',
  'etl developer',
];

/**
 * Calculate relevance score for a job
 * Higher score = more relevant to data center positions
 */
export function scoreJob(job: JSearchJob): number {
  let score = 0;

  const title = job.job_title.toLowerCase();
  const description = job.job_description.toLowerCase();
  const location = `${job.job_city || ''} ${job.job_state || ''}`.toLowerCase();

  // EXCLUSION: Check for false positives first (disqualify immediately)
  for (const keyword of EXCLUDE_KEYWORDS) {
    if (title.includes(keyword) || description.includes(keyword)) {
      return -1000; // Disqualified
    }
  }

  // REQUIRED: Must contain at least one required keyword
  const hasRequiredKeyword = REQUIRED_KEYWORDS.some(
    keyword => title.includes(keyword) || description.includes(keyword)
  );

  if (!hasRequiredKeyword) {
    return -500; // Doesn't meet minimum requirements
  }

  // TITLE: Keywords in title are strong indicators (+50 points)
  if (REQUIRED_KEYWORDS.some(keyword => title.includes(keyword))) {
    score += 50;
  }

  // TITLE: Specific job titles (+10 points each)
  for (const keyword of TITLE_KEYWORDS) {
    if (title.includes(keyword)) {
      score += 10;
    }
  }

  // LOCATION: Major DC hub locations (+15 points)
  if (DC_HUBS.some(hub => location.includes(hub))) {
    score += 15;
  }

  // BOOST KEYWORDS: Industry-specific terms (+5 points each, max 50)
  let boostCount = 0;
  for (const keyword of BOOST_KEYWORDS) {
    if (description.includes(keyword) || title.includes(keyword)) {
      boostCount++;
      if (boostCount <= 10) { // Cap at 10 keywords
        score += 5;
      }
    }
  }

  // JOB TYPE: Full-time positions slightly preferred (+5 points)
  if (job.job_employment_type === 'FULLTIME') {
    score += 5;
  }

  // SALARY: Jobs with salary info are more complete (+5 points)
  if (job.job_min_salary && job.job_max_salary) {
    score += 5;
  }

  // APPLY QUALITY: Direct apply links are better (+5 points)
  if (job.job_apply_is_direct && job.job_apply_quality_score > 0.5) {
    score += 5;
  }

  // RECENCY: Recently posted jobs (+5 points if within last 7 days)
  const daysOld = (Date.now() - job.job_posted_at_timestamp * 1000) / (1000 * 60 * 60 * 24);
  if (daysOld <= 7) {
    score += 5;
  }

  return score;
}

/**
 * Filter and score all jobs, return only data center relevant jobs
 */
export function filterAndScoreJobs(jobs: JSearchJob[]): ScoredJob[] {
  const scoredJobs: ScoredJob[] = jobs
    .map(job => ({
      ...job,
      relevanceScore: scoreJob(job),
    }))
    .filter(job => job.relevanceScore > 0) // Remove disqualified jobs
    .sort((a, b) => b.relevanceScore - a.relevanceScore); // Sort by score descending

  return scoredJobs;
}

/**
 * Get top N jobs by relevance score
 */
export function getTopJobs(jobs: JSearchJob[], limit: number = 100): ScoredJob[] {
  const scored = filterAndScoreJobs(jobs);
  return scored.slice(0, limit);
}

/**
 * Check if a job is truly data center related (basic validation)
 */
export function isDataCenterJob(job: JSearchJob): boolean {
  const score = scoreJob(job);
  return score > 0;
}

/**
 * Deduplicate jobs by company + title + location
 */
export function deduplicateJobs(jobs: ScoredJob[]): ScoredJob[] {
  const seen = new Set<string>();
  const unique: ScoredJob[] = [];

  for (const job of jobs) {
    const key = `${job.employer_name}-${job.job_title}-${job.job_city || ''}-${job.job_state || ''}`.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(job);
    }
  }

  return unique;
}
