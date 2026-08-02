import { ScoredJob } from './types';
import { JOB_CATEGORIES, JOB_TYPES } from '../constants';
import { parseLocation } from '../locations';

export interface MappedJob {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  city: string | null;
  state: string | null;
  locationStates: string[];
  isRemote: boolean;
  country: string;
  type: string;
  category: string;
  shift?: string;
  clearance?: string;
  certifications?: string;
  description: string;
  requirements: string;
  salaryMin?: number;
  salaryMax?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  applyUrl: string;
  tags: string[];
  expiresAt: Date;
  slug: string;
  source: 'EXTERNAL_JSEARCH';
  externalId: string;
  sourceUrl: string;
  lastSynced: Date;
}

/**
 * Map JSearch employment type to our job types
 */
function mapEmploymentType(jsearchType: string): string {
  const typeMap: Record<string, string> = {
    'FULLTIME': 'Full-time',
    'PARTTIME': 'Part-time',
    'CONTRACTOR': 'Contract / Temporary',
    'INTERN': 'Contract / Temporary',
  };

  return typeMap[jsearchType] || 'Full-time';
}

/**
 * Infer job category from title and description
 */
function inferCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  // Category detection patterns
  const categoryPatterns: Record<string, string[]> = {
    'Data Center Operations & Production': [
      'operations', 'operator', 'technician', 'tech support',
      'monitoring', 'production', 'datacenter technician',
    ],
    'Critical Facilities & Maintenance': [
      'facilities', 'maintenance', 'hvac', 'cooling', 'electrical',
      'electrician', 'ups', 'generator', 'power', 'mechanical',
    ],
    'Engineering & Design': [
      'engineer', 'engineering', 'design', 'architecture',
      'infrastructure engineer', 'systems engineer',
    ],
    'Construction & Project Management': [
      'construction', 'project manager', 'pmp', 'build out',
      'project management', 'site manager',
    ],
    'IT, Cloud & Network Infrastructure': [
      'network', 'cloud', 'it infrastructure', 'devops', 'sysadmin',
      'system administrator', 'ccna', 'cisco', 'aws', 'azure',
    ],
    'Security & Compliance': [
      'security', 'compliance', 'audit', 'risk', 'clearance',
      'physical security', 'cybersecurity',
    ],
    'Management & Executive Leadership': [
      'director', 'manager', 'executive', 'vp', 'vice president',
      'head of', 'chief', 'leadership', 'general manager',
    ],
    'Sales, Business Development & Account Management': [
      'sales', 'business development', 'account manager',
      'sales engineer', 'account executive', 'bd',
    ],
    'Emerging Technologies & Specialty Roles': [
      'ai', 'machine learning', 'automation', 'robotics',
      'innovation', 'emerging', 'r&d', 'research',
    ],
    'Support Functions': [
      'hr', 'human resources', 'admin', 'finance', 'accounting',
      'procurement', 'support', 'coordinator',
    ],
  };

  // Find best matching category
  let bestCategory = 'Data Center Operations & Production'; // Default
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(categoryPatterns)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  return bestCategory;
}

/**
 * Infer shift requirements from description
 */
function inferShift(description: string): string | undefined {
  const text = description.toLowerCase();

  if (text.includes('rotating') || text.includes('rotation')) {
    return 'Rotating Shifts';
  }
  if (text.includes('on-call') || text.includes('on call')) {
    return 'On-Call';
  }
  if (text.includes('night shift') || text.includes('overnight')) {
    return 'Night Shift';
  }
  if (text.includes('evening shift')) {
    return 'Evening Shift';
  }
  if (text.includes('day shift') || text.includes('business hours')) {
    return 'Day Shift (standard business hours)';
  }
  if (text.includes('24/7') || text.includes('24x7')) {
    return 'Rotating Shifts';
  }

  return undefined;
}

/**
 * Infer security clearance requirements
 */
function inferClearance(description: string): string | undefined {
  const text = description.toLowerCase();

  if (text.includes('ts/sci')) {
    return 'TS/SCI';
  }
  if (text.includes('top secret')) {
    return 'Top Secret';
  }
  if (text.includes('secret clearance') || text.includes('security clearance')) {
    return 'Secret';
  }
  if (text.includes('able to obtain clearance')) {
    return 'Able to Obtain';
  }

  return 'None Required';
}

/**
 * Extract certifications mentioned in job
 */
function extractCertifications(description: string): string | undefined {
  const text = description.toLowerCase();
  const found: string[] = [];

  const certPatterns = [
    { pattern: /cdcp|certified data cent(?:er|re) professional/i, cert: 'CDCP' },
    { pattern: /cdcs|certified data cent(?:er|re) specialist/i, cert: 'CDCS' },
    { pattern: /cdce|certified data cent(?:er|re) expert/i, cert: 'CDCE' },
    { pattern: /uptime institute|atd|ats|aos/i, cert: 'Uptime Institute' },
    { pattern: /ccie|ccnp|ccna/i, cert: 'Cisco' },
    { pattern: /comptia|a\+|network\+|server\+/i, cert: 'CompTIA' },
    { pattern: /pmp|project management professional/i, cert: 'PMP' },
    { pattern: /pe license|professional engineer/i, cert: 'PE License' },
    { pattern: /electrician|journeyman/i, cert: 'Electrician License' },
  ];

  for (const { pattern, cert } of certPatterns) {
    if (pattern.test(text) && !found.includes(cert)) {
      found.push(cert);
    }
  }

  return found.length > 0 ? found.join(', ') : undefined;
}

/**
 * Extract tags from job data
 */
