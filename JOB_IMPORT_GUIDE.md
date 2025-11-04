# Job Import Guide - JSearch API Integration

This guide explains how to import real data center jobs from Google for Jobs via the JSearch API (RapidAPI).

## Overview

The job import system allows you to automatically populate your job board with real, current data center job listings from across the web. It uses the JSearch API which aggregates jobs from Google for Jobs (which in turn aggregates from Indeed, LinkedIn, Glassdoor, and other major job boards).

## Features

✅ **Automated Import**: Fetch 100+ real data center jobs with one click
✅ **Smart Filtering**: AI-powered relevance scoring ensures only true data center jobs are imported
✅ **Deduplication**: Automatically removes duplicate listings
✅ **Source Tracking**: All imported jobs are tracked and labeled appropriately
✅ **Attribution**: Proper "via Google for Jobs" attribution on all external listings
✅ **Free Tier Support**: Works with RapidAPI's free tier (100 requests/month)

---

## Setup Instructions

### Step 1: Sign Up for RapidAPI

1. Go to [RapidAPI.com](https://rapidapi.com/)
2. Create a free account
3. Search for "JSearch API" or visit: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

### Step 2: Subscribe to JSearch API

**Free Tier (Recommended to Start):**
- **Cost**: $0/month
- **Limit**: 100 requests/month
- **What you get**: ~1,000 raw jobs fetched, top 100 imported
- **Perfect for**: Testing and small job boards

**Basic Tier (For Growth):**
- **Cost**: $25/month
- **Limit**: 10,000 requests/month
- **What you get**: Weekly imports, always fresh content
- **Perfect for**: Growing job boards with regular updates

To subscribe:
1. Click "Subscribe to Test" on the JSearch API page
2. Select your tier (Free or Basic)
3. Complete the subscription

### Step 3: Get Your API Key

1. After subscribing, go to your [RapidAPI Dashboard](https://rapidapi.com/developer/dashboard)
2. Navigate to the JSearch API
3. Find your **X-RapidAPI-Key** in the code snippets section
4. Copy the key (starts with a long string of characters)

### Step 4: Add API Key to Environment

Add your RapidAPI key to your `.env` file:

```bash
RAPIDAPI_KEY="your-rapidapi-key-here"
```

**Important**:
- Add this to your `.env` file locally for development
- Add it to Vercel environment variables for production
- Never commit the actual key to Git

---

## How to Import Jobs

### Method 1: Via Admin Panel (Recommended)

1. Log in to your admin account
2. Navigate to `/admin`
3. Look for the "Import Jobs from JSearch API" section
4. Click the "Import Jobs" button
5. Wait 2-3 minutes for the import to complete
6. Review the import statistics

The admin panel shows:
- Number of internal vs external jobs
- Last sync date
- Import progress and results
- Any errors encountered

### Method 2: Via Command Line

Run the import script directly from your terminal:

```bash
# Preview what would be imported (dry run)
npx tsx scripts/import-jobs-jsearch.ts --dry-run

# Import top 100 jobs
npx tsx scripts/import-jobs-jsearch.ts

# Import a specific number of jobs
npx tsx scripts/import-jobs-jsearch.ts --limit=50
```

The script provides detailed progress and statistics:
- Total jobs fetched from API
- Number of relevant data center jobs found
- Duplicates removed
- Successfully imported jobs
- Any errors encountered

---

## How It Works

### 1. Fetching Phase

The system makes 100 API calls to JSearch, requesting one page per call. Each page typically contains ~10 jobs, so you get approximately 1,000 raw job listings.

**Search Query Used:**
```
(data center OR datacenter) (technician OR engineer OR manager OR operator OR electrician OR facilities)
Location: United States
```

### 2. Scoring Phase

Each fetched job is assigned a relevance score based on:

**Required Keywords** (must have one):
- data center, datacenter, critical facilities, colocation, DCIM, hyperscale

**Positive Indicators** (boost score):
- Title contains data center keywords: +50 points
- Located in major DC hubs (Ashburn, Dallas, Phoenix, etc.): +15 points
- Mentions certifications (CDCP, Uptime Institute, etc.): +10 points
- Specific job titles (technician, engineer, manager): +10 points each
- Recent posting (within 7 days): +5 points

**Negative Indicators** (disqualify):
- Contains "data scientist", "data analyst", "database administrator"
- Other non-data center roles: -1000 points (rejected)

### 3. Filtering Phase

Jobs are filtered to ensure quality:
- Must score above 0 (negative scores are rejected)
- Sorted by score (highest to lowest)
- Duplicates removed (same company + title + location)
- Top 100 jobs selected

### 4. Mapping Phase

External job data is mapped to your database schema:

**Data Transformations:**
- Employment type normalized (FULLTIME → Full-time)
- Category inferred from title and description
- Location parsed (City, State format)
- Salary converted (hourly vs annual)
- Shift requirements detected
- Security clearance identified
- Certifications extracted
- Tags generated automatically

### 5. Import Phase

Jobs are saved to your database with:
- Status: `ACTIVE`
- Source: `EXTERNAL_JSEARCH`
- External ID: Original job ID from API
- Source URL: Link back to Google for Jobs
- Expiration: 30 days from import
- Featured: `false` (only organic paid jobs are featured)

---

## Data Fields Mapped

| JSearch Field | Your Database Field | Notes |
|--------------|---------------------|-------|
| job_id | externalId | Tracks original job |
| job_title | title | Direct mapping |
| employer_name | company | Direct mapping |
| employer_logo | companyLogo | Optional |
| job_city, job_state | location | Parsed to "City, ST" |
| job_employment_type | type | Normalized (FULLTIME → Full-time) |
| job_description | description | Full job description |
| job_apply_link | applyUrl | External apply link |
| job_google_link | sourceUrl | Link to Google for Jobs |
| job_min_salary, job_max_salary | salaryMin, salaryMax | Salary range |
| job_required_skills | tags | Extracted and limited to 10 |
| - | category | Inferred from title/description |
| - | shift | Detected from description |
| - | clearance | Detected from description |

---

## Important Notes

### API Usage Limits

**Free Tier:**
- 100 requests per month
- Resets on the 1st of each month
- Use strategically (one import per month)

**Basic Tier ($25/month):**
- 10,000 requests per month
- Can import weekly or even daily
- Better for active job boards

### Job Lifecycle

**External Jobs:**
- Expire after 30 days (same as organic jobs)
- Not automatically refreshed
- Manual deletion available via admin panel
- Run import again next month to get fresh listings

**Duplicate Prevention:**
- Jobs checked by `externalId` before import
- Same job won't be imported twice
- Safe to run multiple imports

### Attribution Requirements

Per Google for Jobs terms, all external jobs display:
- "via Google for Jobs" badge on job cards
- Source attribution on job detail pages
- Link back to original posting

**Important**: Do not remove or modify attribution - it's required by the API terms of service.

---

## Troubleshooting

### Error: "RAPIDAPI_KEY is not set"

**Solution**: Add your RapidAPI key to `.env`:
```bash
RAPIDAPI_KEY="your-actual-key-here"
```

Then restart your development server.

### Error: "403 Forbidden" or "429 Too Many Requests"

**Cause**: API rate limit exceeded or invalid key

**Solution**:
- Check your RapidAPI dashboard for usage limits
- Verify your API key is correct
- Wait until next month if free tier limit reached
- Consider upgrading to Basic tier ($25/month)

### No Jobs Imported / All Skipped

**Cause**: Jobs already exist in database

**Solution**:
- External jobs are identified by `externalId`
- If you've imported before, duplicates are skipped
- This is expected behavior to prevent duplicates

### Low Relevance Scores / Wrong Jobs Imported

**Cause**: Search query or scoring algorithm needs adjustment

**Solution**:
- Edit `lib/jobs-api/filter.ts` to adjust scoring weights
- Modify `lib/jobs-api/jsearch.ts` to change search query
- Add more required keywords or exclusions

### Import Takes Too Long / Times Out

**Cause**: Fetching 100 pages takes 2-3 minutes

**Solution**:
- This is normal - be patient
- Small delay between requests prevents rate limiting
- On Vercel, ensure function timeout is set to 5+ minutes
- Consider running via CLI instead of admin panel

---

## Cost Analysis

### Free Tier Strategy

**Monthly Cost**: $0

**What You Get**:
- 100 API calls = 100 pages
- ~1,000 jobs fetched
- Top 100 imported
- 1 import per month

**Best For**:
- Testing the feature
- Small niche job boards
- Supplement to organic postings

### Basic Tier Strategy

**Monthly Cost**: $25

**What You Get**:
- 10,000 API calls
- Can import weekly (400 calls/week = 4,000 jobs fetched)
- Or daily (143 calls/day = 1,430 jobs fetched)
- Always fresh content

**Best For**:
- Active job boards
- Regular content updates
- Professional operations

### ROI Comparison

**Without Import System**:
- Need to source 100 jobs manually
- At $249/job = $24,900 in lost revenue
- Significant time investment

**With Import System**:
- Free tier: $0/month
- Basic tier: $25/month
- Provides real content immediately
- Job seekers see active board
- Employers see competition (motivates paid posts)

---

## Best Practices

### 1. Monthly Import Schedule (Free Tier)

Run import on the 1st of each month when API limit resets:

```bash
# Set a calendar reminder
# Run via admin panel or CLI
npx tsx scripts/import-jobs-jsearch.ts
```

### 2. Mix Internal and External Jobs

- External jobs: Provide volume and variety
- Internal jobs: Generate revenue ($249 each)
- Featured jobs: Only for paid internal postings
- Don't rely solely on imports

### 3. Monitor Job Quality

Regularly review imported jobs:
- Check relevance scores in import logs
- Adjust filtering if needed
- Remove any false positives manually

### 4. Communicate with Users

Consider adding a page or FAQ explaining:
- Jobs come from multiple sources
- External jobs link to original postings
- How users can post their own jobs
- Premium features (featured listings)

### 5. Upgrade When Ready

Start with free tier, upgrade when:
- You want weekly/daily updates
- Free tier limit feels restrictive
- Job board is generating revenue
- Need more than 100 jobs per month

---

## File Structure

```
lib/jobs-api/
├── index.ts          # Exports all job API functions
├── types.ts          # TypeScript interfaces
├── jsearch.ts        # JSearch API client
├── filter.ts         # Scoring and filtering logic
└── mapper.ts         # Data mapping functions

scripts/
└── import-jobs-jsearch.ts   # CLI import script

app/api/admin/jobs/import/
└── route.ts          # Admin API endpoint

app/admin/
├── page.tsx          # Admin panel (shows import UI)
└── ImportJobsButton.tsx   # Import button component
```

---

## Security Considerations

### API Key Protection

**DO**:
- Store key in environment variables
- Add to `.env` and `.env.local`
- Add to Vercel environment variables
- Keep in `.gitignore`

**DON'T**:
- Commit key to Git
- Share key publicly
- Use same key across environments
- Expose key in frontend code

### Rate Limiting

The system includes:
- 250ms delay between requests
- Sequential page fetching
- Error handling for rate limits
- Graceful degradation

### Data Privacy

- External jobs are public data
- No personal information collected
- Attribution preserved
- Terms of service respected

---

## Future Enhancements

Potential improvements to consider:

### Automated Scheduling

Add a cron job to auto-import monthly:

```typescript
// app/api/cron/import-jobs/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  // Run import
  // Return stats
}
```

### Smart Refresh

Only import new jobs, not duplicates:
- Track last sync timestamp
- Use date_posted filter
- Only fetch recent jobs

### Multi-Source Import

Add more job APIs:
- RemoteOK (free, remote jobs)
- Adzuna (UK/US coverage)
- Reed (UK market)

### Enhanced Filtering

- Machine learning for scoring
- User feedback on relevance
- Category-specific weights
- Location preferences

---

## Support

### Questions?

- Check the API documentation: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- Review RapidAPI dashboard for usage stats
- Check import logs for error details
- Adjust filtering in `lib/jobs-api/filter.ts`

### Need Help?

Common issues and solutions covered in this guide. For additional support:
1. Check Troubleshooting section above
2. Review import script logs
3. Test with `--dry-run` flag first
4. Verify API key is set correctly

---

## Summary

The JSearch API integration provides a powerful way to populate your job board with real, relevant data center jobs. Start with the free tier to test, then upgrade to Basic tier ($25/month) when you're ready for regular updates. The system handles fetching, filtering, mapping, and importing automatically - just click a button or run a script.

**Key Takeaways:**
- ✅ 100 real jobs imported in 2-3 minutes
- ✅ Free tier available (100 requests/month)
- ✅ Smart filtering ensures relevance
- ✅ Proper attribution included
- ✅ Easy to use via admin panel or CLI

Get started today and give your job board the content it needs to attract employers and job seekers!
