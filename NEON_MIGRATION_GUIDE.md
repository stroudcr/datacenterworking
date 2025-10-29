# Database Migration Guide: Prisma Managed DB → Neon PostgreSQL

**Estimated Time:** 1 hour
**Cost Savings:** $25-40/month
**Difficulty:** Easy
**Risk Level:** Low (reversible)

---

## Why Migrate to Neon?

Your current setup uses **Prisma's managed PostgreSQL** which is:
- ❌ Expensive ($40+/month)
- ❌ Limited operations (causing your 72K ops/2 days issue)
- ❌ Not designed for production scale
- ❌ Limited connections (10-25)

**Neon PostgreSQL** offers:
- ✅ **Free tier**: 512MB storage, 200 compute hours/month
- ✅ **Unlimited operations** - no query count limits
- ✅ **Serverless** - auto-scaling, only pay for usage
- ✅ **Instant connections** - no cold starts
- ✅ **Database branching** - perfect for preview deployments
- ✅ **Native Vercel integration**
- ✅ **Scale tier**: $19/month (if you exceed free tier)

---

## Pre-Migration Checklist

- [ ] Sign up for [Neon](https://neon.tech) account
- [ ] Create full backup of current database
- [ ] Test migration in development first
- [ ] Schedule migration during low-traffic period
- [ ] Have rollback plan ready (keep old DATABASE_URL)

---

## Step 1: Create Neon Database (10 minutes)

### 1.1 Sign Up & Create Project

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub (recommended for Vercel integration)
3. Click **"Create a Project"**
4. Choose:
   - **Region**: US East (Ohio) or closest to your users
   - **PostgreSQL version**: 16 (latest)
   - **Project name**: "workindatacenter-production"

### 1.2 Get Connection String

After creation, Neon shows your connection string:

```
postgresql://username:password@ep-cool-sound-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**IMPORTANT**: Copy this - you'll need it in the next step.

### 1.3 Create Development Branch (Optional but Recommended)

Neon allows database branches for development:

1. In Neon dashboard, click **"Branches"**
2. Create branch: `development`
3. Copy the development connection string

This gives you isolated dev/prod databases!

---

## Step 2: Backup Current Database (10 minutes)

### Option A: Using Prisma Studio (Recommended for small databases)

```bash
# Export data via Prisma Studio
npx prisma studio

# In Prisma Studio:
# 1. Open each table
# 2. Export to CSV/JSON
# 3. Save in ./backups/ folder
```

### Option B: Using pg_dump (Recommended for larger databases)

```bash
# Install PostgreSQL client tools if needed
# macOS: brew install postgresql

# Export entire database
pg_dump "postgres://YOUR_CURRENT_PRISMA_DB_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup file was created
ls -lh backup_*.sql
```

**Store backup safely** - you might need it for rollback.

---

## Step 3: Update Environment Variables (5 minutes)

### 3.1 Local Development

Update `.env.local`:

```bash
# OLD (Prisma managed)
# DATABASE_URL=postgres://...@db.prisma.io:5432/postgres

# NEW (Neon) - Development Branch
DATABASE_URL=postgresql://username:password@ep-XXX.us-east-2.aws.neon.tech/neondb?sslmode=require

# Add connection pooling for better performance (optional but recommended)
# DATABASE_URL=postgresql://username:password@ep-XXX-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3.2 Production (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `DATABASE_URL`:
   - Delete old Prisma DB URL
   - Add new Neon connection string
   - **Important**: Use the **pooled connection string** for production:

```bash
# Production - Use POOLED connection (ends with -pooler.neon.tech)
DATABASE_URL=postgresql://username:password@ep-XXX-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

5. Click **Save**

---

## Step 4: Run Migrations (10 minutes)

### 4.1 Generate Prisma Client with New Database

```bash
# This connects to Neon and prepares Prisma
npx prisma generate
```

### 4.2 Deploy Schema to Neon

```bash
# This creates all tables in your new Neon database
npx prisma migrate deploy

# You should see output like:
# ✓ 5 migrations found in prisma/migrations
# ✓ Applied migration 20240101000000_init
# ✓ Applied migration 20240102000000_add_jobs
# ... etc
```

### 4.3 Verify Schema

```bash
# Open Prisma Studio to verify tables were created
npx prisma studio

# Check that all tables exist:
# - User
# - Job
# - Application
# - SavedJob
# - Payment
# - Newsletter
# - NotificationPreferences
```

---

## Step 5: Migrate Data (15 minutes)

### Option A: Fresh Start (Recommended if you're in early development)

If you don't have critical production data yet:

```bash
# Just seed with fresh data
npx prisma db seed

# Or manually create test data via Prisma Studio
npx prisma studio
```

### Option B: Import Existing Data (If you have production data)

#### Using Prisma Studio (Small datasets)
1. Open old database: `npx prisma studio` (with old DATABASE_URL)
2. Export each table to JSON/CSV
3. Switch to new DATABASE_URL
4. Open new database: `npx prisma studio`
5. Import data manually

#### Using pg_dump/pg_restore (Larger datasets)

```bash
# 1. Export from old database (already done in Step 2)

# 2. Import to Neon
psql "postgresql://YOUR_NEON_CONNECTION_STRING" < backup_20240115_120000.sql

# 3. Verify data imported
npx prisma studio
# Check row counts in each table
```

#### Using Prisma Script (Most Flexible)

Create `scripts/migrate-data.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

// Old database
const oldDb = new PrismaClient({
  datasourceUrl: 'postgres://OLD_PRISMA_DB_URL',
});

// New database
const newDb = new PrismaClient({
  datasourceUrl: 'postgresql://NEW_NEON_URL',
});

async function migrateData() {
  console.log('Starting data migration...');

  // Migrate Users
  const users = await oldDb.user.findMany();
  console.log(`Migrating ${users.length} users...`);
  for (const user of users) {
    await newDb.user.create({ data: user });
  }

  // Migrate Jobs
  const jobs = await oldDb.job.findMany();
  console.log(`Migrating ${jobs.length} jobs...`);
  for (const job of jobs) {
    await newDb.job.create({ data: job });
  }

  // Migrate Applications
  const applications = await oldDb.application.findMany();
  console.log(`Migrating ${applications.length} applications...`);
  for (const application of applications) {
    await newDb.application.create({ data: application });
  }

  // Continue for other tables...

  console.log('Migration complete!');
}

migrateData()
  .catch(console.error)
  .finally(() => {
    oldDb.$disconnect();
    newDb.$disconnect();
  });
```

Run migration:
```bash
npx tsx scripts/migrate-data.ts
```

---

## Step 6: Test Locally (10 minutes)

### 6.1 Start Development Server

```bash
npm run dev
```

### 6.2 Test Critical Flows

- [ ] Homepage loads with job listings
- [ ] Job detail pages work
- [ ] User registration/login works
- [ ] Job application submission works
- [ ] Employer dashboard loads
- [ ] Job seeker dashboard loads
- [ ] Admin panel accessible (if applicable)

### 6.3 Check Database Connections

```bash
# In another terminal, watch Neon dashboard
# Go to: https://console.neon.tech
# Monitor: Operations, Connections, Query Performance
```

---

## Step 7: Deploy to Production (10 minutes)

### 7.1 Deploy to Vercel

```bash
# Commit changes (only if you modified code)
git add .
git commit -m "Migrate to Neon PostgreSQL"
git push

# Vercel will auto-deploy with new DATABASE_URL
```

### 7.2 Run Migrations in Production

After deployment:

```bash
# SSH into Vercel deployment or use Vercel CLI
vercel env pull

# Run migrations
npx prisma migrate deploy
```

Or via Neon SQL Editor:
1. Go to Neon dashboard → SQL Editor
2. Run Prisma migrations manually if needed

### 7.3 Monitor Production

- [ ] Check Vercel deployment logs
- [ ] Test production site: https://workindatacenter.com
- [ ] Monitor Neon dashboard for connection issues
- [ ] Watch for errors in Vercel logs

---

## Step 8: Optimize Connection Pooling (5 minutes)

Update `lib/db.ts` to use connection pooling:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use pooled connection URL for production
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;

  if (process.env.NODE_ENV === 'production') {
    // Ensure using pooled connection in production
    if (url && !url.includes('-pooler.')) {
      console.warn('WARNING: Not using pooled connection in production!');
    }
  }

  return url;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: getDatabaseUrl(),
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

---

## Verification Checklist

After migration, verify:

- [ ] All pages load correctly
- [ ] Database queries execute successfully
- [ ] No connection timeout errors
- [ ] Application performance is same or better
- [ ] Neon dashboard shows active connections
- [ ] Vercel logs show no database errors
- [ ] Cost reduced from $40+/month to $0-19/month
- [ ] Operation count no longer an issue

---

## Rollback Plan (If Something Goes Wrong)

If you encounter issues:

### Step 1: Revert Environment Variables

```bash
# Local: Update .env.local
DATABASE_URL=postgres://OLD_PRISMA_DB_URL

# Production: Update in Vercel Dashboard
# Settings → Environment Variables → DATABASE_URL
```

### Step 2: Redeploy

```bash
git revert HEAD
git push

# Or trigger manual redeploy in Vercel
```

### Step 3: Restore Data (If Needed)

```bash
# From your backup file
pg_dump "postgres://OLD_PRISMA_DB_URL" < backup_20240115_120000.sql
```

---

## Post-Migration Optimizations

### 1. Enable Connection Pooling

In Neon dashboard:
1. Go to **Connection Pooling**
2. Enable **PgBouncer** (transaction mode)
3. Use pooled connection string in production

### 2. Set Up Database Branching

For preview deployments:

```bash
# Vercel will auto-create Neon branches for preview deployments
# Just enable in: Vercel Project Settings → Git → Preview Deployments
```

### 3. Monitor Usage

- **Neon Dashboard**: Track compute hours, storage, connections
- **Vercel Analytics**: Monitor response times
- **Set up alerts**: Email notifications for 80% usage threshold

### 4. Upgrade if Needed

If you exceed free tier:
- **Neon Scale**: $19/month
  - 10GB storage
  - 750 compute hours
  - More than enough for most job boards

---

## Troubleshooting

### Issue: "Connection timeout"
**Solution**: Ensure using pooled connection URL (`-pooler.neon.tech`)

### Issue: "SSL connection required"
**Solution**: Add `?sslmode=require` to connection string

### Issue: "Too many connections"
**Solution**:
1. Enable connection pooling in Neon
2. Use pooled connection URL
3. Add `connection_limit=1` to DATABASE_URL in serverless

### Issue: "Migration failed"
**Solution**:
1. Check Prisma migration history: `npx prisma migrate status`
2. Manually apply missing migrations: `npx prisma migrate deploy`
3. Reset if needed: `npx prisma migrate reset` (⚠️ deletes data!)

### Issue: "Performance slower than before"
**Solution**:
1. Enable connection pooling
2. Check query indexes in Prisma schema
3. Use Neon's query performance analyzer

---

## Cost Monitoring

### Neon Free Tier Limits
- **Storage**: 512MB (plenty for early stage)
- **Compute**: 200 hours/month (6.6 hours/day)
- **Projects**: 1 project
- **Branches**: 10 branches

### When to Upgrade to Scale ($19/month)
- Exceeding 200 compute hours
- Need more than 512MB storage
- Want more database branches
- Need longer data retention

### Expected Usage for Your Job Board
- **Storage**: ~50-100MB for first 6 months
- **Compute**: ~100-150 hours/month
- **Verdict**: **Free tier is sufficient** for now

---

## Success Metrics

After successful migration, you should see:

1. **Cost**: $0/month (free tier) vs $40/month (Prisma managed)
2. **Operations**: Unlimited vs hitting limits at 72K/2 days
3. **Performance**: Same or better (with caching optimizations)
4. **Connections**: Stable (no timeout errors)
5. **Deployments**: Faster (Neon is optimized for Vercel)

---

## Support Resources

- **Neon Docs**: https://neon.tech/docs
- **Neon Discord**: https://discord.gg/neon
- **Prisma with Neon**: https://neon.tech/docs/guides/prisma
- **Vercel + Neon**: https://vercel.com/docs/storage/vercel-postgres

---

## Next Steps After Migration

1. **Set up monitoring**: Add database metrics to your dashboard
2. **Enable backups**: Configure automatic backups in Neon
3. **Implement Redis caching**: Further reduce database load (see REDIS_SETUP.md)
4. **Add full-text search**: Improve job search performance
5. **Set up alerts**: Get notified if approaching free tier limits

---

## Questions?

If you encounter any issues during migration:
1. Check Neon status page: https://neonstatus.com
2. Review Vercel deployment logs
3. Check Prisma migration status: `npx prisma migrate status`
4. Join Neon Discord for support

**Happy migrating! 🚀**
