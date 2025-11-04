# 🚀 MONITORING & ANALYTICS SETUP GUIDE

## Overview

Your BlogHub now has professional-grade error monitoring (Sentry) and analytics (Google Analytics) configured. Just add your API keys to enable!

---

## ✅ WHAT'S INSTALLED

### 1. **Sentry Error Monitoring**
- Client-side error tracking
- Server-side error tracking  
- Edge runtime error tracking
- Session replay (10% sample rate)
- Performance monitoring
- Source map upload
- Automatic error reporting

### 2. **Google Analytics 4**
- Page view tracking
- User behavior analysis
- Conversion tracking
- Real-time analytics
- Custom event tracking ready

---

## 🔧 SETUP INSTRUCTIONS

### Step 1: Sentry Setup (5 minutes)

#### A. Create Sentry Account
1. Go to: https://sentry.io/signup/
2. Sign up (free plan available)
3. Create new project → Select "Next.js"
4. Copy your DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)

#### B. Add Environment Variables
Update your `.env.local`:

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
SENTRY_ORG="your-organization-slug"
SENTRY_PROJECT="your-project-name"
SENTRY_AUTH_TOKEN="your-auth-token"  # Optional for source maps
```

#### C. Get Auth Token (Optional - for source maps)
1. Go to: https://sentry.io/settings/account/api/auth-tokens/
2. Click "Create New Token"
3. Scopes: `project:releases` and `org:read`
4. Copy token and add to `.env.local`

---

### Step 2: Google Analytics Setup (3 minutes)

#### A. Create GA4 Property
1. Go to: https://analytics.google.com
2. Click "Admin" (bottom left)
3. Create Account → Create Property
4. Property name: "BlogHub"
5. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

#### B. Add Environment Variable
Update your `.env.local`:

```env
# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

---

## 🎯 VERIFICATION

### Test Sentry Integration

```bash
# 1. Start dev server
npm run dev

# 2. Open browser console and run:
throw new Error("Test Sentry Error");

# 3. Check Sentry dashboard - error should appear within seconds
```

### Test Google Analytics

```bash
# 1. Start dev server
npm run dev

# 2. Open browser with GA debugger extension or:
# 3. Check Network tab for requests to google-analytics.com/g/collect

# 4. Visit GA Real-Time report - should show 1 active user
```

---

## 📊 WHAT YOU GET

### Sentry Dashboard Shows:
- ✅ All JavaScript errors
- ✅ API errors
- ✅ Performance issues
- ✅ User session replays
- ✅ Stack traces with source maps
- ✅ User impact metrics
- ✅ Release tracking

### Google Analytics Shows:
- ✅ Page views
- ✅ User demographics
- ✅ Traffic sources
- ✅ User flow
- ✅ Conversion funnels
- ✅ Real-time users
- ✅ Engagement metrics

---

## 🔥 ADVANCED USAGE

### Custom Error Tracking

```typescript
// Anywhere in your code
import * as Sentry from "@sentry/nextjs";

try {
  // Your code
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    extra: {
      postId: post.id,
      action: 'create'
    },
    tags: {
      section: 'blog',
    }
  });
  
  throw error; // Re-throw to handle normally
}
```

### Custom GA Events

```typescript
// Track custom events
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track post creation
window.gtag('event', 'post_created', {
  category: 'Blog',
  label: post.title,
  value: post.id
});

// Track search
window.gtag('event', 'search', {
  search_term: query
});
```

### Performance Monitoring

