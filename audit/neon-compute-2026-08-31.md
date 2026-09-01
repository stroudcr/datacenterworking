# Neon compute investigation — August 31, 2026

The application has confirmed avoidable database activity, and the live Neon account confirms compute alone exhausted the quota. The leading explanation is public requests repeatedly querying Neon and extending its active time, potentially amplified by the July 29 and August 1 changes. Historical CPU/allocation and query statistics are unavailable after quota suspension, so no single route or SQL statement can be assigned an exact share of the 110.23 CU-hours.

Recommendation: keep the deployed optimization below on the Free plan and measure the September billing period before paying for a larger Neon tier. The project exceeded Free by only 10.23 CU-hours, so the changes should make Free feasible if the remaining legitimate traffic leaves regular five-minute idle windows. A public production service still carries quota-outage risk. If usage does not settle below roughly 2–2.5 CU-hours per day, or another quota outage is unacceptable, Neon Launch is the appropriate fallback. There is no evidence that a larger compute size or the Scale tier is necessary.

**Optimization implemented and deployed to production**

- One compact, explicit public-job snapshot now supplies homepage listings, state and remote listings/counts, and sitemap jobs. It performs one Neon query on a cold fill, persists for one hour, and is shared across route and query-string variants.
- Public job details use explicit public fields and a separate 24-hour per-slug cache. Job detail and application pages retain live expiry checks, while logged-in saved/application checks remain private and uncached.
- Payment activation and individual edits/deletions invalidate the shared index plus only the affected detail entry. Bulk imports and account-deletion cascades can invalidate all details. Expiry cleanup invalidates the index; live expiry/featured checks keep cached details correct. Application counters intentionally do not invalidate public data, so “Most Applied” may lag by up to one hour rather than forcing a cache refill on each application.
- Per-page SQL view writes and SQL apply-click writes were removed, including their anonymous POST endpoints. Existing Vercel Analytics and Google Analytics continue to record page traffic; outbound apply clicks now emit a privacy-safe Google Analytics event containing only the job ID and application method. Retired SQL view totals were removed from employer/admin screens, marketing proof, and expiry emails so frozen values are not presented as current.
- Category/type/shift/clearance/certification filters and sorting now update the URL and the already-loaded data entirely in the browser. Text search still performs a server render, but searches the shared cached title/company/location/state/category/tag index and does not query Neon. Full job-description text is intentionally excluded to keep the shared cache compact.
- Listing payloads now contain only a dedicated public DTO. Internal email, owner ID, external IDs, and `managementToken` are no longer serialized to public listing clients.
- Employer marketing proof metrics now refresh once per day instead of hourly, and the retired SQL view-count metric was removed from that public query.

Repository validation passed TypeScript, all 10 automated tests, ESLint with no errors, and whitespace checks. Vercel's production build then completed successfully with the configured production environment. The build bypassed `prisma migrate deploy` for this code-only release because Neon rejects database connections while the Free allowance is suspended; normal future builds still run migrations unless `SKIP_DB_MIGRATIONS=1` is explicitly supplied.

