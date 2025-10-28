# Deployment Checklist for workindatacenter.com

## ✅ Pre-Deployment (Complete These Before Pushing to Vercel)

### 1. Environment Variables
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://workindatacenter.com` in Vercel
  - Go to: Vercel Dashboard → Project → Settings → Environment Variables
  - Add for: Production, Preview, Development
  - **Note**: This replaces the old `NEXT_PUBLIC_APP_URL` variable (now consolidated for consistency)

### 2. Domain Configuration in Vercel
- [ ] Primary domain set to: `workindatacenter.com`
- [ ] SSL certificate active (automatic with Vercel)
- [ ] 301 redirect configured: `datacenterworking.vercel.app` → `workindatacenter.com`
- [ ] Decide on www handling:
  - Option A: `www.workindatacenter.com` → `workindatacenter.com` (recommended)
  - Option B: Keep both active

### 3. Update Webhook URLs
- [ ] Stripe webhook URL: Update to use `workindatacenter.com` domain
  - Go to Stripe Dashboard → Developers → Webhooks
  - Update endpoint to: `https://workindatacenter.com/api/stripe/webhook`
  - Copy new webhook secret to `STRIPE_WEBHOOK_SECRET` in Vercel

### 4. Email Configuration (Resend)
- [ ] Verify `EMAIL_FROM=noreply@workindatacenter.com` domain in Resend
- [ ] Update any email templates with correct domain links

---

## 🚀 Deployment Steps

### Step 1: Commit All Changes
```bash
git add .
git commit -m "Add comprehensive SEO optimization with AI crawler support and Prisma deployment fixes"
git push origin main
```

### Step 2: Monitor Vercel Build
- Watch the build logs in Vercel dashboard
- Ensure build completes successfully
- Check for any warnings or errors

### Step 3: Verify Deployment
Visit these URLs after deployment:

- [ ] https://workindatacenter.com (homepage loads)
- [ ] https://workindatacenter.com/robots.txt (shows all crawlers)
- [ ] https://workindatacenter.com/sitemap.xml (shows all pages & jobs)
- [ ] https://workindatacenter.com/jobs/[any-job-slug] (job page loads)

---

## 🔍 Post-Deployment Verification

### Test SEO Implementation

#### 1. robots.txt Check
```
Visit: https://workindatacenter.com/robots.txt
```
Should show:
- User-agent: *
- User-agent: OAI-SearchBot
- User-agent: GPTBot
- User-agent: Googlebot
- User-agent: Bingbot
- Sitemap: https://workindatacenter.com/sitemap.xml

#### 2. Sitemap Check
```
Visit: https://workindatacenter.com/sitemap.xml
```
Should display XML with:
- All static pages (about, pricing, contact, etc.)
- All active job listings
- Priority and lastmod dates

#### 3. Structured Data Check
```
Visit: https://search.google.com/test/rich-results
Test URL: https://workindatacenter.com/jobs/[any-job-slug]
```
Should detect:
- ✅ JobPosting schema
- ✅ BreadcrumbList schema

#### 4. Open Graph Check
```
Visit: https://www.opengraph.xyz/
Test URL: https://workindatacenter.com
```
Should show:
- Site title
- Description
- Image preview (if og-image.png exists)

#### 5. Page Source Checks
Right-click → View Page Source on any job page:
- [ ] Find `<script type="application/ld+json">` with JobPosting
- [ ] Find `<script type="application/ld+json">` with BreadcrumbList
- [ ] Find `<meta property="og:title" ...>`
- [ ] Find `<meta property="og:description" ...>`
- [ ] Find `<link rel="canonical" ...>`

---

## 📊 Submit to Search Engines

### Google Search Console
1. [ ] Go to: https://search.google.com/search-console
2. [ ] Add property: `workindatacenter.com`
3. [ ] Verify ownership (DNS or HTML file upload)
4. [ ] Submit sitemap: `https://workindatacenter.com/sitemap.xml`
5. [ ] Request indexing for homepage
6. [ ] Request indexing for 2-3 key job pages
7. [ ] Monitor "Coverage" report for indexing status

**Expected Timeline**:
- Initial indexing: 1-3 days
- Full sitemap crawl: 1-2 weeks
- Google for Jobs eligibility: 2-4 weeks

