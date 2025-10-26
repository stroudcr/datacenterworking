import { z } from 'zod';
import { JOB_CATEGORIES, JOB_TYPES } from './constants';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['EMPLOYER', 'JOB_SEEKER']),
  company: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  company: z.string().min(2, 'Company name is required'),
  companyLogo: z.string().optional().or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['Full-time', 'Part-time', 'Contract / Temporary', 'Per Diem', 'Travel / Rotational', 'Remote'] as const),
  category: z.enum(JOB_CATEGORIES as any),
  shift: z.enum(['Day Shift (standard business hours)', 'Evening Shift', 'Night Shift', 'Rotating Shifts', 'On-Call', 'No Shift Work'] as const).optional(),
  clearance: z.enum(['None Required', 'Able to Obtain', 'Secret', 'Top Secret', 'TS/SCI'] as const).optional(),
  certifications: z.enum(['CDCP (Certified Data Centre Professional)', 'CDCS (Certified Data Centre Specialist)', 'CDCE (Certified Data Centre Expert)', 'Uptime Institute ATD/ATS/AOS', 'CCNA / CCNP / CCIE (Cisco networking)', 'CompTIA A+ / Network+ / Server+', 'PMP (Project Management Professional)', 'PE License (Professional Engineer)', 'Journeyman Electrician'] as const).optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
  salary: z.string().optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  hourlyRate: z.string().optional(),
  hourlyRateMin: z.number().min(0).optional(),
  hourlyRateMax: z.number().min(0).optional(),
  applyUrl: z.string().url().optional().or(z.literal('')),
  applyEmail: z.string().email().optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

export const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').optional(),
  resume: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
