# BlogHub Quick Reference Card

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Configure database in .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/bloghub"

# 3. Set up database
npm run db:push

# 4. Start development
npm run dev

# 5. Open http://localhost:3000
```

## 📱 User Flows

### Create Post
1. Navigate to `/dashboard/new`
2. Fill title and content
3. Select categories (optional)
4. Click "Publish" or "Save Draft"
5. ✅ Success toast → Redirect to dashboard

### Edit Post
1. Go to `/dashboard`
2. Click "Edit" on a post
3. ✅ Breadcrumbs show edit path
4. Modify content
5. Click "Publish Changes"
6. ✅ Success toast → Redirect to dashboard

### Delete Post
1. Go to `/dashboard`
2. Click "Delete"
3. Confirm in modal
4. ✅ Success toast → Post removed from list

### Filter by Category
1. Go to `/blog`
2. Click category chip
3. ✅ Posts list updates automatically
4. Click "All topics" to reset

### View Post
1. Go to `/blog`
2. Click "Read story" on any post
3. ✅ Breadcrumbs show "Home > Blog > Post Title"
4. ✅ Markdown renders correctly
5. Click "← Back to all posts" to return

### Manage Categories
1. Go to `/categories`
2. Click "Create Category"
3. Fill form and submit
4. ✅ Toast confirms creation
5. Edit/Delete available on each category

## 🎨 UI Components

### Breadcrumbs (Navigation Trail)
```tsx
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Current Page" },
  ]}
/>
```

### Toasts (User Feedback)
```tsx
import { toast } from "sonner";

toast.success("Action successful");
toast.error("Action failed", { description: "Details here" });
toast.loading("Processing...");
```

## 🗄️ Database

### Tables
- `posts` - Blog posts with title, content, slug, published flag
- `categories` - Post categories with name, description
- `post_categories` - Junction table for many-to-many relationship

### Setup Commands
```bash
npm run db:push      # Create/update schema
npm run db:seed      # Add sample data
npm run db:test      # Verify connection
npm run db:studio    # Open Drizzle Studio UI
```

## 🔧 API Endpoints (tRPC)

### Posts
- `post.getAll` - List all posts (supports categoryId filter)
- `post.getBySlug` - Get single post by slug
- `post.getById` - Get single post by ID
- `post.create` - Create new post
- `post.update` - Update existing post
- `post.delete` - Delete post

### Categories
- `category.getAll` - List all categories
- `category.getBySlug` - Get single category
- `category.getById` - Get category with post count
- `category.create` - Create new category
- `category.update` - Update category
- `category.delete` - Delete category

## 📂 Project Structure

```
app/
├── layout.tsx (Root with Toaster)
├── page.tsx (Homepage)
├── blog/
│   ├── page.tsx (List posts)
│   └── [slug]/page.tsx (Post detail)
├── dashboard/
│   ├── page.tsx (Post list)
│   ├── new/page.tsx (Create post)
│   └── edit/[id]/page.tsx (Edit post)
├── categories/page.tsx (Manage categories)
└── api/trpc/[trpc]/route.ts (API)

components/
├── navigation.tsx (Sticky header)
├── footer.tsx (Shared footer)
├── toaster.tsx (Toast notifications)
├── breadcrumbs.tsx (Navigation trail)
├── background/web-network.tsx (3D lattice)
├── hero/spectacular-hero.tsx (Hero animation)
└── ui/ (shadcn components)

server/
├── trpc.ts (Server configuration)
└── routers/
    ├── post.ts (Post procedures)
    └── category.ts (Category procedures)

db/
├── schema.ts (Database tables)
├── index.ts (Drizzle client)
└── seed.ts (Sample data)
```

## 🧪 Testing

### Quick Check
1. Run `npm run build` - Should succeed
2. Run `npm run dev` - Start server
3. Navigate to each route:
   - `/` - Homepage
   - `/blog` - Post list
   - `/blog/[slug]` - Post detail
   - `/dashboard` - Post management
   - `/dashboard/new` - Create post
   - `/dashboard/edit/[id]` - Edit post
   - `/categories` - Manage categories

### Check Console
- Open DevTools (F12)
- Go to Console tab
- Should see no errors (only logs)

### Test Forms
1. Try creating post without title → Validation toast
2. Try creating post with title and content → Success toast
3. Try deleting post → Confirmation modal → Success toast

## 🌐 Database URLs

### Development
```
postgresql://postgres:password@localhost:5432/bloghub
```

### Neon (Free Cloud)
1. Create account: neon.tech
2. Create project
3. Copy connection string
4. Paste in .env.local

### Supabase (Free Cloud)
1. Create account: supabase.com
2. Create project
3. Go to Settings → Database
4. Copy connection string
5. Paste in .env.local

## 📊 Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Create Post | ✅ Working | Toast feedback added |
| Edit Post | ✅ Working | Breadcrumbs + toast |
| Delete Post | ✅ Working | Confirmation modal |
| Filter by Category | ✅ Working | Query refetch |
| Category CRUD | ✅ Working | Full operations |
| Error Handling | ✅ Working | TRPCError with codes |
| Toast Notifications | ✅ Working | All mutations covered |
| Breadcrumbs | ✅ Working | Detail pages |
| Responsive Design | ✅ Built | CSS/mobile-first |
| Animations | ✅ Working | Motion layer active |

## ⚠️ Common Issues

### Posts not showing
- Check DATABASE_URL in .env.local
- Run `npm run db:test`
- Run `npm run db:push`

### Toast not appearing
- Check Toaster in layout.tsx
- Check browser console for errors
- Clear browser cache

### Breadcrumbs missing
- Check import in page files
- Verify component renders
- Check browser inspector

### Build fails
- Delete `node_modules` and `.next`
- Run `npm install`
- Run `npm run build` again

### 404 errors
- Verify DATABASE_URL is set
- Check PostgreSQL is running
- Check database tables exist

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set DATABASE_URL environment variable
4. Deploy

### Other Platforms
1. Set DATABASE_URL
2. Run `npm run build`
3. Deploy build folder
4. Set environment variables

## 📞 Support

### Documentation
- `END_TO_END_AUDIT.md` - Testing guide
- `INTEGRATION_COMPLETE.md` - Deployment guide
- `CHANGES_SUMMARY.md` - What changed
- `COMPLETION_REPORT.md` - Full report

### Logs
- Check browser console for client errors
- Check terminal for server errors
- Check PostgreSQL logs for database issues

## 🎯 Success Criteria

✅ All checks needed for launch:
- Build succeeds
- Database connected
- Posts can be created
- Posts can be edited
- Posts can be deleted
- Categories can be filtered
- Toast notifications work
- No console errors
- Mobile layout works
- Breadcrumbs display

---

**Version**: 1.0 Integration Complete
**Last Updated**: End-to-End Audit Session
**Status**: Production Ready ✅
