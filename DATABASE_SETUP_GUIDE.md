# 🗄️ DATABASE SETUP GUIDE

## Quick Start: Choose Your Provider

This guide walks you through setting up PostgreSQL for your BlogHub project. **Neon is recommended** for fastest setup.

---

## 📊 Provider Comparison

| Feature | Neon | Supabase | Railway | Local |
|---------|------|----------|---------|-------|
| **Speed to Deploy** | ⚡ 5 min | ⚡ 10 min | ⚡ 10 min | 🐢 20 min |
| **Free Tier** | ✅ Yes | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Best For** | 🚀 Quick start | 🛠️ Full stack | 🚀 Production | 💻 Local dev |
| **Setup Difficulty** | ⭐ Easy | ⭐⭐ Medium | ⭐⭐ Medium | ⭐⭐⭐ Hard |
| **Maintenance** | Zero | Low | Medium | High |

### ✨ RECOMMENDED: Start with Neon (5 minutes) ➜ Easy Deploy Later

---

## 🚀 Option 1: Neon (RECOMMENDED - 5 MINUTES)

### Step 1: Create Neon Account
1. Go to https://neon.tech
2. Click **"Sign Up"**
3. Use email or GitHub login
4. Verify email

### Step 2: Create Project
1. Click **"New Project"**
2. Enter project name: `bloghub`
3. Select region closest to you (US-East recommended)
4. Click **"Create"**

### Step 3: Get Connection String
1. After creation, you'll see the dashboard
2. Look for **"Connection String"** section
3. Select **"Pooling"** (better for serverless)
4. Copy the full connection string

**Connection string looks like:**
```
postgresql://neondb_owner:xxx@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

### Step 4: Update `.env.local`
1. Open `.env.local` in your editor
2. Replace the `DATABASE_URL` line:

```bash
DATABASE_URL="postgresql://neondb_owner:xxx@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
```

### Step 5: Initialize Database
```bash
npm run db:push
```

Expected output:
```
✓ Connected to database
✓ Creating schema...
✓ posts table created
✓ categories table created
✓ post_categories table created
✓ Database ready!
```

### Step 6: (Optional) Seed Sample Data
```bash
npm run db:seed
```

### Step 7: Start Development
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🛠️ Option 2: Supabase (10 MINUTES)

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click **"Start your project"**
3. Use email or GitHub login
4. Verify email

### Step 2: Create Project
1. Click **"New Project"**
2. Project name: `bloghub`
3. Database password: (save this!)
4. Region: Choose closest region
5. Click **"Create"**
6. Wait for database initialization (2-3 minutes)

### Step 3: Get Connection String
1. Go to **Settings** → **Database**
2. Look for **"Connection String"**
3. Change dropdown from **"URI"** to **"Postgres"**
4. Select **"Connection pooling"** mode (Pgbouncer)
5. Copy the connection string

**Connection string looks like:**
```
postgresql://postgres:[password]@db.xxxxx.supabase.co:6543/postgres?sslmode=require
```

### Step 4: Update `.env.local`
```bash
DATABASE_URL="postgresql://postgres:[password]@db.xxxxx.supabase.co:6543/postgres?sslmode=require"
```

### Step 5: Initialize Database
```bash
npm run db:push
```

### Step 6: (Optional) Seed Sample Data
```bash
npm run db:seed
```

### Step 7: Start Development
```bash
npm run dev
```

---

## 🚂 Option 3: Railway (10 MINUTES)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click **"Start with GitHub"** (easiest)
3. Authorize Railway
4. Create account

### Step 2: Create PostgreSQL Database
1. Click **"New Project"**
2. Click **"Provision New"** → **"PostgreSQL"**
3. Wait for database to initialize

### Step 3: Get Connection String
1. Click on **"PostgreSQL"** in your project
2. Go to **"Connect"** tab
3. Copy the **"Database URL"**

**Connection string looks like:**
```
postgresql://root:xxx@railway.app:5432/railway?sslmode=require
```

### Step 4: Update `.env.local`
```bash
DATABASE_URL="postgresql://root:xxx@railway.app:5432/railway?sslmode=require"
```

### Step 5: Initialize Database
```bash
npm run db:push
```

### Step 6: (Optional) Seed Sample Data
```bash
npm run db:seed
```

### Step 7: Start Development
```bash
npm run dev
```

---

## 💻 Option 4: Local PostgreSQL (20 MINUTES)

### Prerequisites
- macOS: Install Homebrew (if not already installed)

### Step 1: Install PostgreSQL (macOS with Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

### Step 2: Create Database
```bash
# Login to PostgreSQL
psql postgres

# Inside psql prompt, run:
CREATE DATABASE blogging_platform OWNER postgres;
\q
```

### Step 3: Get Connection String
Your local connection string is:
```
postgresql://postgres:password@localhost:5432/blogging_platform
```

### Step 4: Update `.env.local`
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/blogging_platform"
```

