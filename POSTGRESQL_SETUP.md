# 🐘 PostgreSQL Setup Guide

## ✅ PostgreSQL is Your Database

Your project is configured and ready to use PostgreSQL with Drizzle ORM.

---

## 🚀 Quick Start (Choose One)

### Option 1: Local PostgreSQL (macOS)

#### Install PostgreSQL
```bash
# Using Homebrew (recommended)
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Verify installation
psql --version
```

#### Create Database
```bash
# Create the blogging_platform database
createdb blogging_platform

# Verify creation
psql -l | grep blogging_platform
```

#### Update .env.local
```env
DATABASE_URL="postgresql://postgres:@localhost:5432/blogging_platform"
```

#### Initialize Schema
```bash
npm run db:push
```

#### Test Connection
```bash
npx ts-node db/test-connection.ts
```

**Expected output:**
```
✅ Database connection successful!
⏰ Current database time: 2025-11-02T...
```

---

### Option 2: Neon (Cloud - Recommended) ⭐

Neon is a serverless PostgreSQL platform with a free tier.

#### Step 1: Create Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up (free account available)
3. Verify email

#### Step 2: Create Project
1. Click "Create Project"
2. Select "PostgreSQL"
3. Choose region (closest to you)
4. Wait for project creation (~30 seconds)

#### Step 3: Get Connection String
1. In Neon dashboard, find your project
2. Click "Connection" button
3. Select "Nodejs" from dropdown
4. Copy the connection string

#### Step 4: Update .env.local
```env
DATABASE_URL="postgresql://user:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require"
```

#### Step 5: Initialize Schema
```bash
npm run db:push
```

#### Step 6: Test Connection
```bash
npx ts-node db/test-connection.ts
```

---

### Option 3: Supabase (Cloud)

Supabase provides managed PostgreSQL hosting.

#### Step 1: Create Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up (free tier available)
3. Verify email

#### Step 2: Create Project
1. Click "New Project"
2. Enter project name
3. Set password (save it!)
4. Choose region
5. Wait for creation

#### Step 3: Get Connection String
1. Go to project settings
2. Click "Database"
3. Find "Connection string" section
4. Select "Nodejs"
5. Copy the string

#### Step 4: Update .env.local
```env
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

Replace `[password]` with your project password.

#### Step 5: Initialize Schema
```bash
npm run db:push
```

#### Step 6: Test Connection
```bash
npx ts-node db/test-connection.ts
```

---

### Option 4: Railway (Cloud)

Railway provides simple PostgreSQL hosting.

#### Step 1: Create Account
1. Go to [railway.app](https://railway.app)
2. Sign up (free trial available)
3. Verify email

#### Step 2: Create Project
1. Click "New Project"
2. Select "Database"
3. Choose "PostgreSQL"
4. Wait for provisioning

#### Step 3: Get Connection String
1. Click your PostgreSQL service
2. Go to "Connect" tab
3. Copy the connection string
4. Database will be auto-created

#### Step 4: Update .env.local
```env
DATABASE_URL="postgresql://user:password@railway.app:5432/dbname"
```

#### Step 5: Initialize Schema
```bash
npm run db:push
```

#### Step 6: Test Connection
```bash
npx ts-node db/test-connection.ts
```

---

## 📊 Comparison

| Provider | Cost | Setup Time | Features |
|----------|------|-----------|----------|
| **Local** | Free | 5 min | Full control, offline |
| **Neon** | Free tier | 2 min | Serverless, auto-scale |
| **Supabase** | Free tier | 3 min | Full platform, auth |
| **Railway** | Free trial | 2 min | Simple, fast deploy |

**Recommendation:** Neon for development, Railway or Supabase for production.

---

## 🎯 Complete Setup Steps

### 1. Choose Provider
Pick one from above options.

### 2. Get Connection String
Follow provider's instructions to create database and get connection string.

### 3. Update .env.local
```bash
# Edit .env.local
# Uncomment the option you're using
# Paste your connection string
```

### 4. Test Connection
```bash
npx ts-node db/test-connection.ts
```

### 5. Initialize Schema
```bash
npm run db:push
```

**Expected output:**
```
✓ Schema pushed successfully
✓ 3 tables created:
  - posts
  - categories
  - post_categories
```

### 6. Seed Data (Optional)
```bash
npm run db:seed
```

**Creates:**
- 3 sample categories
- 3 sample blog posts
- All relationships set up

### 7. Start Development
```bash
npm run dev
```

Visit http://localhost:3000 to see your blog!

---

## ✅ Verify Setup

### Test Connection
```bash
npx ts-node db/test-connection.ts
```

Should output:
```
🔍 Testing database connection...
📍 Database URL: postgresql://...
✅ Database connection successful!
⏰ Current database time: 2025-11-02T10:30:45.123Z
```

### Check Schema
```bash
# This verifies the database has the correct schema
npm run dev
# Navigate to http://localhost:3000/blog
# You should see the blog page load
```

### Create Test Post
1. Go to http://localhost:3000/dashboard
2. Click "New Post"
3. Create a post
4. Submit

If it works, your database is properly configured!

---

## 📚 Common Issues

### Issue: "Connection refused"
**Solution:**
1. Verify database is running
2. Check connection string
3. Run: `npx ts-node db/test-connection.ts`

### Issue: "Database does not exist"
**Solution:**
1. Create database (see provider instructions)
2. Run: `npm run db:push`

### Issue: "Authentication failed"
**Solution:**
1. Verify password in connection string
2. Check username is correct
3. Verify database is accessible

### Issue: "DATABASE_URL is not set"
**Solution:**
1. Check .env.local exists
2. Verify DATABASE_URL line is uncommented
3. Verify connection string is valid
4. Restart dev server: `npm run dev`

---

## 🔐 Security Tips

### Local Development
```env
# Safe to use placeholder credentials locally
DATABASE_URL="postgresql://postgres:password@localhost:5432/blogging_platform"
```

### Production
```env
# Use strong password and secure connection
DATABASE_URL="postgresql://user:strong_password@secure.host:5432/dbname?sslmode=require"
```

### Never Commit
```bash
# .env.local is in .gitignore - NEVER commit it!
# Always use environment variables in production
```

---

## 📋 Database Schema Reference

### Tables Created

**posts**
- id, title, content, slug, published
- createdAt, updatedAt
- ✅ Full-text search ready
- ✅ Pagination ready

**categories**
- id, name, description, slug
- createdAt, updatedAt
- ✅ Relationship support

**post_categories**
- postId, categoryId
- ✅ Many-to-many support
- ✅ Cascade delete enabled

---

## 🚀 Next Steps

1. ✅ Choose a provider (see options above)
2. ✅ Create database
3. ✅ Update .env.local
4. ✅ Run: `npm run db:push`
5. ✅ Run: `npm run db:seed` (optional)
6. ✅ Run: `npm run dev`
7. ✅ Visit http://localhost:3000

---

## 📞 Help

**Connection Issues:**
→ Run: `npx ts-node db/test-connection.ts`
→ See: `DATABASE_STATUS.md`

**Query Help:**
→ See: `PAGINATION_REFERENCE.md`

**Backend Questions:**
→ See: `BACKEND_ARCHITECTURE.md`

---

## ✨ Features You Get

✅ Automatic schema management
✅ Type-safe queries
✅ Pagination built-in
✅ Search functionality
✅ Advanced filtering
✅ Error handling
✅ Performance monitoring
✅ Complete documentation

---

**PostgreSQL is ready to use!** 🐘

Choose your provider and follow the steps above.

Questions? Check `DATABASE_STATUS.md` or `DATABASE_CHECK.md`
