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
  'Contract / Temporary',
  'Per Diem',
  'Travel / Rotational',
  'Remote',
] as const;

export const SHIFT_REQUIREMENTS = [
  'Day Shift (standard business hours)',
  'Evening Shift',
  'Night Shift',
  'Rotating Shifts',
  'On-Call',
  'No Shift Work',
] as const;

export const SECURITY_CLEARANCE = [
  'None Required',
  'Able to Obtain',
  'Secret',
  'Top Secret',
  'TS/SCI',
] as const;

export const CERTIFICATIONS = [
  'CDCP (Certified Data Centre Professional)',
  'CDCS (Certified Data Centre Specialist)',
  'CDCE (Certified Data Centre Expert)',
  'Uptime Institute ATD/ATS/AOS',
  'CCNA / CCNP / CCIE (Cisco networking)',
  'CompTIA A+ / Network+ / Server+',
  'PMP (Project Management Professional)',
  'PE License (Professional Engineer)',
  'Journeyman Electrician',
] as const;

export const PRICING = {
  BASE_LISTING: 24900, // $249 in cents
  FEATURED_UPGRADE: 14900, // $149 in cents
  LISTING_DURATION: 30, // days
  FEATURED_DURATION: 7, // days
} as const;

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'applications', label: 'Most Applied' },
] as const;
