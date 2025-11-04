# Deployment Guide

This guide covers deploying your BlogHub application to production.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and offers:

- Automatic deployments from Git
- Zero-config setup for Next.js
- Free hobby tier
- Built-in CDN and edge network
- Automatic HTTPS

### Step-by-Step Vercel Deployment

1. **Prepare Your Database**

   Before deploying, set up a production PostgreSQL database. We recommend **Neon**:

   - Go to [Neon.tech](https://neon.tech)
   - Create a free account
   - Create a new project
   - Copy your connection string (it looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)

2. **Push Your Code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: BlogHub blogging platform"
   git branch -M main
   git remote add origin https://github.com/yourusername/bloghub.git
   git push -u origin main
   ```

3. **Deploy to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset:** Next.js (auto-detected)
     - **Build Command:** `npm run build` (default)
     - **Output Directory:** `.next` (default)
     - **Install Command:** `npm install` (default)

4. **Add Environment Variables**

   In the Vercel project settings, add:

   ```
   DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

5. **Deploy!**

   Click "Deploy" and wait for the build to complete.

6. **Push Database Schema**

   After your first deployment, you need to set up the database:

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link project
   vercel link

   # Push database schema
   vercel env pull .env.local
   npm run db:push

   # Optionally seed the database
   npm run db:seed
   ```

7. **Done!**

   Your app is now live at `https://your-project.vercel.app`

## 🔧 Alternative Deployment Options

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add `DATABASE_URL` environment variable
4. Deploy!

### Deploy to Railway

1. Connect GitHub repository
2. Add `DATABASE_URL` environment variable
3. Railway auto-detects Next.js and deploys

### Deploy to Your Own Server

```bash
# Build the application
npm run build

# Start production server
npm start
```

Make sure to set the `DATABASE_URL` environment variable on your server.

## 🗄️ Database Hosting Options

### Neon (Recommended)

- **Free Tier:** 0.5 GB storage, unlimited projects
- **Serverless:** Auto-scales, pay-as-you-go
- **Fast:** Built on PostgreSQL with branching
- **Setup:** Sign up at [neon.tech](https://neon.tech)

### Supabase

- **Free Tier:** 500 MB database, 2 GB bandwidth
- **Features:** Database + Auth + Storage + Realtime
- **Setup:** Sign up at [supabase.com](https://supabase.com)

### Railway

- **Free Tier:** $5 credit/month
- **Simple:** One-click PostgreSQL deployment
- **Setup:** Sign up at [railway.app](https://railway.app)

### Render

- **Free Tier:** PostgreSQL with 90-day expiry
- **Reliable:** Good uptime
- **Setup:** Sign up at [render.com](https://render.com)

## 🔐 Environment Variables

Required environment variables for production:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

Optional (for additional features):

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📊 Post-Deployment Checklist

After deploying, make sure to:

- [ ] Verify database connection works
- [ ] Run `npm run db:push` to create tables
- [ ] Optionally run `npm run db:seed` for sample data
- [ ] Test creating a post
- [ ] Test editing a post
- [ ] Test category management
- [ ] Verify markdown rendering works
- [ ] Check responsive design on mobile
- [ ] Test all navigation links

## 🔄 Continuous Deployment

With Vercel or Netlify, every push to your main branch automatically:

1. Triggers a new build
2. Runs tests (if configured)
3. Deploys to production
4. Updates your live site

This is automatic and requires no additional configuration!

## 🐛 Troubleshooting Deployment Issues

### Build Fails with Database Error

**Issue:** Build tries to connect to database during build time.

**Solution:** Ensure tRPC calls are only made on the client side or in API routes, not during build.

### Environment Variables Not Working

**Issue:** `DATABASE_URL` is undefined.

**Solution:**

1. Check spelling in Vercel/Netlify dashboard
2. Redeploy after adding variables
3. Make sure no extra spaces in the value

### Database Connection Timeout

**Issue:** Can't connect to database from Vercel.

**Solution:**

1. Use connection pooling (already configured with postgres.js)
2. Check database allows connections from Vercel IPs
3. Verify connection string includes `?sslmode=require`

### CSS Not Loading

**Issue:** Styles don't appear in production.

**Solution:** Tailwind CSS v4 is configured correctly. If issues persist:

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### tRPC Endpoints Not Found

**Issue:** API routes return 404.

**Solution:** Verify your API route is at `app/api/trpc/[trpc]/route.ts`

## 📈 Performance Optimization

For better performance in production:

1. **Enable Image Optimization**

   ```js
   // next.config.js
   module.exports = {
     images: {
       domains: ["your-image-host.com"],
     },
   };
   ```

2. **Add Caching Headers**
   Vercel automatically adds optimal caching headers for static assets.

3. **Use Edge Runtime** (optional)
   For even faster response times, you can deploy certain routes to the edge:

   ```ts
   export const runtime = "edge";
   ```

4. **Monitor Performance**
   Use Vercel Analytics to track:
   - Page load times
   - API response times
   - User metrics

## 🔒 Security Best Practices

Before going to production:

1. **Never commit `.env.local`** - Already in .gitignore
2. **Use environment variables** for all secrets
3. **Enable SSL** - Automatic with Vercel
4. **Validate all inputs** - Already done with Zod
5. **Add rate limiting** (optional) for API endpoints

## 🎯 Next Steps After Deployment

Once deployed, you can:

1. **Set up a custom domain**

   - Add your domain in Vercel settings
   - Update DNS records
   - Automatic HTTPS

2. **Add analytics**

   - Vercel Analytics
   - Google Analytics
   - Plausible Analytics

3. **Set up monitoring**

   - Sentry for error tracking
   - LogRocket for session replay
   - Uptime monitoring

4. **Enable SEO**
   - Add meta tags
   - Generate sitemap
   - Add robots.txt

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Next.js Documentation](https://nextjs.org/docs)
3. Review [tRPC Documentation](https://trpc.io/docs)
4. Check [Neon Documentation](https://neon.tech/docs)

---

**Congratulations!** 🎉 Your BlogHub is now live!
