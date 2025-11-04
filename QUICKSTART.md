# Quick Start Guide

This guide will help you get the BlogHub application running quickly.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database (We recommend using Neon for quick setup)

## Quick Setup with Neon (Recommended)

### 1. Create a Free Neon Database

1. Go to [Neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string provided

### 2. Setup the Project

```bash
# Install dependencies
npm install

# Create .env.local file
echo 'DATABASE_URL="your-neon-connection-string"' > .env.local

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed

# Start the development server
npm run dev
```

Visit http://localhost:3000 to see your blog!

## What Gets Seeded

The seed script creates:

- **3 Categories:** Technology, Lifestyle, Business
- **3 Blog Posts:** Sample posts with markdown content
- **Category Associations:** Posts linked to relevant categories

## Next Steps

1. **Create Your First Post**

   - Click "New Post" in the navigation
   - Write content in Markdown
   - Select categories
   - Publish or save as draft

2. **Manage Categories**

   - Go to Categories page
   - Create custom categories for your content

3. **Dashboard**
   - View all your posts (published and drafts)
   - Edit or delete existing posts
   - Quick access to post management

## Environment Variables

```env
DATABASE_URL="postgresql://username:password@host:5432/database"
```

### Connection String Examples

**Neon:**

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Supabase:**

```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

**Local PostgreSQL:**

```
postgresql://postgres:password@localhost:5432/blogging_platform
```

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check your DATABASE_URL is correct in `.env.local`
2. Make sure your database is running
3. Verify network access (for cloud databases)

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Port Already in Use

If port 3000 is busy:

```bash
# Use a different port
PORT=3001 npm run dev
```

## Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Features Overview

### Landing Page (/)

- Hero section with CTA
- Features overview
- Clean, modern design

### Blog (/blog)

- List all published posts
- Filter by category
- Responsive cards layout

### Individual Post (/blog/[slug])

- Full post content with markdown rendering
- Category badges
- Timestamps

### Dashboard (/dashboard)

- Manage all posts (published & drafts)
- Quick edit/delete actions
- Status badges

### Create/Edit Post (/dashboard/new or /dashboard/edit/[id])

- Markdown editor with live preview
- Category selection
- Draft/Publish options

### Categories (/categories)

- Create new categories
- Edit existing categories
- Delete categories

## Tips for Development

1. **Use Drizzle Studio** to inspect your database:

   ```bash
   npm run db:studio
   ```

2. **Markdown Tips:**

   - Use `#` for headings (# H1, ## H2, etc.)
   - Use ``` for code blocks
   - Use `-` or `*` for lists
   - [Link text](url) for links

3. **Database Changes:**
   - After modifying `db/schema.ts`, run `npm run db:push`
   - This applies changes without creating migration files

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!
5. Run migrations on deployed instance

See README.md for detailed deployment instructions.

## Need Help?

- Check README.md for comprehensive documentation
- Review the tRPC router structure in `server/routers/`
- Inspect database schema in `db/schema.ts`
- Look at component structure in `components/` and `app/`

---

Happy Blogging! 🚀
