# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Work In Data Center** - A premium data center job board built with Next.js 16, featuring Stripe payments, PostgreSQL database, and glassmorphism UI with icy blue/silver theme.

**Live URL**: https://workindatacenter.com
**Stack**: Next.js 16 (App Router), Prisma ORM, PostgreSQL, Stripe, Tailwind CSS

## Common Development Commands

### Development
```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production (includes prisma generate)
npm start                # Start production server
npm run lint             # Run ESLint
```

### Database Operations
```bash
npx prisma generate                    # Generate Prisma Client (auto-runs on postinstall)
npx prisma migrate dev --name <name>   # Create and apply migration
npx prisma migrate deploy              # Apply migrations in production
npx prisma studio                      # Open database GUI browser
npx prisma db push                     # Push schema changes without migration
npx tsx prisma/seed.ts                 # Seed database with test data
```

### Stripe Testing
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook  # Forward webhooks locally
# Test card: 4242 4242 4242 4242, any future expiry, any CVC
```

## High-Level Architecture

### Authentication System
- **JWT-based** auth with httpOnly cookies
- Tokens stored in cookies (NOT localStorage) for security
- Helper functions in `lib/auth.ts`:
  - `getUser()`: Get current user from request
  - `hashPassword()`: bcrypt password hashing
  - `verifyPassword()`: Compare passwords
- API routes: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`

### Job Posting Payment Flow
1. Employer fills job form at `/post-job` (multi-step form with validation)
2. Creates Stripe Checkout session via `/api/jobs` POST
3. Stripe redirects to checkout (base: $249, featured upgrade: +$149)
4. Webhook at `/api/stripe/webhook` receives `checkout.session.completed`
5. Job status updated to ACTIVE, featured flag set if applicable
6. Job expires after 30 days, featured status after 7 days

**Critical**: Always verify Stripe signatures in webhook handler using `STRIPE_WEBHOOK_SECRET`.

### Database Schema Key Points

**User Model**:
- Roles: `EMPLOYER`, `JOB_SEEKER`, `ADMIN`
- Single authentication for all user types
- Employers create jobs, seekers apply and save jobs

**Job Model**:
- **slug**: Unique URL-friendly identifier (auto-generated from title + random string)
- **managementToken**: Allows job editing without login (email link)
- Status: `PENDING` → `ACTIVE` → `EXPIRED` / `DELETED`
- Featured jobs: `isFeatured=true`, `featuredUntil` timestamp
- Indexed fields: slug, category, type, shift, clearance, certifications, status

**Application Model**:
- Links users to jobs they've applied to
- Unique constraint on `(jobId, userId)` - one application per user per job
- Tracks status: "pending", "reviewed", "accepted", "rejected"

**Payment Model**:
- One-to-one with Job (each job has exactly one payment)
- Links to Stripe session ID for reconciliation
- Tracks featured upgrade purchases

### Job Categories
10 specialized categories defined in `lib/constants.ts`:
1. Data Center Operations & Production
2. Critical Facilities & Maintenance
3. Engineering & Design
4. Construction & Project Management
5. IT, Cloud & Network Infrastructure
6. Security & Compliance
7. Management & Executive Leadership
8. Sales, Business Development & Account Management
9. Emerging Technologies & Specialty Roles
10. Support Functions

Also supports: job types (Full-time, Contract, etc.), shift requirements, security clearance levels, and certifications.

### URL Structure & Routing
- Homepage: `/` - Job listings with filtering
- Job detail: `/jobs/[slug]` - Uses slug, NOT numeric ID
- Apply: `/jobs/[slug]/apply` - Application form
- Manage job: `/jobs/manage/[jobId]` - Edit/delete via managementToken
- Employer dashboard: `/dashboard/employer` - View posted jobs & analytics
- Seeker dashboard: `/dashboard/seeker` - Saved jobs & applications
- Admin panel: `/admin` - Job moderation (requires ADMIN role)

### SEO Implementation
- **robots.txt**: Allows all crawlers including AI bots (ChatGPT, SearchGPT, GPTBot)
- **sitemap.xml**: Dynamic sitemap at `/sitemap.ts` with all active jobs
- **Structured data**: JobPosting schema on all job pages for Google for Jobs
- **Meta tags**: Dynamic OpenGraph and Twitter Cards per page
- **Organization schema**: Site-wide brand identity
- Environment variable `NEXT_PUBLIC_SITE_URL` must be set for canonical URLs

### Component Architecture

**Glassmorphism Design System** (`components/`):
- `GlassCard.tsx`: Base card with frosted glass effect
- `Button.tsx`: Styled button with hover effects
- `Input.tsx`, `Textarea.tsx`: Form inputs with glass styling
- `Header.tsx`: Navigation with user authentication state
- `JobCard.tsx`: Job listing card with featured badge
- `FilterSidebar.tsx`: Category/type/shift/clearance filters

**Client Components** (marked with 'use client'):
- `JobListingsClient.tsx`: Handles filtering/sorting state
- `FilterSidebar.tsx`: Interactive filter UI
- `SaveJobButton.tsx`: Bookmark toggle with optimistic updates
- `ViewTracker.tsx`: Increments view count on page load
- `ApplyButton.tsx`: Application form modal trigger

### File Upload Strategy
- **Cloudinary** integration for company logos (optional)
- Component: `CloudinaryUploadWidget.tsx`
- Environment vars: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- Images stored as URLs in Job model (`companyLogo` field)