function extractTags(job: ScoredJob): string[] {
  const tags = new Set<string>();

  // Add employment type
  tags.add(job.job_employment_type.toLowerCase());

  // Add remote if applicable
  if (job.job_is_remote) {
    tags.add('remote');
  }

  // Add experience level from title
  const title = job.job_title.toLowerCase();
  if (title.includes('senior') || title.includes('sr.')) {
    tags.add('senior');
  }
  if (title.includes('junior') || title.includes('jr.')) {
    tags.add('junior');
  }
  if (title.includes('lead')) {
    tags.add('lead');
  }
  if (title.includes('manager')) {
    tags.add('management');
  }

  // Add skills if available
  if (job.job_required_skills) {
    job.job_required_skills.slice(0, 5).forEach(skill => {
      tags.add(skill.toLowerCase());
    });
  }

  // Add category keywords
  const description = job.job_description.toLowerCase();
  if (description.includes('hvac') || description.includes('cooling')) {
    tags.add('hvac');
  }
  if (description.includes('electrical') || description.includes('power')) {
    tags.add('electrical');
  }
  if (description.includes('network')) {
    tags.add('networking');
  }
  if (description.includes('security')) {
    tags.add('security');
  }

  return Array.from(tags).slice(0, 10); // Limit to 10 tags
}

/**
 * Build requirements section from job data
 */
function buildRequirements(job: ScoredJob): string {
  const requirements: string[] = [];

  // Add qualifications if available
  if (job.job_highlights?.Qualifications) {
    requirements.push('**Qualifications:**');
    job.job_highlights.Qualifications.forEach(qual => {
      requirements.push(`• ${qual}`);
    });
    requirements.push('');
  }

  // Add experience requirements
  if (job.job_required_experience?.required_experience_in_months) {
    const years = Math.round(job.job_required_experience.required_experience_in_months / 12);
    requirements.push(`**Experience:** ${years}+ years required`);
    requirements.push('');
  }

  // Add education requirements
  if (job.job_required_education) {
    const edu = job.job_required_education;
    if (edu.bachelors_degree) {
      requirements.push('**Education:** Bachelor\'s degree preferred');
    } else if (edu.associates_degree) {
      requirements.push('**Education:** Associate\'s degree preferred');
    } else if (edu.high_school) {
      requirements.push('**Education:** High school diploma or equivalent');
    }
    if (requirements.length > 0) requirements.push('');
  }

  // Add responsibilities if available
  if (job.job_highlights?.Responsibilities) {
    requirements.push('**Responsibilities:**');
    job.job_highlights.Responsibilities.forEach(resp => {
      requirements.push(`• ${resp}`);
    });
    requirements.push('');
  }

  // If no structured data, use first part of description
  if (requirements.length === 0) {
    const descLines = job.job_description.split('\n').slice(0, 10);
    requirements.push('**Requirements:**');
    requirements.push(descLines.join('\n'));
  }

  return requirements.join('\n').trim();
}

/**
 * Generate a slug from title and external ID
 */
function generateSlugFromExternal(title: string, externalId: string): string {
  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
    .substring(0, 80);             // Limit length

  // Use first 12 chars of external ID for uniqueness
  const shortId = externalId.substring(0, 12).replace(/[^a-z0-9]/gi, '').toLowerCase();

  return `${slug}-${shortId}`;
}

/**
 * Map JSearch job to our database schema
 */
export function mapJSearchJobToSchema(job: ScoredJob): MappedJob {
  // Parse location
  const location = job.job_is_remote
    ? 'Remote'
    : job.job_city && job.job_state
    ? `${job.job_city}, ${job.job_state}`
    : job.job_city || job.job_state || job.job_country;
  const parsedLocation = parseLocation(location);

  // Generate slug from title and external ID
  const slug = generateSlugFromExternal(job.job_title, job.job_id);

  // Map salary (convert to annual if needed)
  let salaryMin: number | undefined;
  let salaryMax: number | undefined;
  let hourlyRateMin: number | undefined;
  let hourlyRateMax: number | undefined;

  if (job.job_min_salary && job.job_max_salary) {
    if (job.job_salary_period === 'HOUR') {
      hourlyRateMin = job.job_min_salary;
      hourlyRateMax = job.job_max_salary;
    } else {
      // Assume annual or convert to annual
      salaryMin = job.job_min_salary;
      salaryMax = job.job_max_salary;
    }
  }

  // Set expiration to 30 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return {
    title: job.job_title,
    company: job.employer_name,
    companyLogo: job.employer_logo,
    location,
    city: parsedLocation.city,
    state: parsedLocation.state,
    locationStates: parsedLocation.states,
    isRemote: parsedLocation.isRemote,
    country: parsedLocation.country,
    type: mapEmploymentType(job.job_employment_type),
    category: inferCategory(job.job_title, job.job_description),
    shift: inferShift(job.job_description),
    clearance: inferClearance(job.job_description),
    certifications: extractCertifications(job.job_description),
    description: job.job_description,
    requirements: buildRequirements(job),
    salaryMin,
    salaryMax,
    hourlyRateMin,
    hourlyRateMax,
    applyUrl: job.job_apply_link,
    tags: extractTags(job),
    expiresAt,
    slug,
    source: 'EXTERNAL_JSEARCH',
    externalId: job.job_id,
    sourceUrl: job.job_google_link,
    lastSynced: new Date(),
  };
}

/**
 * Map multiple jobs
 */
export function mapJSearchJobs(jobs: ScoredJob[]): MappedJob[] {
  return jobs.map(mapJSearchJobToSchema);
}