```typescript
import * as Sentry from "@sentry/nextjs";

// Start transaction
const transaction = Sentry.startTransaction({
  name: "createPost",
  op: "mutation",
});

try {
  // Your operation
  await createPost(data);
  
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('error');
  throw error;
} finally {
  transaction.finish();
}
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Vercel Deployment

When deploying to Vercel:

1. **Add Environment Variables in Vercel Dashboard:**
   ```
   NEXT_PUBLIC_SENTRY_DSN
   SENTRY_ORG
   SENTRY_PROJECT
   SENTRY_AUTH_TOKEN
   NEXT_PUBLIC_GA_ID
   ```

2. **Automatic Source Maps Upload:**
   - Sentry will automatically upload source maps on build
   - Check Sentry dashboard → Settings → Source Maps

3. **Monitor First Deploy:**
   - Visit your production URL
   - Check Sentry dashboard for events
   - Check GA Real-Time for active users

---

## 📈 MONITORING CHECKLIST

### Daily Monitoring
- [ ] Check Sentry for new errors
- [ ] Review error trends
- [ ] Check slow transactions
- [ ] Review user feedback

### Weekly Analytics
- [ ] Review GA acquisition report
- [ ] Check popular content
- [ ] Analyze user flow
- [ ] Review conversion rates

### Monthly Health Check
- [ ] Review error rate trends
- [ ] Check performance metrics
- [ ] Analyze user retention
- [ ] Review funnel dropoffs

---

## 🎓 LEARNING RESOURCES

### Sentry
- Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Performance: https://docs.sentry.io/product/performance/
- Session Replay: https://docs.sentry.io/product/session-replay/

### Google Analytics
- GA4 Setup: https://support.google.com/analytics/answer/9304153
- Event Tracking: https://developers.google.com/analytics/devguides/collection/ga4/events
- Reports: https://support.google.com/analytics/answer/9212670

---

## 💰 PRICING

### Sentry (Free Tier)
- ✅ 5,000 errors/month
- ✅ 1 project
- ✅ 1 team member
- ✅ 30-day history
- **Plenty for small-medium projects**

### Google Analytics (Free)
- ✅ Unlimited events
- ✅ Unlimited properties
- ✅ 14 months data retention
- ✅ Standard reports
- **100% free forever**

---

## 🆘 TROUBLESHOOTING

### Sentry Not Receiving Errors

**Check:**
1. Is `NEXT_PUBLIC_SENTRY_DSN` set correctly?
2. Does DSN start with `https://`?
3. Rebuild app: `npm run build`
4. Check browser console for Sentry initialization

**Test:**
```typescript
// In browser console:
Sentry.captureMessage('Test message from console');
```

### Google Analytics Not Tracking

**Check:**
1. Is `NEXT_PUBLIC_GA_ID` in format `G-XXXXXXXXXX`?
2. Is ad blocker disabled?
3. Check Network tab for `/g/collect` requests
4. Wait 24-48 hours for data to appear in reports

**Debug:**
```bash
# Install GA Debugger Chrome extension
# https://chrome.google.com/webstore/detail/google-analytics-debugger
```

### Source Maps Not Uploading

**Check:**
1. Is `SENTRY_AUTH_TOKEN` set?
2. Does token have `project:releases` scope?
3. Check build output for Sentry plugin logs
4. Verify organization and project names

---

## ✅ VERIFICATION CHECKLIST

After setup:

- [ ] Environment variables added to `.env.local`
- [ ] `npm run build` succeeds
- [ ] Sentry dashboard shows project
- [ ] Test error appears in Sentry
- [ ] GA property created
- [ ] Real-time GA shows active users
- [ ] Environment variables added to Vercel
- [ ] Production deployment successful
- [ ] Production errors tracked
- [ ] Production analytics working

---

## 🎉 SUCCESS CRITERIA

You'll know everything works when:

1. **Sentry Dashboard:**
   - Shows events from your app
   - Performance transactions appear
   - Source maps resolve correctly
   - Session replays available

2. **Google Analytics:**
   - Real-time shows active users
   - Pages report shows page views
   - Events appear in Events report
   - User demographics visible

3. **Production:**
   - Errors automatically reported
   - No manual logging needed
   - Full visibility into issues
   - Data-driven decisions possible

---

## 📊 IMPACT ON YOUR PROJECT

### Before Setup
- 😰 No error visibility
- 😰 Manual log checking
- 😰 No user insights
- 😰 Reactive bug fixing

### After Setup
- ✅ Real-time error alerts
- ✅ Automatic error grouping
- ✅ User behavior insights
- ✅ Proactive issue resolution
- ✅ Data-driven improvements
- ✅ Professional monitoring

---

**Time Investment:** 8-10 minutes
**Value:** Priceless

**Your BlogHub now has enterprise-grade monitoring!** 🎉
