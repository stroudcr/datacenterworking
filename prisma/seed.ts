import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test employer user
  const employerPassword = await hash('TestPass123!', 10);
  const employer = await prisma.user.upsert({
    where: { email: 'employer@test.com' },
    update: {},
    create: {
      email: 'employer@test.com',
      password: employerPassword,
      name: 'Test Employer',
      company: 'DataCenter Solutions Inc',
      role: 'EMPLOYER',
    },
  });

  console.log('✓ Created test employer:', employer.email);

  // Create 5 test jobs
  const jobs = [
    {
      title: 'Senior Data Center Technician',
      company: 'DataCenter Solutions Inc',
      location: 'Ashburn, VA',
      type: 'Full-time',
      category: 'Operations',
      shift: 'Day Shift',
      clearance: 'None',
      certifications: 'CompTIA Server+',
      salaryMin: 70000,
      salaryMax: 90000,
      description: `We are seeking an experienced Data Center Technician to join our team in Ashburn, VA. This role involves maintaining critical infrastructure, performing hardware installations, and ensuring 99.99% uptime.

Key Responsibilities:
• Monitor and maintain data center equipment
• Perform server installations and decommissions
• Troubleshoot hardware and network issues
• Execute routine maintenance tasks
• Document all work performed

This is an excellent opportunity to work with cutting-edge technology in a fast-paced environment.`,
      requirements: `• 3+ years of data center experience
• CompTIA Server+ certification required
• Strong understanding of networking fundamentals
• Experience with server hardware (Dell, HP, Supermicro)
• Ability to lift up to 50 lbs
• Excellent problem-solving skills
• Strong communication skills`,
      tags: ['Data Center', 'Server Maintenance', 'Networking', 'Hardware', 'Operations'],
      status: 'ACTIVE',
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    {
      title: 'Data Center Facility Manager',
      company: 'CloudScale Infrastructure',
      location: 'Dallas, TX',
      type: 'Full-time',
      category: 'Management',
      shift: 'Day Shift',
      clearance: 'Secret',
      certifications: 'CDCP',
      salaryMin: 95000,
      salaryMax: 120000,
      description: `CloudScale Infrastructure is looking for an experienced Facility Manager to oversee our 50MW data center in Dallas, TX.

You will be responsible for:
• Managing a team of 15+ technicians
• Ensuring compliance with safety and environmental regulations
• Coordinating maintenance schedules
• Managing vendor relationships
• Overseeing capacity planning
• Maintaining SLA agreements with customers

This role requires strong leadership skills and a deep understanding of data center operations.`,
      requirements: `• 5+ years data center management experience
• Active Secret clearance required
• CDCP certification (Certified Data Centre Professional)
• Bachelor's degree in Engineering or related field
• Experience managing large teams
• Strong understanding of MEP systems
• Excellent leadership and communication skills
• PMP certification preferred`,
      tags: ['Management', 'Leadership', 'Facility Operations', 'Clearance', 'CDCP'],
      status: 'ACTIVE',
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Network Engineer - Data Center',
      company: 'HyperConnect Networks',
      location: 'Chicago, IL',
      type: 'Full-time',
      category: 'Networking',
      shift: 'Day Shift',
      clearance: 'None',
      certifications: 'CCNP',
      salaryMin: 85000,
      salaryMax: 110000,
      description: `Join HyperConnect Networks as a Network Engineer specializing in data center infrastructure. You'll design, implement, and maintain high-performance networks supporting our growing customer base.

What you'll do:
• Design and implement network architectures
• Configure switches, routers, and firewalls
• Perform network troubleshooting and optimization
• Implement security best practices
• Work with automation tools (Ansible, Python)
• Participate in 24/7 on-call rotation`,
      requirements: `• 4+ years of network engineering experience
• CCNP certification required (CCIE preferred)
• Expert knowledge of BGP, OSPF, MPLS
• Experience with Cisco, Arista, Juniper equipment
• Strong understanding of network security
• Python or Ansible scripting experience
• Bachelor's degree in Computer Science or equivalent`,
      tags: ['Networking', 'CCNP', 'BGP', 'Automation', 'Python', 'Cisco'],
      status: 'ACTIVE',
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Electrician',
      company: 'PowerGrid Solutions',
      location: 'Phoenix, AZ',
      type: 'Contract',
      category: 'Electrical',
      shift: 'Rotating Shift',
      clearance: 'None',
      certifications: 'Master Electrician License',
      hourlyRateMin: 45,
      hourlyRateMax: 65,
      description: `PowerGrid Solutions is seeking a Master Electrician for a 6-month contract at our Phoenix data center expansion project.

Responsibilities include:
• Installing and maintaining electrical distribution systems
• Working with 480V/208V power systems
• Installing UPS systems and backup generators
• Performing electrical testing and commissioning
• Ensuring code compliance
• Collaborating with MEP contractors`,
      requirements: `• Master Electrician License (Arizona)
• 5+ years commercial electrical experience
• Data center experience strongly preferred
• Knowledge of NFPA 70E and 70 codes
• Experience with high-voltage systems (480V+)
• Ability to read electrical schematics
• Available for occasional weekend work`,
      tags: ['Electrical', 'Contract', '480V', 'UPS', 'Master Electrician', 'NFPA'],
      status: 'ACTIVE',
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Cloud Infrastructure Engineer',
      company: 'NexGen Cloud Services',
      location: 'Seattle, WA',
      type: 'Full-time',
      category: 'Cloud',
      shift: 'Day Shift',
      clearance: 'Top Secret',
      certifications: 'AWS Solutions Architect',
      salaryMin: 110000,
      salaryMax: 145000,
      description: `NexGen Cloud Services is looking for a Cloud Infrastructure Engineer to support our government customers. This role focuses on designing and maintaining secure cloud infrastructure across AWS and Azure.

Key responsibilities:
• Design secure cloud architectures for classified workloads
• Implement infrastructure as code (Terraform)
• Manage Kubernetes clusters
• Ensure compliance with FedRAMP and DoD standards
• Automate deployment pipelines
• Provide technical guidance to development teams`,
      requirements: `• Active Top Secret clearance with SCI eligibility
• AWS Solutions Architect Professional certification
• 4+ years cloud infrastructure experience
• Strong Terraform and Kubernetes knowledge
• Experience with FedRAMP/DoD compliance
• Bachelor's degree in Computer Science
• Python or Go programming skills
• Azure certification (bonus)`,
      tags: ['Cloud', 'AWS', 'Kubernetes', 'Terraform', 'Clearance', 'FedRAMP', 'Top Secret'],
      status: 'ACTIVE',
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const jobData of jobs) {
    const job = await prisma.job.create({
      data: {
        ...jobData,
        userId: employer.id,
        slug: jobData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 8),
      },
    });
    console.log(`✓ Created job: ${job.title}`);
  }

  console.log('\n✅ Seed completed successfully!');
  console.log('\nTest credentials:');
  console.log('  Email: employer@test.com');
  console.log('  Password: TestPass123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
