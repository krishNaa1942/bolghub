# 🚀 Setup Instructions for BlogHub

Follow these steps to get your blogging platform running locally.

## Step 1: Database Setup (Choose One)

### Option A: Neon (Recommended - Free & Fast)

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string provided
4. It will look like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:

```
postgresql://postgres:password@localhost:5432/blogging_platform
```

## Step 2: Configure Environment

Open the `.env.local` file in this folder and replace the DATABASE_URL:

```env
DATABASE_URL="paste-your-connection-string-here"
```

## Step 3: Install & Setup

Run these commands in your terminal:

```bash
# Make sure you're in the project directory
cd /Users/laxmanp/Downloads/internshipproject

# Install all dependencies
npm install

# Push the database schema (creates tables)
npm run db:push

# Seed with sample blog posts and categories
npm run db:seed

# Start the development server
npm run dev
```

## Step 4: Open Your Browser

Visit: **http://localhost:3000**

You should see the BlogHub landing page! 🎉

## What You'll See

After seeding, you'll have:

- ✅ 3 sample categories (Technology, Lifestyle, Business)
- ✅ 3 sample blog posts
- ✅ A fully functional blog ready to use

## Quick Tour

1. **Landing Page (/)** - Click "Explore Blog"
2. **Blog Page (/blog)** - See all posts, try filtering by category
3. **Dashboard (/dashboard)** - Manage your posts
4. **Create Post** - Click "New Post" button
5. **Categories** - Manage categories from the navigation

## Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Update database schema
npm run db:seed      # Add sample data
npm run db:studio    # Open database GUI (optional)
```

## Troubleshooting

### Issue: "Cannot connect to database"

- ✅ Check your DATABASE_URL in `.env.local`
- ✅ Make sure your database is running (for local PostgreSQL)
- ✅ Verify your Neon project is active (for Neon)

### Issue: "Tables don't exist"

- ✅ Run `npm run db:push` to create tables

### Issue: "Port 3000 already in use"

- ✅ Try: `PORT=3001 npm run dev`

### Issue: "Module not found errors"

- ✅ Run: `npm install` again

## Need Help?

- 📖 Check **README.md** for comprehensive documentation
- 📖 Check **QUICKSTART.md** for more detailed setup
- 📖 Check **DEPLOYMENT.md** for production deployment

---

**You're all set!** Start creating blog posts and managing your content. 🚀