### Step 5: Initialize Database
```bash
npm run db:push
```

### Step 6: (Optional) Seed Sample Data
```bash
npm run db:seed
```

### Step 7: Start Development
```bash
npm run dev
```

### Troubleshooting Local Setup

**Error: "psql: command not found"**
```bash
# Add PostgreSQL to PATH
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Error: "Connection refused"**
```bash
# PostgreSQL might not be running, restart it
brew services restart postgresql@15
```

**Error: "role postgres does not exist"**
```bash
# Create postgres user
createuser --superuser postgres
```

---

## ✅ VERIFICATION: Check Connection

After updating `.env.local`, verify the connection:

```bash
# Test database connection
npm run db:test
```

Expected output:
```
✅ Database Connection Successful!
📦 Tables: 3 (posts, categories, post_categories)
📊 Status: Ready for data
```

---

## 🗂️ Database Schema

Your database will have 3 tables:

### 📝 `posts` table
```sql
- id: UUID (primary key)
- title: String (required)
- slug: String (unique, auto-generated from title)
- content: String (markdown)
- published: Boolean (default: false)
- createdAt: Timestamp
- updatedAt: Timestamp
- categoryId: UUID (foreign key)
```

### 📂 `categories` table
```sql
- id: UUID (primary key)
- name: String (unique)
- description: String
- createdAt: Timestamp
- updatedAt: Timestamp
```

### 🔗 `post_categories` table
```sql
- id: UUID (primary key)
- postId: UUID (foreign key)
- categoryId: UUID (foreign key)
```

---

## 🚀 POST-SETUP CHECKLIST

After initializing your database:

- [ ] Database created successfully
- [ ] Tables created (posts, categories, post_categories)
- [ ] `.env.local` updated with connection string
- [ ] `npm run db:push` executed successfully
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Dashboard loads (create post button visible)
- [ ] Can create a new post
- [ ] Can view post on blog page

---

## 🛠️ COMMON COMMANDS

```bash
# Initialize/update database schema
npm run db:push

# Test database connection
npm run db:test

# Seed sample data
npm run db:seed

# Open database studio (visual editor)
npm run db:studio

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

---

## 📋 TROUBLESHOOTING

### "pnpm not found"
```bash
# Install pnpm globally
npm install -g pnpm
```

### "Database connection failed"
1. Check your connection string in `.env.local`
2. Verify DATABASE_URL is not commented out
3. For cloud providers: ensure firewall allows your IP
4. Test connection: `npm run db:test`

### "Table already exists"
```bash
# This is normal. Drizzle will skip existing tables.
# To reset (WARNING: deletes all data):
npm run db:reset
```

### "ssl: certificate verify failed"
Add to your connection string (already included):
```
?sslmode=require
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001

# Visit: http://localhost:3001
```

---

## 🎯 NEXT STEPS

### Immediate (After Setup)
1. ✅ Choose a provider and follow setup steps
2. ✅ Run `npm run db:push`
3. ✅ Run `npm run dev`
4. ✅ Create a test post in dashboard
5. ✅ View it on blog page

### Short Term (This week)
- Deploy to Vercel (free, takes 2 minutes)
- Share live link
- Test with real data
- Gather feedback

### Long Term (Optional enhancements)
- Add authentication (Clerk, Auth0)
- Add analytics
- Add comments system
- Add image optimization
- Add CDN for assets

---

## 🎊 SUCCESS CRITERIA

You know setup is complete when:
- ✅ No errors in console
- ✅ Dashboard loads at http://localhost:3000/dashboard
- ✅ Can create posts
- ✅ Posts appear on blog page
- ✅ Can filter by category
- ✅ Can search posts
- ✅ Can edit/delete posts

---

## 📞 NEED HELP?

### Connection String Issues?
1. Copy connection string again from provider
2. Paste into `.env.local` exactly as provided
3. Check for spaces or special characters
4. Run `npm run db:test` to verify

### Database Commands Failing?
1. Check `pnpm` is installed: `pnpm --version`
2. Check dependencies: `pnpm install`
3. Verify `.env.local` exists in root folder
4. Check DATABASE_URL is set

### Application Not Starting?
1. Stop current server (Ctrl+C)
2. Clear node_modules: `rm -rf node_modules && pnpm install`
3. Try again: `npm run dev`
4. Check for port conflicts on 3000

---

## 🎉 RECOMMENDED SETUP PATH

### If you're new to databases:
**Neon → 5 minutes → Most beginner-friendly**

### If you want everything integrated:
**Supabase → 10 minutes → Includes auth, storage, etc.**

### If you want performance:
**Railway → 10 minutes → Great for production**

### If you prefer local development:
**Local PostgreSQL → 20 minutes → Full control**

---

**Your BlogHub project is ready to go! 🚀**

*Last Updated: November 2, 2025*
