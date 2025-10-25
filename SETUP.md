# Quick Setup Guide

## Current Status

✅ **Completed:**
- Next.js 16 project structure
- Tailwind CSS with glassmorphism styling (icy blue/silver theme)
- Prisma schema with PostgreSQL
- Custom JWT authentication system
- User registration and login pages
- Job posting form with Stripe integration
- Homepage with job listings, categories, and search
- Glassmorphism UI components (GlassCard, Button, Input, Header, JobCard)
- Stripe checkout and webhook handling
- API routes for auth and jobs

🚧 **Still Needed:**
- Database setup and migrations
- Job detail pages with apply functionality
- Employer dashboard (manage jobs)
- Job seeker dashboard (saved jobs, applications)
- Admin moderation panel
- Email/newsletter system integration
- Complete Stripe webhook testing

## Immediate Next Steps

### 1. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb datacenter_jobs

# Update .env.local with your connection string
DATABASE_URL="postgresql://yourusername@localhost:5432/datacenter_jobs?schema=public"
```

**Option B: Hosted Database (Recommended)**
- **Supabase** (Free tier): https://supabase.com
- **Railway** (Free tier): https://railway.app
- **Neon** (Free tier): https://neon.tech

Once you have a database URL, update `.env.local`:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

### 2. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 3. Configure Stripe

1. **Create account**: https://dashboard.stripe.com/register
2. **Get test API keys**: Dashboard → Developers → API keys
3. **Update `.env.local`**:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

4. **Set up local webhook testing**:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook secret (whsec_...) to .env.local
```

### 4. Configure Email (Optional for now)

Sign up for Resend: https://resend.com/signup

```env
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

### 5. Generate Secure JWT Secret

```bash
# Generate a random 64-character string
openssl rand -base64 64
```

Update `.env.local`:
```env
JWT_SECRET="your-generated-secret-here"
```

### 6. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Testing the App

### 1. Create a Job Seeker Account
- Go to http://localhost:3000/register
- Select "Job Seeker"
- Fill in details and register

### 2. Create an Employer Account
- Open incognito/private window
- Go to http://localhost:3000/register
- Select "Employer"
- Fill in company details and register

### 3. Post a Test Job (with Employer account)
- Click "Post a Job"
- Fill in job details
- Add tags
- Optionally check "Featured Job Listing"
- Click "Continue to Payment"
- Use Stripe test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- Complete payment

### 4. View Job on Homepage
- Return to homepage
- See your job listed
- Test category filters
- Test search (when implemented)

### 5. Create Admin User
```bash
# Connect to database
npx prisma studio

# Or use SQL
# Find your user in the User table and change role to 'ADMIN'
```

## Environment Variables Checklist

```env
# Required for basic functionality
✅ DATABASE_URL
✅ JWT_SECRET
✅ NEXT_PUBLIC_APP_URL

# Required for payments
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET

