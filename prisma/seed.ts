import { PrismaClient, JobStatus } from '@prisma/client';
import { hash } from 'bcryptjs';
import { parseLocation } from '../lib/locations';

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

  // Create test jobs
  const jobs = [
    {
      title: 'Senior Data Center Technician',
      company: 'DataCenter Solutions Inc',
      location: 'Ashburn, VA',
      type: 'Full-time',
      category: 'Data Center Operations & Production',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CompTIA A+ / Network+ / Server+',
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
      status: JobStatus.ACTIVE,
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Facility Manager',
      company: 'CloudScale Infrastructure',
      location: 'Dallas, TX',
      type: 'Full-time',
      category: 'Management & Executive Leadership',
      shift: 'Day Shift (standard business hours)',
      clearance: 'Secret',
      certifications: 'CDCP (Certified Data Centre Professional)',
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
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Network Engineer - Data Center',
      company: 'HyperConnect Networks',
      location: 'Chicago, IL',
      type: 'Full-time',
      category: 'IT, Cloud & Network Infrastructure',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CCNA / CCNP / CCIE (Cisco networking)',
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
      status: JobStatus.ACTIVE,
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Electrician',
      company: 'PowerGrid Solutions',
      location: 'Phoenix, AZ',
      type: 'Contract / Temporary',
      category: 'Critical Facilities & Maintenance',
      shift: 'Rotating Shifts',
      clearance: 'None Required',
      certifications: 'Journeyman Electrician',
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
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Cloud Infrastructure Engineer',
      company: 'NexGen Cloud Services',
      location: 'Seattle, WA',
      type: 'Full-time',
      category: 'IT, Cloud & Network Infrastructure',
      shift: 'Day Shift (standard business hours)',
      clearance: 'Top Secret',
      certifications: 'CDCP (Certified Data Centre Professional)',
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
      status: JobStatus.ACTIVE,
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    // Additional 20+ jobs
    {
      title: 'HVAC Technician - Critical Facilities',
      company: 'CoolTech Systems',
      location: 'Atlanta, GA',
      type: 'Full-time',
      category: 'Critical Facilities & Maintenance',
      shift: 'Rotating Shifts',
      clearance: 'Able to Obtain',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 55000,
      salaryMax: 75000,
      description: `CoolTech Systems needs an experienced HVAC technician to maintain precision cooling systems in our Atlanta data center. You'll ensure optimal environmental conditions for mission-critical equipment.

Key Duties:
• Maintain CRAC/CRAH units and chillers
• Monitor BMS systems and temperature/humidity levels
• Perform preventive maintenance on cooling infrastructure
• Troubleshoot and repair HVAC equipment failures
• Maintain hot/cold aisle containment systems
• Document all maintenance activities`,
      requirements: `• EPA 608 Universal certification required
• 3+ years HVAC experience (commercial/industrial)
• Data center HVAC experience preferred
• Understanding of precision cooling systems
• Ability to work on-call rotation
• Strong troubleshooting skills
• Physically able to work in confined spaces`,
      tags: ['HVAC', 'Cooling', 'CRAC', 'Preventive Maintenance', 'Critical Facilities'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Project Manager',
      company: 'BuildTech Construction',
      location: 'Austin, TX',
      type: 'Full-time',
      category: 'Construction & Project Management',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'PMP (Project Management Professional)',
      salaryMin: 90000,
      salaryMax: 125000,
      description: `BuildTech Construction is seeking a Project Manager for our data center build-out projects. You'll oversee construction from planning through commissioning.

Responsibilities:
• Manage multiple data center construction projects ($10M-$50M)
• Coordinate with architects, engineers, and contractors
• Ensure projects stay on schedule and within budget
• Manage stakeholder communications
• Oversee quality control and safety compliance
• Lead commissioning and turnover activities`,
      requirements: `• PMP certification required
• 5+ years project management experience
• Data center construction experience essential
• Bachelor's degree in Construction Management or Engineering
• Strong knowledge of MEP systems
• Proficiency with MS Project, Primavera P6
• Excellent communication and leadership skills`,
      tags: ['Project Management', 'Construction', 'PMP', 'MEP', 'Commissioning'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Mechanical Engineer - Data Center Design',
      company: 'EngiCorp Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      category: 'Engineering & Design',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'PE License (Professional Engineer)',
      salaryMin: 95000,
      salaryMax: 135000,
      description: `EngiCorp Solutions is looking for a Mechanical Engineer to design cooling and mechanical systems for hyperscale data centers.

What you'll do:
• Design HVAC and mechanical systems for data centers
• Perform load calculations and CFD analysis
• Create mechanical specifications and drawings
• Coordinate with electrical and structural teams
• Review contractor submittals
• Support commissioning activities`,
      requirements: `• PE License required (Mechanical)
• 4+ years MEP design experience
• Data center design experience required
• Proficiency with AutoCAD, Revit MEP
• Experience with CFD modeling software
• Strong understanding of Tier standards
• LEED AP certification preferred`,
      tags: ['Mechanical Engineering', 'HVAC Design', 'PE License', 'CFD', 'MEP'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Information Security Analyst - Data Center',
      company: 'SecureNet Industries',
      location: 'Washington, DC',
      type: 'Full-time',
      category: 'Security & Compliance',
      shift: 'Day Shift (standard business hours)',
      clearance: 'TS/SCI',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 95000,
      salaryMax: 130000,
      description: `SecureNet Industries seeks an Information Security Analyst to ensure compliance and security of our government data center facilities.

Responsibilities:
• Conduct security assessments and audits
• Ensure compliance with NIST, FedRAMP, FISMA standards
• Manage physical and logical access controls
• Investigate security incidents
• Develop and update security policies
• Coordinate with government security officers`,
      requirements: `• Active TS/SCI clearance required
• CISSP, CISM, or Security+ certification
• 3+ years information security experience
• Knowledge of government compliance frameworks
• Experience with security audit tools
• Strong written and verbal communication
• Bachelor's degree in Cybersecurity or related field`,
      tags: ['Information Security', 'Compliance', 'TS/SCI', 'FedRAMP', 'NIST', 'CISSP'],
      status: JobStatus.ACTIVE,
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Director of Data Center Operations',
      company: 'MegaScale Hosting',
      location: 'New York, NY',
      type: 'Full-time',
      category: 'Management & Executive Leadership',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCE (Certified Data Centre Expert)',
      salaryMin: 150000,
      salaryMax: 200000,
      description: `MegaScale Hosting is seeking a Director of Data Center Operations to lead our East Coast operations across 5 facilities.

Strategic Leadership:
• Oversee 100+ staff across multiple data centers
• Develop operational strategies and KPIs
• Manage $20M+ annual operating budget
• Drive continuous improvement initiatives
• Ensure 99.999% uptime SLAs
• Partner with executive team on growth strategy`,
      requirements: `• 10+ years data center operations experience
• 5+ years senior leadership experience
• CDCE or equivalent certification
• MBA or advanced degree preferred
• Proven track record managing large teams
• Strong P&L management experience
• Excellent strategic thinking and communication
• Experience with colocation and cloud services`,
      tags: ['Executive', 'Director', 'Leadership', 'Operations', 'Strategy', 'CDCE'],
      status: JobStatus.ACTIVE,
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Enterprise Sales Executive - Colocation',
      company: 'DataVault Services',
      location: 'Boston, MA',
      type: 'Full-time',
      category: 'Sales, Business Development & Account Management',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 80000,
      salaryMax: 120000,
      description: `DataVault Services is looking for a Sales Executive to drive new colocation and cloud service sales. Uncapped commission potential.

Sales Responsibilities:
• Generate and close new enterprise business ($500K+ deals)
• Manage full sales cycle from prospecting to contract
• Conduct technical needs assessments
• Develop customized solution proposals
• Build relationships with C-level executives
• Achieve quarterly and annual revenue targets

Base + Commission structure with $200K+ OTE`,
      requirements: `• 3+ years B2B technology sales experience
• Data center, cloud, or infrastructure sales preferred
• Proven track record of exceeding quotas
• Strong technical aptitude
• Excellent presentation and negotiation skills
• Salesforce CRM experience
• Bachelor's degree preferred`,
      tags: ['Sales', 'Business Development', 'Colocation', 'Enterprise', 'Commission'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'AI/ML Infrastructure Specialist',
      company: 'NeuralScale AI',
      location: 'San Jose, CA',
      type: 'Full-time',
      category: 'Emerging Technologies & Specialty Roles',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 130000,
      salaryMax: 180000,
      description: `NeuralScale AI is seeking an Infrastructure Specialist to design and operate GPU clusters for AI/ML workloads.

Key Focus Areas:
• Deploy and maintain NVIDIA DGX and HGX systems
• Optimize GPU cluster performance and utilization
• Implement high-speed InfiniBand/RoCE networks
• Manage storage systems for ML datasets (100+ PB)
• Troubleshoot GPU hardware and driver issues
• Work with data scientists on infrastructure needs`,
      requirements: `• 3+ years GPU/HPC infrastructure experience
• Deep knowledge of NVIDIA hardware and CUDA
• Experience with InfiniBand, NVLink, GPUDirect
• Strong Linux administration skills
• Understanding of ML frameworks (PyTorch, TensorFlow)
• Python scripting for automation
• Bachelor's in Computer Science or related field`,
      tags: ['AI', 'GPU', 'Machine Learning', 'NVIDIA', 'HPC', 'InfiniBand'],
      status: JobStatus.ACTIVE,
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Procurement Specialist',
      company: 'Global DC Holdings',
      location: 'Denver, CO',
      type: 'Full-time',
      category: 'Support Functions',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 65000,
      salaryMax: 85000,
      description: `Global DC Holdings needs a Procurement Specialist to manage vendor relationships and equipment purchasing for our data center portfolio.

Procurement Duties:
• Source and negotiate contracts for DC equipment
• Manage vendor relationships (Dell, Cisco, APC, etc.)
• Process purchase orders and track deliveries
• Maintain equipment inventory and spare parts
• Negotiate pricing and service agreements
• Coordinate with operations teams on requirements`,
      requirements: `• 2+ years procurement/supply chain experience
• Data center or IT equipment experience preferred
• Strong negotiation skills
• Proficiency with ERP systems (SAP, Oracle)
• Excellent Excel and analytical skills
• Understanding of networking and server hardware
• Strong attention to detail`,
      tags: ['Procurement', 'Supply Chain', 'Vendor Management', 'Purchasing'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Operations Technician - Night Shift',
      company: 'AlwaysOn Data Centers',
      location: 'Las Vegas, NV',
      type: 'Full-time',
      category: 'Data Center Operations & Production',
      shift: 'Night Shift',
      clearance: 'None Required',
      certifications: 'CompTIA A+ / Network+ / Server+',
      salaryMin: 52000,
      salaryMax: 68000,
      description: `AlwaysOn Data Centers is hiring for our night shift operations team. This role ensures 24/7 monitoring and hands-on support.

Night Shift Responsibilities:
• Monitor building management and DCIM systems
• Respond to alarms and critical incidents
• Perform server installations and cable management
• Execute remote hands tickets for customers
• Conduct facility rounds and inspections
• Maintain incident logs and documentation

Shift differential: +15% base pay for night hours`,
      requirements: `• 1+ years data center or IT operations experience
• CompTIA A+, Network+, or Server+ preferred
• Ability to work 12-hour night shifts (7pm-7am)
• Basic understanding of networking and servers
• Strong troubleshooting skills
• Ability to lift 50 lbs
• Reliable and detail-oriented`,
      tags: ['Operations', 'Night Shift', 'Monitoring', 'Remote Hands', 'Entry Level'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Electrical Engineer - Power Systems',
      company: 'PowerTech Engineering',
      location: 'Charlotte, NC',
      type: 'Full-time',
      category: 'Engineering & Design',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'PE License (Professional Engineer)',
      salaryMin: 90000,
      salaryMax: 125000,
      description: `PowerTech Engineering seeks an Electrical Engineer to design power distribution systems for mission-critical facilities.

Design Responsibilities:
• Design medium and low voltage electrical systems
• Perform load calculations and arc flash analysis
• Specify UPS, generators, and switchgear
• Create single-line diagrams and panel schedules
• Review shop drawings and submittals
• Support commissioning and startup`,
      requirements: `• PE License (Electrical) required
• 4+ years electrical design experience
• Data center or mission-critical experience required
• Proficiency with AutoCAD Electrical, Revit
• Knowledge of NFPA 70, 70E, 110
• Experience with ETAP or SKM PowerTools
• Strong understanding of Tier standards`,
      tags: ['Electrical Engineering', 'Power Systems', 'PE License', 'UPS', 'Arc Flash'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Site Superintendent',
      company: 'Summit Construction Group',
      location: 'Raleigh, NC',
      type: 'Contract / Temporary',
      category: 'Construction & Project Management',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'PMP (Project Management Professional)',
      hourlyRateMin: 55,
      hourlyRateMax: 75,
      description: `Summit Construction Group needs a Site Superintendent for a 12-month data center construction project (150,000 sq ft).

Site Leadership:
• Supervise daily construction activities and subcontractors
• Ensure quality, safety, and schedule compliance
• Coordinate MEP trades and resolve conflicts
• Conduct daily meetings and safety briefings
• Review RFIs and submittals
• Track project milestones and deliverables`,
      requirements: `• 7+ years construction superintendent experience
• Data center or mission-critical experience required
• OSHA 30 certification
• Strong knowledge of MEP systems
• Experience with Procore or similar software
• Excellent leadership and communication skills
• Ability to read blueprints and specifications`,
      tags: ['Construction', 'Superintendent', 'Contract', 'MEP', 'Safety'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'DevOps Engineer - Infrastructure Automation',
      company: 'CloudFirst Technologies',
      location: 'Remote',
      type: 'Remote',
      category: 'IT, Cloud & Network Infrastructure',
      shift: 'No Shift Work',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 105000,
      salaryMax: 140000,
      description: `CloudFirst Technologies is seeking a DevOps Engineer to build automation for our global infrastructure.

DevOps Focus:
• Build CI/CD pipelines for infrastructure deployments
• Implement infrastructure as code (Terraform, Ansible)
• Manage containerized workloads (Docker, Kubernetes)
• Automate monitoring and alerting (Prometheus, Grafana)
• Optimize cloud costs and resource utilization
• Participate in on-call rotation

Fully remote position with flexible hours`,
      requirements: `• 4+ years DevOps or Infrastructure experience
• Expert knowledge of Terraform and Ansible
• Strong Kubernetes and Docker experience
• Proficiency with AWS, Azure, or GCP
• Python or Go scripting skills
• Experience with GitOps workflows
• Bachelor's degree in CS or equivalent experience`,
      tags: ['DevOps', 'Terraform', 'Kubernetes', 'Automation', 'Remote', 'CI/CD'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Physical Security Manager - Data Centers',
      company: 'SecureGuard Facilities',
      location: 'Miami, FL',
      type: 'Full-time',
      category: 'Security & Compliance',
      shift: 'Day Shift (standard business hours)',
      clearance: 'Able to Obtain',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 75000,
      salaryMax: 95000,
      description: `SecureGuard Facilities is hiring a Physical Security Manager to oversee security operations at our Miami campus.

Security Leadership:
• Manage security guard force and operations
• Oversee access control and video surveillance systems
• Conduct security audits and risk assessments
• Develop and enforce security policies
• Investigate security incidents
• Coordinate with law enforcement when needed`,
      requirements: `• 5+ years security management experience
• Data center or critical infrastructure background
• Experience with PACS and VMS systems
• Knowledge of SOC 2, ISO 27001, PCI-DSS
• Strong leadership and communication skills
• CPP or PSP certification preferred
• Prior military or law enforcement experience valued`,
      tags: ['Physical Security', 'Access Control', 'Security Management', 'CCTV'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Senior Account Manager - Enterprise Clients',
      company: 'DataHaven Colocation',
      location: 'Portland, OR',
      type: 'Full-time',
      category: 'Sales, Business Development & Account Management',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 75000,
      salaryMax: 95000,
      description: `DataHaven Colocation needs a Senior Account Manager to nurture relationships with our Fortune 500 clients.

Account Management:
• Manage portfolio of 20+ enterprise accounts ($10M+ ARR)
• Drive expansion and upsell opportunities
• Conduct quarterly business reviews
• Resolve escalations and service issues
• Collaborate with sales and operations teams
• Ensure high customer satisfaction and retention`,
      requirements: `• 4+ years account management experience
• Data center or technology services background
• Proven track record of account growth
• Strong relationship building skills
• Technical understanding of infrastructure services
• Salesforce experience required
• Bachelor's degree preferred`,
      tags: ['Account Management', 'Customer Success', 'Enterprise', 'Colocation'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Quantum Computing Infrastructure Engineer',
      company: 'QuantumCore Labs',
      location: 'Cambridge, MA',
      type: 'Full-time',
      category: 'Emerging Technologies & Specialty Roles',
      shift: 'Day Shift (standard business hours)',
      clearance: 'Secret',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 140000,
      salaryMax: 190000,
      description: `QuantumCore Labs is seeking an Infrastructure Engineer to support our quantum computing research facility.

Unique Responsibilities:
• Maintain cryogenic cooling systems for quantum processors
• Manage ultra-low temperature monitoring (millikelvin range)
• Support quantum control electronics and RF systems
• Coordinate with research scientists on infrastructure needs
• Maintain environmental controls and vibration isolation
• Document specialized maintenance procedures`,
      requirements: `• Active Secret clearance required
• Physics or Engineering degree (Master's preferred)
• Experience with cryogenic systems (dilution refrigerators)
• Strong understanding of RF and microwave systems
• Knowledge of quantum computing principles
• Exceptional problem-solving abilities
• Experience in research/lab environments`,
      tags: ['Quantum Computing', 'Cryogenics', 'Research', 'Clearance', 'Emerging Tech'],
      status: JobStatus.ACTIVE,
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center HR Coordinator',
      company: 'MegaColo Inc',
      location: 'Minneapolis, MN',
      type: 'Full-time',
      category: 'Support Functions',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 50000,
      salaryMax: 65000,
      description: `MegaColo Inc is hiring an HR Coordinator to support recruitment and employee programs for our operations team.

HR Responsibilities:
• Coordinate hiring process for technical positions
• Onboard new data center employees
• Maintain training records and certifications
• Process background checks and security clearances
• Administer benefits and time-off requests
• Support employee engagement initiatives`,
      requirements: `• 2+ years HR or recruiting experience
• Understanding of technical roles preferred
• Experience with HRIS systems (Workday, ADP)
• Strong organizational skills
• Excellent communication abilities
• SHRM-CP or PHR certification preferred
• Bachelor's degree in HR or Business`,
      tags: ['Human Resources', 'Recruiting', 'HR Coordinator', 'Benefits'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Cable Installer',
      company: 'NetWire Solutions',
      location: 'Columbus, OH',
      type: 'Contract / Temporary',
      category: 'Data Center Operations & Production',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CompTIA A+ / Network+ / Server+',
      hourlyRateMin: 22,
      hourlyRateMax: 32,
      description: `NetWire Solutions needs cable installers for a 4-month data center build-out project.

Installation Tasks:
• Install Cat6/Cat6A network cabling
• Run fiber optic cables and perform terminations
• Install overhead cable trays and ladder racks
• Label and document all cable runs
• Maintain clean and organized installations
• Follow TIA/EIA standards`,
      requirements: `• 1+ years structured cabling experience
• BICSI certification preferred
• Experience with fiber optics
• Ability to read cable plans and blueprints
• Comfortable working on ladders and lifts
• Attention to detail
• Reliable transportation`,
      tags: ['Cable Installation', 'Structured Cabling', 'Contract', 'Fiber Optics'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Critical Facilities Engineer',
      company: 'EdgePoint Data Centers',
      location: 'Jacksonville, FL',
      type: 'Full-time',
      category: 'Critical Facilities & Maintenance',
      shift: 'On-Call',
      clearance: 'None Required',
      certifications: 'Uptime Institute ATD/ATS/AOS',
      salaryMin: 80000,
      salaryMax: 105000,
      description: `EdgePoint Data Centers is seeking a Critical Facilities Engineer to maintain our 24MW facility.

Facility Engineering:
• Maintain electrical, mechanical, and fire systems
• Perform preventive and corrective maintenance
• Manage BMS and EPMS systems
• Troubleshoot equipment failures and outages
• Coordinate with vendors on repairs
• Participate in 24/7 on-call rotation

Tier III certified facility`,
      requirements: `• 4+ years critical facilities experience
• Strong electrical and mechanical knowledge
• Experience with UPS, generators, HVAC systems
• Uptime Institute certifications preferred
• Ability to respond to on-call emergencies
• Excellent documentation skills
• Associate degree in technical field`,
      tags: ['Critical Facilities', 'Preventive Maintenance', 'BMS', 'On-Call', 'Tier III'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Commissioning Engineer',
      company: 'CommissionPro Services',
      location: 'Salt Lake City, UT',
      type: 'Travel / Rotational',
      category: 'Engineering & Design',
      shift: 'No Shift Work',
      clearance: 'None Required',
      certifications: 'Uptime Institute ATD/ATS/AOS',
      salaryMin: 95000,
      salaryMax: 125000,
      description: `CommissionPro Services needs a Commissioning Engineer for data center projects across the western US. 75% travel.

Commissioning Scope:
• Perform integrated systems testing (IST)
• Validate electrical and mechanical systems
• Witness factory acceptance tests (FAT)
• Develop commissioning plans and test procedures
• Document results and create punch lists
• Support startups and performance verification

Per diem + travel expenses covered`,
      requirements: `• 5+ years commissioning experience
• Data center commissioning required
• Electrical or Mechanical Engineering degree
• Knowledge of NFPA, ASHRAE, Uptime standards
• Willing to travel extensively (75%+)
• Strong technical writing skills
• Uptime AOS certification preferred`,
      tags: ['Commissioning', 'IST', 'Travel', 'Testing', 'Uptime Institute'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Cybersecurity Compliance Officer',
      company: 'ComplianceFirst DC',
      location: 'Arlington, VA',
      type: 'Full-time',
      category: 'Security & Compliance',
      shift: 'Day Shift (standard business hours)',
      clearance: 'Secret',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 90000,
      salaryMax: 120000,
      description: `ComplianceFirst DC is hiring a Compliance Officer to manage SOC 2, ISO 27001, and government compliance programs.

Compliance Duties:
• Maintain SOC 2 Type II and ISO 27001 certifications
• Prepare for compliance audits
• Develop and update policies and procedures
• Conduct internal compliance assessments
• Manage vendor security assessments
• Track and remediate audit findings`,
      requirements: `• Active Secret clearance preferred
• 3+ years compliance or audit experience
• Knowledge of SOC 2, ISO 27001, NIST frameworks
• CISSP, CISA, or CRISC certification
• Strong understanding of data center operations
• Excellent documentation skills
• Bachelor's degree in IT or related field`,
      tags: ['Compliance', 'SOC 2', 'ISO 27001', 'Audit', 'NIST', 'Clearance'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'VP of Strategic Accounts',
      company: 'GlobalColo Networks',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      category: 'Sales, Business Development & Account Management',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 140000,
      salaryMax: 180000,
      description: `GlobalColo Networks is seeking a VP of Strategic Accounts to manage our largest clients and drive multi-million dollar expansions.

Strategic Leadership:
• Manage C-level relationships with top 10 clients ($50M+ ARR)
• Develop long-term strategic account plans
• Lead contract negotiations and renewals
• Identify expansion opportunities across services
• Collaborate with product and operations teams
• Represent company at industry events

Base + Equity + Performance Bonus`,
      requirements: `• 10+ years enterprise sales or account management
• Data center or cloud services experience required
• Proven track record managing $10M+ accounts
• Strong C-level relationship building
• MBA preferred
• Exceptional negotiation and presentation skills
• Willingness to travel (40%)`,
      tags: ['Vice President', 'Strategic Accounts', 'Enterprise Sales', 'Executive'],
      status: JobStatus.ACTIVE,
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Edge Computing Platform Engineer',
      company: 'EdgeWave Technologies',
      location: 'Detroit, MI',
      type: 'Full-time',
      category: 'Emerging Technologies & Specialty Roles',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 100000,
      salaryMax: 140000,
      description: `EdgeWave Technologies is building the next generation of edge computing infrastructure. We need a Platform Engineer to deploy and manage edge nodes.

Edge Computing Focus:
• Deploy containerized workloads to edge locations
• Manage distributed Kubernetes clusters (100+ sites)
• Implement zero-touch provisioning systems
• Monitor edge node health and performance
• Optimize for low-latency applications (5G, IoT)
• Develop automation for edge operations`,
      requirements: `• 4+ years infrastructure or platform engineering
• Strong Kubernetes and container expertise
• Experience with edge computing or CDN infrastructure
• Knowledge of 5G and IoT architectures
• Proficiency with GitOps and IaC tools
• Python or Go programming skills
• Understanding of networking and SD-WAN`,
      tags: ['Edge Computing', 'Kubernetes', '5G', 'IoT', 'Distributed Systems'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Center Finance Analyst',
      company: 'InfraMetrics Advisors',
      location: 'Houston, TX',
      type: 'Full-time',
      category: 'Support Functions',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CDCP (Certified Data Centre Professional)',
      salaryMin: 70000,
      salaryMax: 90000,
      description: `InfraMetrics Advisors is seeking a Finance Analyst to support budgeting, forecasting, and financial analysis for our data center portfolio.

Financial Analysis:
• Develop operating and capital budgets
• Prepare monthly financial reports and variance analysis
• Analyze power costs and PUE metrics
• Support pricing models for customer proposals
• Track capex projects and ROI
• Assist with annual audits`,
      requirements: `• 3+ years finance or accounting experience
• Data center or real estate background preferred
• Advanced Excel and financial modeling skills
• Experience with NetSuite or similar ERP
• Strong analytical and problem-solving abilities
• Bachelor's degree in Finance or Accounting
• CPA or CFA progress preferred`,
      tags: ['Finance', 'Financial Analysis', 'Budgeting', 'FP&A', 'Analyst'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Fiber Optic Technician - OSP',
      company: 'FiberLink Infrastructure',
      location: 'Kansas City, MO',
      type: 'Full-time',
      category: 'Data Center Operations & Production',
      shift: 'Day Shift (standard business hours)',
      clearance: 'None Required',
      certifications: 'CompTIA A+ / Network+ / Server+',
      salaryMin: 55000,
      salaryMax: 72000,
      description: `FiberLink Infrastructure needs a Fiber Optic Technician to install and maintain outside plant (OSP) fiber connecting our data centers.

Fiber Responsibilities:
• Install and splice single-mode and multi-mode fiber
• Perform OTDR testing and troubleshooting
• Maintain fiber patch panels and distribution frames
• Document fiber routes and splice points
• Respond to fiber cuts and outages
• Work in manholes and aerial environments`,
      requirements: `• 2+ years fiber optic installation experience
• FOA CFOT certification preferred
• Proficiency with fusion splicing
• Experience with OTDR and power meters
• Comfortable working outdoors and underground
• Valid driver's license
• Ability to lift 75 lbs`,
      tags: ['Fiber Optics', 'OSP', 'Splicing', 'OTDR', 'Outside Plant'],
      status: JobStatus.ACTIVE,
      isFeatured: false,
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
