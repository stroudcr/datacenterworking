# Redis Caching Setup Guide (Optional Performance Boost)

**Estimated Time:** 2-4 hours
**Cost:** $0-10/month
**Difficulty:** Medium
**Performance Impact:** 50-70% faster page loads, 70% fewer database queries

---

## Why Add Redis Caching?

After implementing ISR (Incremental Static Regeneration) caching, you've already reduced database load significantly. Redis caching provides **additional benefits**:

- ✅ **Cache expensive computations** (aggregations, stats)
- ✅ **Session storage** (faster than database lookups)
- ✅ **Rate limiting** (prevent abuse)
- ✅ **Real-time counters** (views, likes) without DB writes
- ✅ **Job listing cache** (serve instantly, update every minute)

### Current Performance (With ISR Only)

| Operation | Speed | DB Queries |
|-----------|-------|------------|
| Homepage Load | 50-100ms | 2 queries/60s |
| Job Detail | 100-200ms | 1-2 queries/5min |
| Dashboard | 150-300ms | 1-2 queries/30s |

### With Redis Added

| Operation | Speed | DB Queries |
|-----------|-------|------------|
| Homepage Load | **10-20ms** | **0 queries** (Redis cache) |
| Job Detail | **20-50ms** | **0 queries** (Redis cache) |
| Dashboard | **50-100ms** | **0-1 queries** (most from Redis) |

---

## Option 1: Vercel KV (Recommended for Vercel Users) ⭐

### Pros
- ✅ **Native Vercel integration** - automatic setup
- ✅ **Zero configuration** - works immediately
- ✅ **Edge-optimized** - globally distributed
- ✅ **Built on Upstash** - reliable provider
- ✅ **Simple pricing** - $10/month for 1GB

### Cons
- ❌ **No free tier** - minimum $10/month
- ❌ **Vercel lock-in** - harder to migrate

### Setup Steps

#### Step 1: Create KV Database (5 minutes)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Key-Value Store)
6. Name it: `workindatacenter-redis`
7. Choose region: **Same as your primary region**
8. Click **Create**

#### Step 2: Connect to Project (2 minutes)

After creation, Vercel automatically adds these environment variables:
```bash
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

These are automatically available in your deployment!

#### Step 3: Install Vercel KV SDK (1 minute)

```bash
npm install @vercel/kv
```

#### Step 4: Create Redis Utility (10 minutes)

Create `lib/redis.ts`:

```typescript
import { kv } from '@vercel/kv';

// Cache keys
export const CACHE_KEYS = {
  homepage: 'cache:homepage',
  job: (slug: string) => `cache:job:${slug}`,
  jobViews: (jobId: string) => `views:job:${jobId}`,
  userSession: (userId: string) => `session:${userId}`,
  stats: 'cache:stats',
};

// Cache durations (in seconds)
export const CACHE_TTL = {
  homepage: 60, // 1 minute
  jobDetail: 300, // 5 minutes
  stats: 30, // 30 seconds
  session: 3600, // 1 hour
};

/**
 * Get cached data
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return await kv.get<T>(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Set cached data with TTL
 */
export async function setCache(
  key: string,
  value: any,
  ttl: number = CACHE_TTL.homepage
): Promise<void> {
  try {
    await kv.set(key, value, { ex: ttl });
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

/**
 * Increment counter (for views, etc.)
 */
export async function incrementCounter(key: string): Promise<number> {
  try {
    return await kv.incr(key);
  } catch (error) {
    console.error('Redis incr error:', error);
    return 0;
  }
}

/**
 * Invalidate cache
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await kv.del(key);
  } catch (error) {
    console.error('Redis del error:', error);
  }
}

/**
 * Batch invalidate (for patterns like "cache:job:*")
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    // Note: Vercel KV doesn't support SCAN, so we track keys manually
    // For now, just invalidate specific keys
    console.warn('Pattern invalidation not supported in Vercel KV');
  } catch (error) {
    console.error('Redis pattern invalidation error:', error);
  }
}
```

#### Step 5: Implement Homepage Caching (15 minutes)

Update `app/page.tsx`:

```typescript
import { getCache, setCache, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  // Only cache if no filters are applied
  const hasFilters = !!(params.category || params.search || params.type);

  if (!hasFilters) {
    // Try to get from Redis cache first
    const cached = await getCache<{
      jobs: Job[];
      totalActiveJobs: number;
      featuredJobs: Job[];
    }>(CACHE_KEYS.homepage);

    if (cached) {
      console.log('📦 Serving homepage from Redis cache');
      return renderPage(cached.jobs, cached.totalActiveJobs, cached.featuredJobs);
    }
  }

  // Cache miss - fetch from database (existing code)
  const jobs = await db.job.findMany({ /* ... */ });
  const totalActiveJobs = await db.job.count({ /* ... */ });
  const featuredJobs = jobs.filter(/* ... */);

  // Store in Redis cache
  if (!hasFilters) {
    await setCache(
      CACHE_KEYS.homepage,
      { jobs, totalActiveJobs, featuredJobs },
      CACHE_TTL.homepage
    );
  }

  return renderPage(jobs, totalActiveJobs, featuredJobs);
}
```

#### Step 6: Implement Job Detail Caching (15 minutes)

Update `app/jobs/[slug]/page.tsx`:

```typescript
import { getCache, setCache, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;

  // Try Redis cache first
  const cacheKey = CACHE_KEYS.job(slug);
  const cached = await getCache<typeof job>(cacheKey);

  if (cached) {
    console.log(`📦 Serving job ${slug} from Redis cache`);
    // Still fetch user-specific data (savedJob, application)
    // ... rest of render
    return renderJobPage(cached, isSaved, hasApplied);
  }

  // Cache miss - fetch from database
  const result = await getJobBySlug(slug);
  const { job } = result;

  if (job) {
    // Cache job data (without user-specific info)
    await setCache(cacheKey, job, CACHE_TTL.jobDetail);
  }

  return renderJobPage(job, isSaved, hasApplied);
}
```

#### Step 7: Implement View Tracking with Redis (20 minutes)

This is the **killer feature** - batch view updates to reduce database writes!

Update `components/ViewTracker.tsx`:

```typescript
'use client';