# Optional (for emails)
⚪ RESEND_API_KEY
⚪ EMAIL_FROM
⚪ ADMIN_EMAIL
```

## Common Issues & Solutions

### Issue: Prisma Client errors
```bash
# Solution: Regenerate client
npx prisma generate
```

### Issue: Database connection errors
```bash
# Solution: Check DATABASE_URL format
# Ensure PostgreSQL is running
# Test connection: npx prisma db pull
```

### Issue: Stripe checkout not working
```bash
# Solution: Verify environment variables
# Check Stripe CLI is forwarding webhooks
# Use test card: 4242 4242 4242 4242
```

### Issue: Next.js build errors
```bash
# Solution: Clear cache and rebuild
rm -rf .next
npm run dev
```

### Issue: JWT Secret warnings
```bash
# Solution: Generate secure secret (min 32 chars)
openssl rand -base64 64
```

## What's Built vs What's Next

### ✅ Core Features Implemented

**Authentication**
- [x] User registration (Employer/Job Seeker)
- [x] Login/logout
- [x] JWT-based sessions
- [x] Protected routes

**Job Posting**
- [x] Multi-step job posting form
- [x] Stripe checkout integration
- [x] Featured job upgrade option
- [x] Webhook handling for payments
- [x] Job expiration (30 days)

**Homepage**
- [x] Job listings grid
- [x] Featured jobs section
- [x] 10 category filters
- [x] Search bar UI
- [x] Sort options UI
- [x] Glassmorphism design
- [x] Responsive layout

**Design System**
- [x] Glass morphism components
- [x] Icy blue/silver color scheme
- [x] Animated gradients
- [x] Custom scrollbar
- [x] Lucide icons
- [x] Form validation

### 🚧 Features to Complete

**Job Details**
- [ ] Individual job page (`/jobs/[id]`)
- [ ] Apply button with modal
- [ ] Application form
- [ ] View count tracking
- [ ] Social sharing

**Employer Dashboard** (`/dashboard/employer`)
- [ ] View posted jobs
- [ ] Edit job listings
- [ ] View analytics (views, applications)
- [ ] Mark jobs as filled
- [ ] Delete jobs

**Job Seeker Dashboard** (`/dashboard/seeker`)
- [ ] Saved jobs list
- [ ] Application history
- [ ] Application status tracking
- [ ] Job recommendations
- [ ] Profile settings

**Admin Panel** (`/admin`)
- [ ] All jobs table with filters
- [ ] Delete/hide jobs
- [ ] User management
- [ ] Payment history
- [ ] Analytics dashboard

**Email System**
- [ ] Newsletter subscription form
- [ ] Job alert emails
- [ ] Application confirmation emails
- [ ] Payment receipt emails
- [ ] Weekly digest

**Additional Features**
- [ ] Save/bookmark jobs
- [ ] Functional search
- [ ] Functional sorting
- [ ] Job expiration cron job
- [ ] Featured expiration handling
- [ ] Image uploads for company logos
- [ ] Resume uploads
- [ ] SEO optimization
- [ ] Sitemap generation

## File Structure Reference

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts    ✅ User registration
│   │   ├── login/route.ts       ✅ User login
│   │   └── logout/route.ts      ✅ User logout
│   ├── jobs/
│   │   └── route.ts             ✅ Create job & checkout
│   └── stripe/
│       └── webhook/route.ts     ✅ Stripe webhooks
├── login/page.tsx               ✅ Login page
├── register/page.tsx            ✅ Registration page
├── post-job/page.tsx            ✅ Job posting form
├── jobs/
│   └── [id]/page.tsx            ❌ TODO: Job detail page
├── dashboard/
│   ├── employer/page.tsx        ❌ TODO: Employer dashboard
│   └── seeker/page.tsx          ❌ TODO: Job seeker dashboard
├── admin/page.tsx               ❌ TODO: Admin panel
├── layout.tsx                   ✅ Root layout with header
└── page.tsx                     ✅ Homepage

components/
├── GlassCard.tsx                ✅ Glassmorphism card
├── Button.tsx                   ✅ Styled button
├── Input.tsx                    ✅ Form input
├── Header.tsx                   ✅ Navigation header
└── JobCard.tsx                  ✅ Job listing card

lib/
├── auth.ts                      ✅ Auth utilities
├── db.ts                        ✅ Prisma client
├── stripe.ts                    ✅ Stripe utilities
├── constants.ts                 ✅ App constants
└── validations.ts               ✅ Zod schemas

prisma/
└── schema.prisma                ✅ Database schema
```

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma generate     # Generate Prisma Client
npx prisma migrate dev  # Run migrations
npx prisma studio       # Open database GUI
npx prisma db push      # Push schema without migration

# Stripe
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Testing
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript (if added)
```

## Support

If you encounter issues:
1. Check this guide
2. Review `.env.local` variables
3. Check browser console for errors
4. Check terminal for server errors
5. Verify database connection
6. Test Stripe CLI webhook forwarding

## Next Development Session

Priority order for completing the app:

1. **Job detail pages** - Essential for users to view and apply
2. **Employer dashboard** - Employers need to manage their postings
3. **Job seeker dashboard** - Seekers need to track applications
4. **Admin panel** - You need moderation capabilities
5. **Email system** - Important for engagement
6. **Polish & testing** - Final refinements

Good luck! 🚀