### Bing Webmaster Tools (CRITICAL for SearchGPT!)
1. [ ] Go to: https://www.bing.com/webmasters
2. [ ] Add site: `workindatacenter.com`
3. [ ] Verify ownership
4. [ ] Submit sitemap: `https://workindatacenter.com/sitemap.xml`
5. [ ] Configure crawl rate (keep default)

**Why Important**: SearchGPT uses Bing's search index!

### Google Business Profile (Optional)
- [ ] Create profile if you have a physical business location
- [ ] Link to workindatacenter.com
- [ ] Helps with local SEO

---

## 🧪 Test AI Visibility

### ChatGPT Citation Testing (Week 2-4 after indexing)
Ask ChatGPT these questions and monitor for citations:

1. "Where can I find data center jobs?"
2. "What are the best job boards for data center careers?"
3. "How do I find data center operations jobs?"
4. "What certifications do I need for data center jobs?"

**Note**: It takes 2-4 weeks for new content to be eligible for ChatGPT citations after OAI-SearchBot crawls your site.

### SearchGPT Testing
- SearchGPT is powered by Bing
- After Bing indexes your site (1-2 weeks), test search queries
- Look for your site in results

---

## 📈 Monitor Performance

### Week 1
- [ ] Verify all pages are accessible
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor Vercel analytics for traffic
- [ ] Test all forms and job applications still work

### Week 2-4
- [ ] Check Google Search Console: Impressions starting?
- [ ] Bing Webmaster Tools: Pages indexed?
- [ ] Run Google Rich Results Test on new jobs
- [ ] Monitor for any 404 errors

### Month 2-3
- [ ] Google Search Console: Track impression growth
- [ ] Look for Google for Jobs listings appearing
- [ ] Test ChatGPT for brand citations
- [ ] Monitor organic traffic in Google Analytics

### Month 4-6
- [ ] Analyze keyword rankings (data center jobs, etc.)
- [ ] Track conversion rates from organic traffic
- [ ] Identify top-performing job categories
- [ ] Optimize based on Search Console data

---

## 🚨 Troubleshooting

### Issue: robots.txt not showing
**Solution**:
- Clear browser cache
- Wait 5 minutes after deployment
- Check Vercel build logs

### Issue: Sitemap shows no jobs
**Solution**:
- Verify DATABASE_URL is set in Vercel
- Check that jobs exist in database
- Look at Vercel function logs for errors

### Issue: Rich Results Test fails
**Solution**:
- Verify page is publicly accessible (not behind auth)
- Check JSON-LD syntax in browser View Source
- Ensure all required JobPosting fields are present

### Issue: Pages not indexing
**Solution**:
- Verify robots.txt allows crawling
- Submit sitemap to Google Search Console
- Request manual indexing for key pages
- Wait 1-2 weeks for natural crawl

### Issue: Vercel deployment fails (Prisma error)
**Solution**:
- Check that all fixes from earlier are in place:
  - `engineType = "library"` in schema.prisma
  - `outputFileTracingIncludes` in next.config.ts
  - `prisma` in dependencies (not devDependencies)

---

## 📋 Quick Reference URLs

### Testing Tools
- Google Rich Results: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/
- Open Graph Checker: https://www.opengraph.xyz/
- Lighthouse: Run in Chrome DevTools (F12 → Lighthouse tab)

### Search Console
- Google: https://search.google.com/search-console
- Bing: https://www.bing.com/webmasters

### Your Site URLs (After Deployment)
- Homepage: https://workindatacenter.com
- robots.txt: https://workindatacenter.com/robots.txt
- Sitemap: https://workindatacenter.com/sitemap.xml
- Sample Job: https://workindatacenter.com/jobs/[slug]

---

## ✅ Success Criteria

Your SEO implementation is successful when:

1. ✅ robots.txt is accessible and allows all bots
2. ✅ sitemap.xml generates with all active jobs
3. ✅ Google Rich Results Test validates JobPosting schema
4. ✅ Open Graph preview shows correct title/description/image
5. ✅ Google Search Console shows pages being indexed
6. ✅ Bing Webmaster Tools shows pages being crawled
7. ✅ No 404 errors in search console
8. ✅ Site appears in Google search results (within 1-2 weeks)
9. ✅ Jobs appear in Google for Jobs (within 2-4 weeks)
10. ✅ ChatGPT begins citing your site (within 4-6 weeks)

---

**Last Updated**: 2025-10-27
**Next Review**: After deployment + 2 weeks