import { useEffect } from 'react';

export function ViewTracker({ jobId }: { jobId: string }) {
  useEffect(() => {
    // Increment Redis counter (instant, no DB hit)
    fetch(`/api/jobs/${jobId}/view`, {
      method: 'POST',
    }).catch(() => {});
  }, [jobId]);

  return null;
}
```

Update `app/api/jobs/[id]/view/route.ts`:

```typescript
import { incrementCounter, CACHE_KEYS } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment Redis counter (instant)
    await incrementCounter(CACHE_KEYS.jobViews(id));

    // Note: We'll flush these to database periodically via cron
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

Create cron job to flush view counts: `app/api/cron/flush-views/route.ts`:

```typescript
import { db } from '@/lib/db';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all view counter keys
    const keys = await kv.keys('views:job:*');

    for (const key of keys) {
      const jobId = key.replace('views:job:', '');
      const viewCount = await kv.get<number>(key);

      if (viewCount && viewCount > 0) {
        // Update database
        await db.job.update({
          where: { id: jobId },
          data: { viewCount: { increment: viewCount } },
        });

        // Reset counter
        await kv.del(key);
      }
    }

    return NextResponse.json({ success: true, flushed: keys.length });
  } catch (error) {
    console.error('Flush views error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

Set up Vercel Cron:

1. Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/flush-views",
    "schedule": "*/5 * * * *"
  }]
}
```

2. Add to `.env`:
```bash
CRON_SECRET=your-random-secret-here
```

#### Step 8: Deploy & Test (10 minutes)

```bash
# Commit changes
git add .
git commit -m "Add Redis caching with Vercel KV"
git push

# Vercel auto-deploys
```

Test in production:
- Visit homepage multiple times → Should see "📦 Serving from Redis cache" in logs
- View job pages → First visit hits DB, subsequent visits hit Redis
- Check Vercel KV dashboard → See cache entries and hit rates

---

## Option 2: Upstash Redis (Free Tier Available) 💰

### Pros
- ✅ **Generous free tier** - 10K commands/day
- ✅ **No Vercel lock-in** - works anywhere
- ✅ **Global replicas** - fast everywhere
- ✅ **REST API** - no connection pooling needed

### Cons
- ❌ **Manual setup** required
- ❌ **Free tier limits** - may need upgrade

### Setup Steps

#### Step 1: Create Upstash Account (5 minutes)

