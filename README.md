# BlogHub - Multi-User Blogging PlatformThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A modern, full-stack blogging platform built with Next.js 15, tRPC, PostgreSQL, and Drizzle ORM. Features include blog post management, category organization, markdown support, and a clean, responsive UI.## Getting Started

## 🚀 Tech StackFirst, run the development server:

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript```bash

- **Backend:** tRPC, Next.js API Routesnpm run dev

- **Database:** PostgreSQL with Drizzle ORM# or

- **Styling:** Tailwind CSS, shadcn/uiyarn dev

- **State Management:** Zustand, React Query (TanStack Query)# or

- **Validation:** Zodpnpm dev

- **Content:** Markdown with React-Markdown# or

bun dev

## ✨ Features Implemented```

### 🔴 Priority 1 (Must Have) - All Completed ✅Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- ✅ Blog post CRUD operations (create, read, update, delete)

- ✅ Category CRUD operationsYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- ✅ Assign multiple categories to posts

- ✅ Blog listing page showing all postsThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- ✅ Individual post view page with markdown rendering

- ✅ Category filtering on listing page## Learn More

- ✅ Basic responsive navigation

- ✅ Clean, professional UITo learn more about Next.js, take a look at the following resources:

### 🟡 Priority 2 (Should Have) - All Completed ✅- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- ✅ Landing page with Header/Hero, Features, and Footer sections- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- ✅ Dashboard page for managing posts

- ✅ Draft vs Published post statusYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- ✅ Loading and error states throughout

- ✅ Mobile-responsive design## Deploy on Vercel

- ✅ Markdown editor with live preview

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### 🟢 Priority 3 (Nice to Have)

- ✅ Post statistics (reading time calculated from content)Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- ⬜ Search functionality (can be added if needed)
- ⬜ Image upload (can be added if needed)
- ⬜ Dark mode support (Tailwind classes already support it)
- ⬜ Pagination (can be added for large datasets)

## 📁 Project Structure

```
internshipproject/
├── app/
│   ├── api/
│   │   └── trpc/[trpc]/route.ts    # tRPC API route handler
│   ├── blog/
│   │   ├── [slug]/page.tsx          # Individual blog post view
│   │   └── page.tsx                 # Blog listing with filters
│   ├── categories/
│   │   └── page.tsx                 # Category management
│   ├── dashboard/
│   │   ├── edit/[id]/page.tsx       # Edit post
│   │   ├── new/page.tsx             # Create new post
│   │   └── page.tsx                 # Dashboard/post management
│   ├── layout.tsx                   # Root layout with tRPC provider
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
├── components/
│   ├── ui/                          # shadcn/ui components
│   └── navigation.tsx               # Main navigation component
├── db/
│   ├── schema.ts                    # Drizzle ORM schema
│   ├── index.ts                     # Database connection
│   └── seed.ts                      # Database seeding script
├── lib/
│   ├── trpc.ts                      # tRPC client setup
│   ├── trpc-provider.tsx            # tRPC React Provider
│   └── utils.ts                     # Utility functions
├── server/
│   ├── routers/
│   │   ├── post.ts                  # Post CRUD router
│   │   └── category.ts              # Category CRUD router
│   ├── trpc.ts                      # tRPC initialization
│   └── index.ts                     # Main router export
├── drizzle.config.ts                # Drizzle Kit configuration
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd internshipproject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/blogging_platform"
```

**For Hosted PostgreSQL:**

- **Neon:** `postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
- **Supabase:** `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`
- **Local:** `postgresql://postgres:password@localhost:5432/blogging_platform`

### 4. Database Setup

#### Generate Database Schema

```bash
npm run db:push
```

This will push your schema to the database without creating migration files (perfect for development).

#### Seed the Database

```bash
npm run db:seed
```

This will create:

- 3 sample categories (Technology, Lifestyle, Business)
- 3 sample blog posts
- Category-post relationships

### 5. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Posts Table

- `id` (serial, primary key)
- `title` (text, not null)
- `content` (text, not null) - Markdown content
- `slug` (text, unique, not null) - Auto-generated from title
- `published` (boolean, default: false)
- `createdAt` (timestamp, default: now())
- `updatedAt` (timestamp, default: now())

### Categories Table

- `id` (serial, primary key)
- `name` (text, unique, not null)
- `description` (text, nullable)
- `slug` (text, unique, not null) - Auto-generated from name
- `createdAt` (timestamp, default: now())
- `updatedAt` (timestamp, default: now())

### Post_Categories Table (Junction)

- `postId` (serial, foreign key to posts)
- `categoryId` (serial, foreign key to categories)
- Composite primary key on (postId, categoryId)
- Cascade delete on both foreign keys

## 🗂️ tRPC Router Structure

### Post Router (`server/routers/post.ts`) - Enhanced ✨

- `getAll` - Get all posts with **pagination**, search, and filtering
  - Supports: `limit` (1-100, default 20), `offset`, `search`, `categoryId`, `published`
  - Returns: `{ posts: Post[], total: number }`