The optimized build was deployed August 31, 2026 as Vercel deployment `dpl_Cko9rMKLiJo3vmXDtSts9nqkCNdF` and is aliased at [www.workindatacenter.com](https://www.workindatacenter.com). Vercel reports it `READY`. Neon changed the dashboard to **0 / 100 CU-hours** and removed the limit banner shortly after 00:21 UTC on September 1. Its database gateway nevertheless continued returning the old quota-exceeded response through at least 14:28 UTC. Database-backed routes therefore remained unavailable while static pages such as `/about` worked. This is a Neon reset-enforcement fault, not a failure of the deployed build.

**What was verified**

- The initial investigation read the repository, recent history, database access paths, schema, cron definitions, and client navigation behavior without changing database records, infrastructure settings, or billing settings. The repository changes listed above were then implemented after the decision to optimize and remain on Free.
- Vercel's optimized production deployment is `dpl_Cko9rMKLiJo3vmXDtSts9nqkCNdF`, deployed August 31 from the same code now preserved in the repository's optimization commit.
- The successful production build marks all database-backed public routes, including `/sitemap.xml`, as dynamically rendered on demand. Their explicit shared data caches remain available independently of route rendering.
- Production runtime error summaries report failures to reach Neon on listing, state, detail, sitemap, and cron routes. The endpoint is already pooled (`ep-dry-fog-adybtlty-pooler...`). Missing pooling is therefore not the explanation.
- The error summaries do not specifically prove quota exhaustion; connectivity failures are consistent with the user's report but can have other causes. Raw runtime-log queries timed out; aggregate results were available. Their first-seen dates can refer to older error clusters and were not used to date this incident.
- Live production project access was obtained on August 31. Neon explicitly reported **“Limit reached”** and HTTP 402 for database-backed monitoring after the quota was exhausted. At 00:09 UTC on September 1, the console still displayed 110.23/100 CU-hours and “Usage since Aug 1, 2026.” Shortly after 00:21 UTC it changed to 0/100 and “Usage since Sep 1, 2026,” but direct, pooled, SQL Editor, and production application connections still received the quota error through at least 14:28 UTC. Neon notes that usage metrics can be delayed by an hour; in this case enforcement lagged the visible reset by more than fourteen hours.

**Live Neon findings**

| Metric or setting | Verified value | Interpretation |
| --- | ---: | --- |
| Compute | **110.23 / 100 CU-hours** | Sole exhausted allowance; 10.23% above Free. |
| Storage | 0.03 / 0.5 GB | Not a constraint. |
| Network transfer | 0.33 / 5 GB | Not a constraint. |
| History | 0 GB | Not a contributor. |
| Production branch | **110.23 CU-hours** | All project compute usage belongs to production. |
| Development branch | **0 CU-hours**, archived | Ruled out as a source. |
| Production compute | 0.25–2 CU autoscaling | Maximum is not proof it scaled to 2 CU; historical allocation is unavailable. |
| Autosuspend | **5 minutes (default)** | Configured correctly and enabled. |
| Data size | 33.82 MB | Small; does not indicate a capacity problem. |

At the minimum 0.25 CU, 110.23 CU-hours equals **440.92 running hours**, or **14.22 hours per day** across a 31-day period. If it sometimes autoscaled above 0.25 CU, its actual running time was lower. Either way, the charge does not demonstrate that the database needs a larger machine. With evenly spaced brief activity at minimum size, one database wakeup about every 8.4 minutes would produce this order of usage because each wakeup carries up to a five-minute active tail.

The final-day monitoring view shows a brief wake at the edge of the retained window followed by inactivity after suspension. It cannot reconstruct the month. Query Performance attempts now fail with Neon's quota HTTP 402, and those statistics can reset with compute suspension, so expensive-query attribution is unavailable for this period.

**Confirmed avoidable work**

| Priority | Finding | Source evidence | Remediation status |
| --- | --- | --- | --- |
| 1 | Public data was fetched again on each server render. Route `revalidate` declarations do not persistently cache direct Prisma calls in these dynamic pages. | Original `app/page.tsx` and state routes; production build output | Implemented one shared persistent snapshot plus cached per-slug details. |
| 2 | Every hydrated job detail visit sent a database write to increment views. The endpoint had no deduplication or rate limiting. | Removed `ViewTracker` and `/api/jobs/[id]/view` | Implemented: SQL view writes removed; existing analytics records traffic. |
| 3 | Local filters and sorting navigated through the Next.js server and repeated database reads. | Original filter/sort components | Implemented with native History API URL updates. |
| 4 | State pages repeated counts and aggregations. Metadata and body independently counted the same state. | Original state routes and `lib/job-location-counts.ts` | Implemented: all derive from the shared snapshot. |
| 5 | Listing queries fetched all Job fields, including long text and fields not intended for the public client. | Original listing routes and `prisma/schema.prisma` | Implemented explicit public selects and serialized DTOs. |
| 6 | Analytics updates altered the timestamp advertised to crawlers as a content edit. | `prisma/schema.prisma:68`; original sitemap behavior | Materially reduced by removing view/apply-click Job updates. Real application writes can still advance `updatedAt`. |

Approximate application-level database calls per anonymous server render: homepage **2**, state index **3**, state detail **4**, remote page **3**, job detail **1** plus a possible employer relation query. A hydrated job detail visit adds **1 write**. Logged-in job details add saved-job and application lookups. These are source-derived call counts, not measured SQL statistics.

The root header calls `getSession()` (`app/layout.tsx:115–116`, `components/HeaderServer.tsx:10`), which reads cookies (`lib/auth.ts:38`). That contributes to dynamic rendering; the session verification itself uses JWTs and does **not** query Neon. Homepage/state search-parameter reads also require dynamic behavior. React `cache()` on the job lookup deduplicates metadata and body within one request; it does not cache between visitors. The already-existing `unstable_cache` in `lib/employer-proof.ts` demonstrates a persistent-data-cache pattern in this codebase. [Next.js database caching guidance](https://nextjs.org/docs/app/guides/caching-without-cache-components)

**What changed, and how confidently it explains the timing**

- **July 29 — `af98e47`:** job details explicitly switched to `force-dynamic` and removed attempted static generation. This is a dated candidate, but cookie reads already complicated the earlier caching. Do not simply revert it: the change fixed production rendering failures.
- **August 1 — `1aafacc`:** sitemap coverage expanded to all 51 state/DC guides, including states with no active jobs; those empty pages no longer receive `noindex`. More discoverable pages can mean more database-backed crawler requests. Actual crawler growth has not been measured.
- **August 1 — `3bab9fe`:** multi-location search introduced the `unnest(locationStates)` state aggregation and additional search predicates. These add work but are not demonstrated slow queries.
- **August 11 — `ff0401d`:** latest production deployment added the industry report. There is no demonstrated new polling loop or scheduled database workload in that change.

The strongest supported conclusion is **existing uncached database access plus a broader public request surface**, rather than a need for more database capacity. Extra branch usage is ruled out. CPU saturation, prior compute-size changes, external monitors, and the precise allocation between route types remain untested.

**What looks unlikely**

- Two cron jobs run once daily, at 03:00 and 09:00 UTC, unchanged since October 2025. Authentication happens before database calls. Combining them could save a little idle overhead, but their normal schedule cannot keep Neon running all day.
- The Stripe webhook health endpoint never queries the database.
- No recurring import schedule, frontend polling interval, or database keepalive loop was found in this repository. External uptime monitors and other clients are not ruled out.
- Pooling is already enabled in the production endpoint. Passive idle connections alone should not be blamed: Neon can close them when suspending. Repeated new connections, queries, and idle-in-transaction sessions are different. [Compute lifecycle](https://neon.com/docs/introduction/compute-lifecycle)

**Why small traffic can consume the allowance**

Neon meters allocated compute size multiplied by time running. The current Free allowance is 100 CU-hours per project per month, shared by that project's compute endpoints. At 0.25 CU this allows 400 running hours, approximately 12.9 hours per day in a 31-day month. Continuous operation uses **186 CU-hours**, even when most of that time is spent waiting for the next query. Free suspends after five minutes of inactivity. [Neon plans](https://neon.com/docs/introduction/plans)

Illustration only, assuming one 0.25-CU endpoint, near-instantaneous work, a five-minute idle tail, 31 days, and no other traffic:

| Isolated database activity | Approximate monthly CU-hours |
| --- | ---: |
| Continually awake | 186 |
| Once every 10 minutes | 93 |
| Once every 30 minutes | 31 |
| Once per hour | 15.5 |
| Twice per day | 1.29 |

Actual query duration, autoscaling, and overlapping traffic change these figures. A 60-second cache may cut query counts without reducing billed active time. Independent cache misses across many pages, uncached search, and view-counter writes can still prevent suspension. A substantial query-count reduction is not a guaranteed equal reduction in CU-hours.

**Options**

| Option | Work and tradeoff | When to choose |
| --- | --- | --- |
| A. Optimize and retain Free | Cache public content/statistics for roughly 15–60 minutes, invalidate on actual changes, eliminate or batch SQL analytics, and fix local filter navigation. Some public counts may lag between refreshes; invalidation must preserve posting/payment/edit/delete behavior. No new caching vendor is inherently required. | Best if minimizing recurring expense matters and measured usage falls comfortably below 100 CU-hours/month. |
| B. Optimize and use Launch | Same fixes, plus usage-based billing instead of Free quota suspension. Keep scale-to-zero and use the smallest compute size justified by latency/memory measurements. Add spending alerts; alerts are not hard caps. | Sensible for a public production site where another quota outage would matter, or if legitimate residual activity exceeds Free. |
| C. Upgrade only | Fast quota relief if exhaustion is confirmed, but leaves all avoidable work in place. It buys running time, not an optimization. | Temporary service restoration while fixes are prepared. |
| D. Tune queries/indexes or buy larger compute | Inspect actual query execution and CPU/memory pressure first. Existing `locationStates` already has a GIN index; substring search and active-job sorting are candidates for measured optimization. Extra indexes also cost storage and writes. | Only if monitoring shows significant query CPU, high allocations, or latency after the avoidable traffic is addressed. |

Launch currently costs **$0.106 per CU-hour with no monthly minimum**. At this project's measured 110.23 CU-hours, unchanged usage would cost approximately **$11.68/month for compute**, plus about one cent for its current root-branch storage; other billable usage can add cost. An optimized 75 CU-hours would cost $7.95 for compute. Paid pricing should not be treated as 100 free hours plus paid overage. Scale would cost about $24.47 for the same compute and its added features are not justified by the evidence. [Pricing](https://neon.com/pricing)

Code changes do not refund a consumed allowance. Service requires the next billing-period reset or an upgrade. The September period has now opened and the dashboard counter has reset, but the database gateway had not yet applied that reset at the final check. No paid-plan change was made. [Free limit behavior](https://neon.com/docs/introduction/plans#what-happens-if-i-exceed-my-free-plan-limits)

**Implementation safeguards and validation**

1. Cache only explicit public fields. Keep sessions, management tokens, saved jobs, applications, and employer-specific data outside shared public caches. Preserve live expiration checks and invalidate on posting, payment activation, editing, deletion, imports, and cleanup.
2. Use stable cache keys: do not pass a new exact timestamp as a cache argument on every request. Use shared statistics/snapshot caches rather than 51 independently refreshed copies of global data. Validate cache hits across separate requests and serverless instances; process-local memoization is insufficient.
   - Local Next.js 16.0.7 implementation review confirms that `force-dynamic` alone does not block an explicit `unstable_cache` lookup. Preserve the rendering-mode fix; do not add `fetchCache = 'force-no-store'`, which would bypass the cache lookup.
   - `unstable_cache` serializes results as JSON. Prisma `Date` values therefore return as strings on cache hits. Use a consistent serialized public DTO and explicit date conversion/hydration. Check both cold and warm paths: existing expiry comparisons, featured-status comparisons, and `.toISOString()` calls cannot safely assume cached values remain `Date` objects.
   - Avoid nesting independently cached helpers: this Next.js version bypasses reads of nested `unstable_cache` calls. Call shared caches alongside each other or compute one combined snapshot. Keep entries compact; the default cache has a 2 MB item limit.
   - A reasonable starting design is a shared compact listing/statistics snapshot refreshed hourly, with separate detail entries and explicit content-change invalidation. Different URLs can otherwise expire at different times and keep compute awake despite long individual TTLs. Deletions and payment activation require prompt invalidation; relying only on stale-while-revalidate refresh is insufficient.
3. Keep counters out of cache invalidation. For local filter navigation, also remove stale initial-value fallbacks so clearing a filter stays cleared. Treat clearing text search separately from clearing local filters.
   - If retaining SQL analytics totals, buffer events in durable storage outside Postgres and flush in batches across instances. Writing an event buffer into Neon does not remove per-event wakeups, and process-memory buffering can lose data on serverless. Include apply-click counters. Disabling SQL view writes is simpler, but employer dashboards would no longer get new view totals from those counters.
4. Confirm production project/branch/endpoint, exact exhausted metric, allowance, compute min/max, scale-to-zero, and usage by branch. Compare allocated CPU to used CPU: a long low-utilization active plateau supports unnecessary uptime; sustained CPU pressure points toward real workload or expensive SQL.
5. Check retained Vercel request data for crawler traffic, health checks, preview deployments using production, and view/click endpoint frequency. Do not disable search engines wholesale; protect expensive paths and cache public content first.
6. After deployment, validate public browsing, filters, new jobs, payment activation, expiry, and private account behavior. Measure daily CU-hours and suspension periods for several days. Under a 100-hour allowance, 100/31 = 3.23 CU-hours/day is merely break-even; target around 2–2.5 to leave headroom.

Neon Free retains only one day of monitoring, and query-performance statistics reset when compute suspends/restarts. An empty query history after an outage does not prove queries were inexpensive. Upgrading does not reconstruct missing historical Free consumption data. [Monitoring](https://neon.com/docs/introduction/monitoring-page), [query performance](https://neon.com/docs/introduction/monitor-query-performance), [consumption metrics](https://neon.com/docs/guides/consumption-metrics)

**Separate security finding, remediated in code:** the original listing queries passed full `Job` objects to a client component. The model includes `managementToken` and contact email, so source review indicated those fields could be serialized to visitors when populated. Production token exposure was not tested and no tokens were retrieved. The new public select/DTO excludes those fields. Because prior deployments may have exposed populated tokens, assess rotation and replacement management links separately before considering that historical risk closed.
