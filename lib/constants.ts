export const JOB_CATEGORIES = [
  'Data Center Operations & Production',
  'Critical Facilities & Maintenance',
  'Engineering & Design',
  'Construction & Project Management',
  'IT, Cloud & Network Infrastructure',
  'Security & Compliance',
  'Management & Executive Leadership',
  'Sales, Business Development & Account Management',
  'Emerging Technologies & Specialty Roles',
  'Support Functions',
] as const;

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
] as const;

export const PRICING = {
  BASE_LISTING: 24900, // $249 in cents
  FEATURED_UPGRADE: 14900, // $149 in cents
  LISTING_DURATION: 30, // days
  FEATURED_DURATION: 7, // days
} as const;

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'salary', label: 'Highest Salary' },
  { value: 'applications', label: 'Most Applied' },
] as const;
