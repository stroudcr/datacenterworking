export const employerPages = {
  'hire-data-center-technicians': {
    title: 'Hire Data Center Technicians',
    description: 'Reach candidates searching for data center technician, operations and hardware roles.',
    headline: 'Hire data center technicians without advertising to a generic audience',
    intro: 'Publish technician roles with the details candidates use to evaluate shift work, location, certifications, clearance and compensation.',
    topics: ['Break/fix and remote hands', 'Rack, stack and cabling', 'Hardware diagnostics and ticketing'],
  },
  'hire-critical-facilities-technicians': {
    title: 'Hire Critical Facilities Technicians',
    description: 'Advertise critical facilities, electrical, mechanical and maintenance roles.',
    headline: 'Find candidates for critical facilities operations',
    intro: 'Make electrical, mechanical, controls, maintenance and shift expectations clear to people searching specifically within data center facilities.',
    topics: ['Electrical and mechanical systems', 'BMS, EPMS and controls', 'Shift, on-call and certification requirements'],
  },
  'data-center-construction-recruiting': {
    title: 'Data Center Construction Recruiting',
    description: 'Advertise data center construction, commissioning and project delivery roles.',
    headline: 'Recruit for data center construction and project delivery',
    intro: 'Reach job seekers evaluating mission-critical construction, commissioning, design and project management opportunities.',
    topics: ['Superintendents and project managers', 'Commissioning and QA/QC', 'Electrical, mechanical and design engineering'],
  },
  recruiters: {
    title: 'Data Center Job Advertising for Recruiters',
    description: 'A focused advertising option for recruiters and agencies filling data center roles.',
    headline: 'A focused job board for recruiters filling data center roles',
    intro: 'Use data center-specific categories and filters to present client opportunities with a direct ATS, email or on-platform application route.',
    topics: ['Single-role job advertising', 'Multiple locations and recurring searches', 'Agency and partnership inquiries'],
  },
} as const;

export type EmployerPageSlug = keyof typeof employerPages;