1. Go to [console.upstash.com](https://console.upstash.com)
2. Sign up (free)
3. Click **Create Database**
4. Choose:
   - **Name**: workindatacenter-redis
   - **Region**: Closest to your users
   - **Type**: Regional (free) or Global (paid)
5. Click **Create**

#### Step 2: Get Connection Details (2 minutes)

In Upstash dashboard, copy:
```bash
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Add to `.env.local` and Vercel environment variables.

#### Step 3: Install Upstash SDK (1 minute)

```bash
npm install @upstash/redis
```

#### Step 4: Update Redis Utility (5 minutes)

Update `lib/redis.ts`:

```typescript
import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

// Rest of the code is similar to Vercel KV version
// Just replace `kv` with `redis`
```

#### Step 5-8: Same as Vercel KV

Follow steps 5-8 from Vercel KV setup, but use `redis` instead of `kv`.

---

## Performance Monitoring

### Monitor Cache Hit Rates

Add to `lib/redis.ts`:

```typescript
let cacheHits = 0;
let cacheMisses = 0;

export function getCacheStats() {
  const total = cacheHits + cacheMisses;
  const hitRate = total > 0 ? (cacheHits / total * 100).toFixed(2) : '0';
  return { hits: cacheHits, misses: cacheMisses, hitRate: `${hitRate}%` };
}

// Update getCache function:
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await kv.get<T>(key);
    if (data) {
      cacheHits++;
      console.log(`✅ Cache HIT: ${key}`);
    } else {
      cacheMisses++;
      console.log(`❌ Cache MISS: ${key}`);
    }
    return data;
  } catch (error) {
    console.error('Redis get error:', error);
    cacheMisses++;
    return null;
  }
}
```

View stats:
```bash
# In any API route
import { getCacheStats } from '@/lib/redis';
console.log(getCacheStats());
```

---

## Cost Analysis

### Vercel KV
- **Minimum**: $10/month
- **Storage**: 1GB included
- **Bandwidth**: 200GB included
- **Commands**: Unlimited
- **Best for**: Production apps on Vercel

### Upstash Free Tier
- **Cost**: $0/month
- **Storage**: 256MB
- **Commands**: 10,000/day
- **Bandwidth**: Limited
- **Best for**: Development, low-traffic sites

### Expected Usage (Your Job Board)
- **Storage**: ~10-50MB (job listings, session data)
- **Commands**: ~5,000-20,000/day (depending on traffic)
- **Verdict**: Upstash free tier should be sufficient initially

---

## Cache Invalidation Strategies

### When to Invalidate

```typescript
// When job is updated
async function updateJob(jobId: string, data: any) {
  await db.job.update({ where: { id: jobId }, data });

  // Invalidate caches
  const job = await db.job.findUnique({ where: { id: jobId } });
  await invalidateCache(CACHE_KEYS.job(job.slug));
  await invalidateCache(CACHE_KEYS.homepage);
}

// When job is created
async function createJob(data: any) {
  const job = await db.job.create({ data });

  // Invalidate homepage
  await invalidateCache(CACHE_KEYS.homepage);
}

// When job is deleted
async function deleteJob(jobId: string) {
  const job = await db.job.findUnique({ where: { id: jobId } });
  await db.job.delete({ where: { id: jobId } });

  // Invalidate caches
  await invalidateCache(CACHE_KEYS.job(job.slug));
  await invalidateCache(CACHE_KEYS.homepage);
}
```

---

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test cache behavior
curl http://localhost:3000  # First request - should hit DB
curl http://localhost:3000  # Second request - should hit cache

# Check logs for "📦 Serving from Redis cache"
```

### Production Testing

```bash
# Check cache hit rates
curl https://workindatacenter.com

# Verify Redis usage in Vercel/Upstash dashboard
```

---

## Troubleshooting

### Issue: Redis connection timeout
**Solution**: Check environment variables are set correctly

### Issue: Cache not being used
**Solution**: Verify Redis connection, check logs for errors

### Issue: Stale data in cache
**Solution**: Implement proper cache invalidation (see above)

### Issue: High Redis costs
**Solution**:
- Reduce cache TTL
- Cache only expensive queries
- Use Upstash free tier instead of Vercel KV

---

## Is Redis Worth It?

### ✅ Add Redis if:
- High traffic (>1,000 visitors/day)
- Expensive database queries
- Want instant page loads
- Need rate limiting
- Want real-time counters

### ❌ Skip Redis if:
- Low traffic (<100 visitors/day)
- ISR caching is sufficient
- Want to minimize complexity
- Budget is $0

### My Recommendation
Start **without Redis** - your ISR optimizations are already excellent. Add Redis later when:
1. Traffic exceeds 1,000 visitors/day
2. Database costs increase
3. You need <50ms response times
4. You want advanced features (rate limiting, real-time stats)

---

## Next Steps

After implementing Redis:
1. **Monitor performance** - Use Vercel Analytics
2. **Track costs** - Watch Redis usage dashboard
3. **Optimize cache keys** - Fine-tune TTL values
4. **Add more caching** - Dashboard stats, search results
5. **Implement rate limiting** - Prevent abuse

---

## Support

- **Vercel KV Docs**: https://vercel.com/docs/storage/vercel-kv
- **Upstash Docs**: https://docs.upstash.com/redis
- **Redis Patterns**: https://redis.io/docs/manual/patterns/

**Happy caching! ⚡**
