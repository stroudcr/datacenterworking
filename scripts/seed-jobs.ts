import { PrismaClient } from '@prisma/client';
import { generateJobSlug } from '../lib/slugify';
import { parseLocation } from '../lib/locations';

const prisma = new PrismaClient();

async function main() {
  // First, create or get a test employer user
  const employer = await prisma.user.upsert({
    where: { email: 'test-employer@datacenter.com' },
    update: {},
    create: {
      email: 'test-employer@datacenter.com',
      password: 'hashed-password-placeholder', // In production, use proper hashing
      name: 'Test Employer',
      role: 'EMPLOYER',
      company: 'DataCenter Solutions Inc.',
    },
  });

  console.log('Created/found employer:', employer.email);

  // Create 4 fake job posts
  const jobs = [
    {
      title: 'Senior Data Center Technician',
      company: 'DataCenter Solutions Inc.',
      location: 'Ashburn, VA',
      type: 'Full-time',
      category: 'Data Center Operations & Production',
      shift: 'Rotating Shifts',
      clearance: 'Secret',
      certifications: 'CDCP (Certified Data Centre Professional)',
      description: `We are seeking an experienced Senior Data Center Technician to join our team in Ashburn, VA. This role involves maintaining critical infrastructure, performing hardware installations, and ensuring 99.999% uptime.

Key Responsibilities:
- Monitor and maintain data center infrastructure
- Perform server installations and decommissions
- Troubleshoot hardware and network issues
- Execute change management procedures
- Maintain accurate documentation

This is an excellent opportunity to work with cutting-edge technology in a mission-critical environment.`,
      requirements: `Required Qualifications:
- 5+ years of data center operations experience
- CDCP certification or equivalent
- Strong knowledge of server hardware and networking
- Experience with DCIM tools
- Ability to lift up to 50lbs
- Active Secret clearance or ability to obtain

Preferred:
- CompTIA Server+ certification
- Experience with automation tools
- ITIL v4 Foundation`,
      salaryMin: 75000,
      salaryMax: 95000,
      salary: '$75,000 - $95,000',
      applyEmail: 'careers@datacentersolutions.com',
      tags: ['Linux', 'Networking', 'Hardware', 'DCIM', 'Monitoring'],
      userId: employer.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    {
      title: 'Critical Facilities Engineer',
      company: 'Global Data Centers LLC',
      location: 'Phoenix, AZ',
      type: 'Full-time',
      category: 'Critical Facilities & Maintenance',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'PE License (Professional Engineer)',
      description: `Global Data Centers LLC is hiring a Critical Facilities Engineer to oversee mechanical and electrical systems at our Phoenix campus. Join a team dedicated to maintaining world-class infrastructure.

What You'll Do:
- Manage HVAC, power distribution, and fire suppression systems
- Perform preventive maintenance on critical equipment
- Lead capacity planning initiatives
- Coordinate with vendors and contractors
- Respond to emergency situations

We offer competitive compensation and excellent benefits including health insurance, 401(k) matching, and professional development opportunities.`,
      requirements: `Must Have:
- Bachelor's degree in Mechanical, Electrical, or related Engineering field
- Professional Engineer (PE) license
- 7+ years experience with critical facility systems
- Knowledge of ASHRAE standards
- Strong project management skills

Nice to Have:
- CDCE certification
- Data center design experience
- PMP certification`,
      salaryMin: 90000,
      salaryMax: 120000,
      salary: '$90,000 - $120,000',
      applyUrl: 'https://careers.globaldatacenters.com/apply',
      tags: ['HVAC', 'Electrical', 'MEP', 'Preventive Maintenance', 'ASHRAE'],
      userId: employer.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Network Operations Center (NOC) Technician',
      company: 'CloudEdge Infrastructure',
      location: 'Remote',
      type: 'Remote',
      category: 'IT, Cloud & Network Infrastructure',
      shift: 'Night Shift',
      clearance: 'Able to Obtain',
      certifications: 'CCNA / CCNP / CCIE (Cisco networking)',
      description: `CloudEdge Infrastructure is expanding our 24/7 Network Operations Center and seeking talented NOC Technicians to join our night shift team. This is a fully remote position with opportunities for growth.

Your Role:
- Monitor network infrastructure and connectivity
- Troubleshoot network incidents and outages
- Document issues and resolutions in ticketing system
- Escalate complex issues to senior engineers
- Perform routine network maintenance tasks

Work from anywhere in the US with a stable internet connection!`,
      requirements: `Requirements:
- CCNA certification (active)
- 2+ years NOC or network support experience
- Strong understanding of TCP/IP, routing, and switching
- Experience with monitoring tools (SolarWinds, PRTG, etc.)
- Excellent communication skills
- Ability to work night shift (10pm-6am)
- Must be able to obtain security clearance

Bonus Skills:
- CCNP certification
- Experience with SD-WAN
- Python or automation experience`,
      hourlyRateMin: 28.50,
      hourlyRateMax: 38.00,
      hourlyRate: '$28.50 - $38.00/hour',
      applyEmail: 'noc-hiring@cloudedge.io',
      tags: ['Cisco', 'Networking', 'NOC', 'Monitoring', 'TCP/IP', 'Remote'],
      userId: employer.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Featured for 7 days
    },
    {
      title: 'Data Center Project Manager',
      company: 'TechBuild Construction',
      location: 'Dallas, TX',
      type: 'Contract / Temporary',
      category: 'Construction & Project Management',
      shift: 'No Shift Work',
      clearance: 'None Required',
      certifications: 'PMP (Project Management Professional)',
      description: `TechBuild Construction is seeking an experienced Data Center Project Manager for a 12-month contract to oversee the construction of a new hyperscale facility in Dallas.

Project Overview:
- 200,000 sq ft greenfield data center
- $150M construction budget
- 24-month timeline
- Tier III design

You'll coordinate with architects, engineers, contractors, and the client to ensure on-time, on-budget delivery of this critical infrastructure project.`,
      requirements: `Required:
- PMP certification
- 5+ years managing data center construction projects
- Experience with projects >$50M
- Strong knowledge of MEP systems
- Proficiency in MS Project, Primavera, or similar
- Bachelor's degree in Construction Management or related field

Preferred:
- LEED certification
- Experience with Tier III/IV facilities
- Understanding of ASHRAE, TIA-942 standards
- Prior hyperscale data center experience`,
      salaryMin: 110000,
      salaryMax: 140000,
      salary: '$110,000 - $140,000 (contract)',
      applyUrl: 'https://techbuild.com/careers/dcpm2024',
      tags: ['Project Management', 'Construction', 'MEP', 'PMP', 'Data Center Design'],
      userId: employer.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const jobData of jobs) {
    const parsedLocation = parseLocation(jobData.location);
    const job = await prisma.job.create({
      data: {
        ...jobData,
        city: parsedLocation.city,
        state: parsedLocation.state,
        locationStates: parsedLocation.states,
        isRemote: parsedLocation.isRemote,
        country: parsedLocation.country,
        slug: '', // Temporary placeholder, will be updated immediately
      },
    });

    // Generate and update slug with the real ID
    const slug = generateJobSlug(job.title, job.location, job.id);
    await prisma.job.update({
      where: { id: job.id },
      data: { slug },
    });

    console.log(`Created job: ${job.title}`);
    console.log(`  Slug: ${slug}\n`);
  }

  console.log('\n✅ Successfully seeded 4 test job posts!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