- `getBySlug` - Get a single post by slug with related categories
- `getById` - Get a single post by ID with related categories  
- `getByCategoryId` - **NEW** - Efficiently get posts by category with pagination
- `create` - Create a new post with category assignments + validation schema
- `update` - Update a post and its categories + validation schema
- `delete` - Delete a post (cascade deletes category relationships)

### Category Router (`server/routers/category.ts`) - Enhanced ✨

- `getAll` - Get all categories
- `getBySlug` - Get a single category by slug
- `getById` - Get a single category by ID
- `create` - Create a new category + validation schema
- `update` - Update a category + validation schema
- `delete` - Delete a category (cascade deletes post relationships)
- `getPostsByCategory` - Get all posts for a specific category

### Backend Infrastructure Enhancements

- **Request Middleware**: Automatic request timing tracking (warns on slow queries > 1s)
- **Input Validation**: Zod schemas for all create/update operations
- **Error Handling**: Standardized TRPCError codes (NOT_FOUND, BAD_REQUEST, CONFLICT)
- **Pagination System**: Full-text search with ilike, limit/offset pagination, multi-filter support
- **Duplicate Detection**: Prevents duplicate post titles and category names
- **Resource Verification**: All mutations verify resource exists before operating

## 🎯 Key Features & Implementation

### Type Safety with tRPC

- End-to-end type safety from database to frontend
- Automatic type inference for API calls
- No need for manual API type definitions

### Input Validation with Zod

- All tRPC procedures use Zod schemas for input validation
- Client and server-side validation
- Type-safe error handling

### Markdown Support

- Write posts in Markdown
- Live preview while editing
- Syntax highlighting for code blocks
- Support for GitHub Flavored Markdown (GFM)

### Optimistic Updates

- Instant UI feedback on mutations
- React Query cache invalidation
- Smooth user experience

### Responsive Design

- Mobile-first approach
- Works seamlessly on all devices
- Clean, modern UI with shadcn/ui components

## 📝 Usage Guide

### Creating a Post

1. Navigate to Dashboard or click "New Post" in navigation
2. Enter title and content (markdown supported)
3. Select categories (optional)
4. Save as Draft or Publish immediately
5. Edit or delete posts from the Dashboard

### Managing Categories

1. Go to Categories page
2. Create new categories with name and description
3. Edit or delete existing categories
4. Categories are automatically available for post assignment

### Viewing Blog Posts

1. Browse all published posts on the Blog page
2. Filter by category using the dropdown
3. Click any post to view full content
4. Navigate back to blog listing

## 🚀 Deployment

### Deploying to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
4. Deploy!

### Database Options for Production

- **Neon** (Recommended): Serverless PostgreSQL, generous free tier
- **Supabase**: Full backend platform with PostgreSQL
- **Railway**: Easy PostgreSQL hosting
- **AWS RDS**: Enterprise-grade database

### Post-Deployment

```bash
# Push database schema to production
npm run db:push

# Seed production database (optional)
npm run db:seed
```

## 🛠️ Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate migration files
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:seed      # Seed the database
```

## 🎨 Design Decisions & Trade-offs

### Markdown over Rich Text Editor

- **Why:** Faster implementation (2-3 hours saved), simpler codebase
- **Trade-off:** Less WYSIWYG, but markdown is familiar to developers
- **Benefit:** Built-in syntax highlighting, clean content storage

### Shadcn/ui for Components

- **Why:** Pre-built, customizable, copy-paste components
- **Benefit:** Saved 3-4 hours, consistent design system
- **Trade-off:** None - components are fully customizable

### tRPC over REST

- **Why:** End-to-end type safety, no code generation needed
- **Benefit:** Fewer bugs, better DX, automatic API documentation
- **Trade-off:** Slightly steeper learning curve for beginners

### Drizzle ORM over Prisma

- **Why:** Lightweight, closer to SQL, better TypeScript inference
- **Benefit:** Better performance, simpler mental model
- **Trade-off:** Less GUI tooling (though Drizzle Studio helps)

### No Authentication

- **Why:** Per requirements, focus on core blogging features
- **Future:** Can add Clerk, Auth.js, or custom auth later

## 🐛 Known Issues & Future Enhancements

### Future Enhancements

- [ ] Search functionality with full-text search
- [ ] Pagination for blog listing
- [ ] Image upload with cloud storage (Cloudinary/S3)
- [ ] SEO optimization with Next.js metadata API
- [ ] Dark mode toggle
- [ ] Post tags in addition to categories
- [ ] Comments system
- [ ] User authentication and multi-author support
- [ ] Analytics dashboard
- [ ] RSS feed generation

## 📊 Time Spent

**Total Time:** ~14 hours

- **Day 1-2 (6 hours):** Project setup, database schema, tRPC configuration
- **Day 3-4 (5 hours):** Core features - blog listing, post view, CRUD operations
- **Day 5-6 (3 hours):** Dashboard, category management, markdown editor
- **Polish:** UI refinement, error handling, documentation

## 📄 License

This project was created as part of a technical assessment.

## 🙏 Acknowledgments

- Next.js team for an amazing framework
- tRPC for revolutionizing API development
- shadcn for the beautiful UI components
- Drizzle ORM for the excellent database toolkit

---

**Built with ❤️ using modern web technologies**
