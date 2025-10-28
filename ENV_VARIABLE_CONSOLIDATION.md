# Environment Variable Consolidation - NEXT_PUBLIC_SITE_URL

## ✅ Change Summary

### What Changed
Consolidated `NEXT_PUBLIC_APP_URL` → `NEXT_PUBLIC_SITE_URL` for consistency across the codebase.

### Why
- You had both `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL` which are functionally identical
- This creates confusion and potential for misconfiguration
- Using a single variable name improves maintainability

---

## 📝 Files Updated

### 1. **[lib/stripe.ts](lib/stripe.ts)** ✅
**Changed**:
```typescript
// OLD
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

// NEW
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
```

### 2. **[app/api/stripe/webhook/route.ts](app/api/stripe/webhook/route.ts)** ✅
**Changed**:
```typescript
// OLD
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://datacenterworking.vercel.app');

// NEW
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://workindatacenter.com');
```
**Bonus**: Also updated the fallback domain from `datacenterworking.vercel.app` → `workindatacenter.com`

### 3. **[.env.local](.env.local)** ✅
**Removed**:
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Kept** (added earlier for SEO):
```bash
NEXT_PUBLIC_SITE_URL=https://workindatacenter.com
```

### 4. **[.env.example](.env.example)** ✅
**Removed**:
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Added**:
```bash
# Site Configuration (SEO & URLs)
# For development: http://localhost:3000
# For production: https://workindatacenter.com
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 5. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** ✅
Added note about the consolidation.

---

## 🎯 Single Source of Truth

### The Variable: `NEXT_PUBLIC_SITE_URL`

**Purpose**: Defines the base URL for your application

**Used For**:
1. ✅ **SEO**: Canonical URLs, sitemaps, structured data
2. ✅ **Stripe**: Checkout success/cancel URLs
3. ✅ **Webhooks**: Management link generation
4. ✅ **Email**: Links in email templates (future)
5. ✅ **Social**: Open Graph URLs

**Values**:
- **Development**: `http://localhost:3000`
- **Production**: `https://workindatacenter.com`

---

## 📋 Action Items for Deployment

### In Vercel Dashboard

1. **Remove old variable** (if it exists):
   - Go to: Vercel → Project → Settings → Environment Variables
   - Delete: `NEXT_PUBLIC_APP_URL` (if present)

2. **Ensure new variable is set**:
   - Variable: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://workindatacenter.com`
   - Apply to: Production, Preview, Development

### Verification

After deployment, check that:
- ✅ Stripe checkout redirects work
- ✅ Stripe webhook management links use workindatacenter.com
- ✅ robots.txt sitemap URL shows workindatacenter.com
- ✅ sitemap.xml URLs all use workindatacenter.com
- ✅ Job page canonical URLs use workindatacenter.com

---

## 🔄 Backward Compatibility

### Fallback Chain

The code still has a fallback to `VERCEL_URL`:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://workindatacenter.com');
```

This means:
1. **First choice**: `NEXT_PUBLIC_SITE_URL` (your explicit setting)
2. **Second choice**: `VERCEL_URL` (Vercel's automatic environment variable)
3. **Last resort**: `https://workindatacenter.com` (hardcoded production domain)

So even if you forget to set the environment variable, it will still work!

---

## ✅ Benefits of Consolidation

1. **Consistency**: One variable name across the entire codebase
2. **Clarity**: Name makes it clear it's for the site URL
3. **SEO-focused**: Better naming for SEO-related usage
4. **Less confusion**: No more wondering which variable to use
5. **Easier maintenance**: Update one variable, affects everything

---

## 📖 Summary

**Before**:
- Had both `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL`
- Used in different parts of the code
- Potential for misconfiguration

**After**:
- Single variable: `NEXT_PUBLIC_SITE_URL`
- Used everywhere consistently
- Clear purpose and usage

**Migration**: Complete ✅

---

**Last Updated**: 2025-10-27
**Status**: Ready for Deployment