### Email System (Optional)
- **Resend** integration via `RESEND_API_KEY`
- Newsletter subscriptions stored in `Newsletter` model
- User notification preferences in `NotificationPreferences` model
- Contact form API at `/api/contact`

### Performance Optimizations
- **ISR (Incremental Static Regeneration)**: Homepage and job pages use `revalidate`
- **Optional Redis caching**: See REDIS_CACHING_GUIDE.md for Vercel KV or Upstash setup
- **Database indexes**: All commonly filtered fields (category, type, shift, clearance, status)
- **Vercel Analytics**: Integrated via `@vercel/analytics` package

## Environment Configuration

### Required Variables
```bash
DATABASE_URL                          # PostgreSQL connection (use Neon pooled connection for production)
JWT_SECRET                            # Min 32 chars (openssl rand -base64 32)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY    # Stripe public key
STRIPE_SECRET_KEY                     # Stripe secret key
STRIPE_WEBHOOK_SECRET                 # Stripe webhook signing secret
NEXT_PUBLIC_SITE_URL                  # Production: https://workindatacenter.com
```

### Optional Variables
```bash
RESEND_API_KEY                        # Email service
EMAIL_FROM                            # From email address
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME     # Image uploads
ADMIN_EMAIL                           # Admin user email
```

See `.env.example` for complete reference.

## Important Implementation Details

### Slug Generation
Jobs use **slugs** (not numeric IDs) for URLs:
- Generated from title + random string for uniqueness
- Example: "data-center-technician-abc123"
- Utility: `lib/slugify.ts`
- Always use slug in URLs, but query by `id` or `slug` in database

### Management Tokens
Jobs can be edited via email link without login:
- Token generated on job creation (`lib/tokens.ts`)
- Stored in `Job.managementToken` field
- Used at `/jobs/manage/[jobId]?token=xxx`
- Validates token before allowing edits/deletes

### Featured Job Logic
- Featured jobs show at top of listings
- Badge displayed on `JobCard`
- Expires after 7 days (`featuredUntil` timestamp)
- Costs additional $149 on top of $249 base listing
- Background job should clean up expired featured status (manual or cron)

### Application Process
1. User must be logged in as JOB_SEEKER
2. POST to `/api/applications` with jobId, optional coverLetter/resume
3. Unique constraint prevents duplicate applications
4. Employer can view applicants at `/dashboard/employer/jobs/[jobId]/applicants`

### Admin Functionality
- Set user role to 'ADMIN' in database: `UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@email.com'`
- Admin panel at `/admin` shows all jobs with delete capability
- API route `/api/admin/jobs/[id]/delete` for admin deletions

### TypeScript Path Alias
Use `@/` for imports:
```typescript
import { db } from '@/lib/db';           // Instead of ../../../lib/db
import { Button } from '@/components/Button';
```

### Prisma Configuration
- Uses Neon PostgreSQL (serverless)
- Binary targets: `["native", "rhel-openssl-3.0.x"]` for Vercel compatibility
- Engine type: `library` for better performance
- **Important**: Always run `npx prisma generate` after schema changes

## Testing & Validation

### Create Test Admin User
```bash
npx prisma studio
# Find user → Change role to "ADMIN" → Save
# Then visit /admin
```

### Test Payment Flow
1. Post a job at `/post-job`
2. Use Stripe test card: `4242 4242 4242 4242`
3. Check webhook logs in terminal (if stripe CLI running)
4. Verify job status changes to ACTIVE in database

### SEO Validation
- Visit `/robots.txt` - Should allow AI crawlers
- Visit `/sitemap.xml` - Should list all active jobs
- Test job page with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Check OpenGraph with [OpenGraph.xyz](https://www.opengraph.xyz/)

## Common Gotchas

1. **Prisma Client not found**: Run `npx prisma generate` after pulling schema changes
2. **Stripe webhooks failing locally**: Ensure stripe CLI is forwarding to correct port
3. **JWT errors**: Verify `JWT_SECRET` is set and at least 32 characters
4. **Duplicate job applications**: Check unique constraint on (jobId, userId)
5. **Featured jobs not showing**: Verify `featuredUntil > now()` and `isFeatured = true`
6. **Images not uploading**: Verify Cloudinary env vars are set
7. **SEO canonical URLs wrong**: Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in production

## Deployment Notes

### Vercel Deployment
1. Connect GitHub repo to Vercel
2. Set all environment variables (especially `NEXT_PUBLIC_SITE_URL`)
3. Use **pooled** DATABASE_URL for Neon (ends with `-pooler.neon.tech`)
4. Configure Stripe webhook URL: `https://workindatacenter.com/api/stripe/webhook`
5. Add webhook events: `checkout.session.completed`, `checkout.session.expired`
6. Build command: `npm run build` (includes `prisma generate`)

### Post-Deployment
- Verify robots.txt and sitemap.xml are accessible
- Submit sitemap to Google Search Console and Bing Webmaster Tools
- Test payment flow with Stripe test mode
- Monitor Vercel Analytics for traffic

## Additional Documentation

- **QUICKSTART.md** - 5-minute setup guide
- **SETUP.md** - Detailed setup instructions with troubleshooting
- **REDIS_CACHING_GUIDE.md** - Optional Redis performance optimization
- **SEO_IMPLEMENTATION.md** - Complete SEO strategy and verification
- **README.md** - General project overview and features
