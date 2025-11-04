# Pagination & Query Reference

## Overview

The backend now supports advanced querying with pagination, search, and filtering.

## Pagination System

### Basic Pagination
```typescript
// Get first 20 posts
const result = await trpc.post.getAll.query({
  limit: 20,
  offset: 0
});

// Returns
{
  posts: Post[],  // Array of 20 posts
  total: 156      // Total available posts
}
```

### Pagination Limits
- **min**: 1 item
- **default**: 20 items
- **max**: 100 items

### Calculate Total Pages
```typescript
const totalPages = Math.ceil(result.total / limit);
// If total = 156, limit = 20
// totalPages = Math.ceil(156 / 20) = 8 pages
```

## Filtering & Search

### Search by Title
```typescript
const result = await trpc.post.getAll.query({
  search: "typescript"  // Case-insensitive search
});
// Returns posts with "typescript" in title
```

### Filter by Published Status
```typescript
const published = await trpc.post.getAll.query({
  published: true
});

const drafts = await trpc.post.getAll.query({
  published: false
});
```

### Filter by Category
```typescript
const categoryPosts = await trpc.post.getAll.query({
  categoryId: 3
});
// Returns posts associated with category ID 3
```

### Combine Filters
```typescript
const result = await trpc.post.getAll.query({
  search: "react",
  categoryId: 2,
  published: true,
  limit: 10,
  offset: 0
});
// Returns published React posts from category 2, first 10 items
```

## Common Query Patterns

### Get Published Posts (Blog Display)
```typescript
const { data } = trpc.post.getAll.useQuery({
  published: true,
  limit: 10,
  offset: 0
});
```

### Get All Drafts (Dashboard)
```typescript
const { data } = trpc.post.getAll.useQuery({
  published: false,
  limit: 20,
  offset: 0
});
```

### Search for Post
```typescript
const { data } = trpc.post.getAll.useQuery({
  search: userInput,
  limit: 20
});
```

### Get Category Posts
```typescript
// Option 1: Using getAll with filter
const { data } = trpc.post.getAll.useQuery({
  categoryId: 1,
  limit: 20
});

// Option 2: Using dedicated procedure
const { data } = trpc.post.getByCategoryId.useQuery({
  categoryId: 1,
  limit: 20
});
```

## Frontend Integration

### React Hook Pattern
```typescript
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export function PostList() {
  const [page, setPage] = useState(0);
  const limit = 20;
  
  const { data: result, isLoading } = trpc.post.getAll.useQuery({
    limit,
    offset: page * limit,
    published: true
  });

  const totalPages = Math.ceil((result?.total || 0) / limit);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {result?.posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      
      <div className="pagination">
        <button 
          onClick={() => setPage(p => p - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        
        <span>Page {page + 1} of {totalPages}</span>
        
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Infinite Scroll Pattern
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';

export function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading
  } = trpc.post.getAll.useInfiniteQuery(
    { limit: 20, published: true },
    {
      getNextPageParam: (lastPage) => {
        // If we got fewer items than limit, no more pages
        if (lastPage.posts.length < 20) return undefined;
        return lastPage.nextOffset;
      }
    }
  );

  return (
    <div>
      {data?.pages.map((page) =>
        page.posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      )}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          Load More
        </button>
      )}
    </div>
  );
}
```

## Database Query Performance

### Queries that are Optimized
✅ `getAll` with pagination - uses limit/offset
✅ `getAll` with search - uses ilike on indexed column
✅ `getAll` with category filter - uses indexed foreign key
✅ `getByCategoryId` - direct junction table query
✅ `getBySlug` - uses indexed slug column
✅ `getById` - uses indexed primary key

### Slow Queries to Avoid
❌ Getting all posts without pagination (may return thousands)
❌ Complex multi-filter queries without indexes
❌ Searching content field (not indexed, use title instead)
❌ Loading posts with all related data N+1 style

## Error Handling

### Expected Error Codes

```typescript
try {
  const post = await trpc.post.getById.query({ id: 9999 });
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.log('Post not found');
  }
}
```

### Invalid Pagination Parameters
```typescript
// These will throw BAD_REQUEST error:
await trpc.post.getAll.query({ limit: 0 });      // < 1
await trpc.post.getAll.query({ limit: 1000 });   // > 100
await trpc.post.getAll.query({ offset: -5 });    // < 0
```

## Performance Tips

### 1. Always Use Pagination
```typescript
// ❌ Don't do this
const allPosts = await trpc.post.getAll.query({});

// ✅ Do this
const posts = await trpc.post.getAll.query({ 
  limit: 20, 
  offset: 0 
});
```

### 2. Filter Before Searching
```typescript
// ❌ Search all 1000 posts
const results = await trpc.post.getAll.query({ 
  search: "react" 
});

// ✅ Filter to published, then search
const results = await trpc.post.getAll.query({ 
  published: true,
  search: "react"
});
```

### 3. Use Specific Procedures
```typescript
// ❌ Using getAll with categoryId filter
const posts = await trpc.post.getAll.query({ 
  categoryId: 1,
  limit: 20
});

// ✅ Using dedicated procedure
const posts = await trpc.post.getByCategoryId.query({ 
  categoryId: 1,
  limit: 20
});
```

### 4. Limit Results
```typescript
// ❌ User might request huge page
const limit = userInput.limit; // Could be 10000

// ✅ Cap the limit
const limit = Math.min(userInput.limit || 20, 100);
```

## Monitoring & Debugging

### Check Slow Queries
Monitor console output for slow query warnings:
```
[SLOW QUERY] query post.getAll took 1500ms
[SLOW QUERY] mutation post.create took 2000ms
```

If you see these:
1. Check pagination is being used
2. Add database indexes
3. Review filter complexity
4. Check for N+1 queries

### Example: Slow Query Investigation
```typescript
// If you see: [SLOW QUERY] query post.getAll took 3000ms
// Likely cause: Missing index on search field
// Solution: Check database has index on posts.title

// If you see: [SLOW QUERY] mutation post.create took 5000ms
// Likely cause: Duplicate slug check scanning all posts
// Solution: Ensure index on posts.slug
```

## Testing Queries

### Using tRPC Client
```typescript
import { trpc } from '@/lib/trpc';

// In a page or component
export function TestPage() {
  const { data, isLoading, error } = trpc.post.getAll.useQuery({
    limit: 5,
    offset: 0,
    published: true
  });

  return (
    <pre>{JSON.stringify({ data, isLoading, error }, null, 2)}</pre>
  );
}
```

### Using API Route Directly
```bash
# Get all published posts (first 10)
curl 'http://localhost:3000/api/trpc/post.getAll?input={"published":true,"limit":10}'

# Search for "react"
curl 'http://localhost:3000/api/trpc/post.getAll?input={"search":"react"}'

# Get posts in category 1
curl 'http://localhost:3000/api/trpc/post.getAll?input={"categoryId":1}'
```

---

**Last Updated**: Backend Enhancements
**Version**: 1.0
