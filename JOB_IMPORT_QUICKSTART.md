# Job Import Quick Start

Import 100 real data center jobs in under 5 minutes!

## Setup (One-time)

### 1. Get RapidAPI Key

1. Sign up at [RapidAPI.com](https://rapidapi.com/)
2. Subscribe to [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) (Free tier)
3. Copy your API key from the dashboard

### 2. Add to Environment

Add to your `.env` file:

```bash
RAPIDAPI_KEY="your-rapidapi-key-here"
```

### 3. Restart Server

```bash
npm run dev
```

---

## Import Methods

### Option A: Admin Panel (Easiest)

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Scroll to "Import Jobs from JSearch API"
3. Click "Import Jobs" button
4. Wait 2-3 minutes
5. Done! 100 real jobs added

### Option B: Command Line

```bash
# Preview first (recommended)
npx tsx scripts/import-jobs-jsearch.ts --dry-run

# Import 100 jobs
npx tsx scripts/import-jobs-jsearch.ts

# Import fewer jobs
npx tsx scripts/import-jobs-jsearch.ts --limit=50
```

---

## What You Get

- ✅ 100 real data center jobs from Google for Jobs
- ✅ Includes Indeed, LinkedIn, Glassdoor listings
- ✅ Automatically filtered for relevance
- ✅ Duplicates removed
- ✅ Proper attribution ("via Google for Jobs")
- ✅ Expires after 30 days (like regular jobs)

---

## Pricing

**Free Tier** (Recommended to start):
- $0/month
- 100 API calls/month
- Imports ~100 jobs
- Run once per month

**Basic Tier** (For growth):
- $25/month
- 10,000 API calls/month
- Import weekly or daily
- Always fresh content

---

## Features

### Smart Filtering

Only imports TRUE data center jobs:
- ✅ Data center technicians
- ✅ Facilities engineers
- ✅ Critical infrastructure roles
- ✅ Network/cloud DC positions
- ❌ Data scientists (excluded)
- ❌ Data analysts (excluded)
- ❌ Database admins (excluded)

### Relevance Scoring

Each job scored by:
- Data center keywords in title
- Major DC hub locations (Ashburn, Dallas, etc.)
- Industry certifications (CDCP, DCIM)
- Job type (technician, engineer, manager)
- Recency (newer = higher score)

Top 100 by score imported automatically.

### Source Tracking

All imported jobs show:
- "External" badge in admin panel
- "via Google for Jobs" on job cards
- Link to original posting
- Tracked separately from internal jobs

---

## Schedule

### Free Tier Strategy

Import once per month (when limit resets):
```
Day 1: Import 100 jobs
Days 2-30: Jobs slowly expire
Day 31: Import fresh 100 jobs
```

### Basic Tier Strategy

Import weekly for fresh content:
```
Week 1: Import 100 jobs (400 calls)
Week 2: Import 100 jobs (400 calls)
Week 3: Import 100 jobs (400 calls)
Week 4: Import 100 jobs (400 calls)
= 1,600 calls/month (plenty of headroom)
```

---

## Troubleshooting

### "RAPIDAPI_KEY is not set"
**Fix**: Add key to `.env` and restart server

### "403 Forbidden"
**Fix**: Check API key is correct, verify subscription is active

### "429 Too Many Requests"
**Fix**: Reached monthly limit, wait until next month or upgrade

### No jobs imported
**Fix**: Jobs already exist (duplicates skipped), this is normal

---

## Next Steps

1. ✅ Import 100 jobs (via admin or CLI)
2. ✅ Review imported jobs at [http://localhost:3000](http://localhost:3000)
3. ✅ Check admin panel stats
4. ✅ Encourage employers to post organic jobs ($249 each)
5. ✅ Schedule monthly import on calendar

---

## Full Documentation

See [JOB_IMPORT_GUIDE.md](./JOB_IMPORT_GUIDE.md) for:
- Detailed setup instructions
- How the system works
- Advanced configuration
- Best practices
- Security considerations

---

## Summary

You now have a complete job import system that:
- Fetches real data center jobs automatically
- Filters for quality and relevance
- Provides proper attribution
- Works with free tier (100 requests/month)
- Can be run via admin panel or CLI

**Get started now**: Add your RAPIDAPI_KEY to `.env` and import your first 100 jobs!
