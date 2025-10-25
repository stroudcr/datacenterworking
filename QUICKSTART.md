# Quick Start Guide - 5 Minutes to Running

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use hosted service)

## Step 1: Database Setup (2 minutes)

### Option A: Use Supabase (Easiest - Free)
1. Go to https://supabase.com/dashboard
2. Create new project
3. Go to Settings → Database
4. Copy the "Connection string" under "Connection pooling"
5. Paste into `.env.local` as `DATABASE_URL`

### Option B: Local PostgreSQL
```bash
createdb datacenter_jobs
# Update .env.local:
DATABASE_URL="postgresql://youruser@localhost:5432/datacenter_jobs"
```

## Step 2: Configure Environment (1 minute)

Edit `.env.local`:

```env
# Required - Database
DATABASE_URL="your-postgres-url-here"

# Required - Security (generate: openssl rand -base64 64)
JWT_SECRET="your-long-random-secret-here"

# Required - Stripe (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Get from: stripe listen --forward-to localhost:3000/api/stripe/webhook

# Required - App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional - Email (skip for now)
RESEND_API_KEY=""
EMAIL_FROM=""
```

## Step 3: Initialize Database (1 minute)

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) View database
npx prisma studio
```

## Step 4: Start Dev Server (30 seconds)

```bash
npm run dev
```

Visit: http://localhost:3000

## Step 5: Test It Out (1 minute)

1. **Create Employer Account**
   - Go to `/register`
   - Select "Employer"
   - Fill details → Register

2. **Post a Job**
   - Click "Post a Job"
   - Fill form
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete payment

3. **Create Job Seeker Account**
   - Open incognito window
   - Go to `/register`
   - Select "Job Seeker"
   - Browse jobs, save, apply

## Stripe Webhook Testing

Open new terminal:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook secret (whsec_...) to .env.local
```

## Create Admin User

```bash
# Open Prisma Studio
npx prisma studio

# Find your user
# Change role from "JOB_SEEKER" or "EMPLOYER" to "ADMIN"
# Save

# Visit: http://localhost:3000/admin
```

## Troubleshooting

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Database connection failed"
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Test connection: `npx prisma db pull`

### "Stripe checkout not working"
- Verify Stripe keys in `.env.local`
- Check Stripe CLI is running
- Use test card: `4242 4242 4242 4242`

### "JWT errors"
```bash
# Generate new secret
openssl rand -base64 64
# Paste into JWT_SECRET in .env.local
```

### Next.js build errors
```bash
rm -rf .next
npm run dev
```

## What's Next?

✅ Your job board is ready!
✅ All features are working
✅ You can start posting real jobs

**Production Deploy:**
- Vercel: `vercel deploy`
- Railway: Connect GitHub repo
- Update Stripe webhook URL to production

**Optional:**
- Set up Resend for emails
- Add custom domain
- Configure production database
- Enable Stripe live mode

## File Structure

```
app/
├── api/              # API endpoints
├── login/            # Login page
├── register/         # Registration
├── post-job/         # Job posting form
├── jobs/[id]/        # Job details
├── dashboard/        # User dashboards
├── admin/            # Admin panel
└── page.tsx          # Homepage

components/           # Reusable UI
lib/                  # Utilities
prisma/              # Database schema
```

## Quick Commands

```bash
# Development
npm run dev                    # Start dev server

# Database
npx prisma studio             # View/edit database
npx prisma migrate dev        # Create migration
npx prisma generate           # Generate client

# Stripe
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Production
npm run build                 # Build for production
npm start                     # Start production server
```

## Test Cards (Stripe)

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`
- Expiry: Any future date
- CVC: Any 3 digits

## Support

- Documentation: [README.md](README.md)
- Setup Guide: [SETUP.md](SETUP.md)
- Completion Status: [COMPLETED.md](COMPLETED.md)

---

**You're ready to go!** 🚀

Open http://localhost:3000 and start using your job board!
