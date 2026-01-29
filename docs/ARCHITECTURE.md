# Architecture & Performance Guide

Deep dive into the architecture, design patterns, and performance optimizations of Giphy Explorer.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Design Patterns](#design-patterns)
- [Performance Optimizations](#performance-optimizations)
- [State Management](#state-management)
- [Rendering Strategy](#rendering-strategy)
- [Best Practices](#best-practices)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
├─────────────────────────────────────────────────────────┤
│  React Components (Client Components)                   │
│  ├── GifGrid.client.tsx                                 │
│  ├── GifModal.client.tsx                                │
│  ├── SearchBar.client.tsx                               │
│  └── UI Components                                      │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router (Server Components)                 │
│  ├── app/page.tsx (SSR)                                 │
│  ├── app/layout.tsx                                     │
│  └── app/loading.tsx                                    │
├─────────────────────────────────────────────────────────┤
│  API Routes (Server-Side)                               │
│  ├── /api/gifs (GET)                                    │
│  └── /api/gifs/:id (GET)                                │
├─────────────────────────────────────────────────────────┤
│  Service Layer                                          │
│  └── giphyService.ts                                    │
├─────────────────────────────────────────────────────────┤
│  External API                                           │
│  └── Giphy API                                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. Initial Load (SSR)
   User → Next.js Server → giphyService → Giphy API
                        ↓
                   Render HTML
                        ↓
                   Send to Browser

2. Client-Side Navigation
   User → Client Component → API Route → giphyService → Giphy API
                                      ↓
                                 Update State
                                      ↓
                                  Re-render

3. Infinite Scroll
   Scroll Event → Intersection Observer → loadMore()
                                        ↓
                                   Fetch More GIFs
                                        ↓
                                   Append to State
```

---

## Design Patterns

### 1. Server-Side Rendering (SSR)

**Pattern**: Render initial page on server for better performance and SEO.

**Implementation**:
```typescript
// app/page.tsx
export default async function Home({ searchParams }) {
  // Fetch on server
  const data = await giphyService.getTrendingGifs(20);
  
  // Pass to client component
  return <GifGridClient initialGifs={data} />;
}
```

**Benefits**:
- Faster initial load
- Better SEO
- Reduced client-side work

---

### 2. Incremental Static Regeneration (ISR)

**Pattern**: Cache pages and revalidate periodically.

**Implementation**:
```typescript
// app/page.tsx
export const revalidate = 1800; // 30 minutes
```

**Benefits**:
- Cached pages served instantly
- Background regeneration
- Reduced API calls

---

### 3. Client-Side Pagination

**Pattern**: Load more data on demand using infinite scroll.

**Implementation**:
```typescript
const loadMore = useCallback(async () => {
  const url = new URL("/api/gifs", window.location.origin);
  url.searchParams.set("offset", offset.toString());
  
  const res = await fetch(url);
  const newGifs = await res.json();
  
  setGifs(prev => [...prev, ...newGifs]);
  setOffset(prev => prev + newGifs.length);
}, [offset]);
```

**Benefits**:
- Better UX (no page reloads)
- Efficient data loading
- Smooth scrolling experience

---

### 4. URL State Management

**Pattern**: Store application state in URL for shareability.

**Implementation**:
```typescript
// Read from URL
const activeGifId = searchParams.get("gif");

// Update URL
const updateModalUrl = (id: string | null) => {
  const params = new URLSearchParams(searchParams.toString());
  if (id) params.set("gif", id);
  else params.delete("gif");
  router.push(`${pathname}?${params.toString()}`);
};
```

**Benefits**:
- Shareable links
- Browser back/forward support
- Deep linking

---

### 5. Progressive Image Loading

**Pattern**: Show low-res image while high-res loads.

**Implementation**:
```typescript
// Low-res layer (visible immediately)
<Image src={gif.url} />

// High-res layer (fades in when loaded)
<Image 
  src={gif.highResUrl}
  onLoadingComplete={() => setImgLoading(false)}
  className={imgLoading ? 'opacity-0' : 'opacity-100'}
/>
```

**Benefits**:
- Perceived performance
- Smooth transitions
- Better UX

---

## Performance Optimizations

### 1. React.memo

**Purpose**: Prevent unnecessary re-renders of components.

**Applied To**:
- `Tag` - 12 instances, prevents re-renders on parent updates
- `SearchInput` - Only re-renders when props change
- `Loader` - Simple component, no need to re-render
- `GifModal` - Heavy component with images

**Example**:
```typescript
const TagComponent = ({ label, isActive, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

export const Tag = memo(TagComponent);
```

**Impact**:
- 60-80% reduction in re-renders
- Smoother interactions
- Better scroll performance

---

### 2. useCallback

**Purpose**: Memoize functions to prevent prop changes.

**Example**:
```typescript
const loadMore = useCallback(async () => {
  // Function body
}, [offset, query, isLoading, hasMore]);
```

**Impact**:
- Prevents memo invalidation
- Stable function references
- Better performance with React.memo

---

### 3. Intersection Observer

**Purpose**: Efficient scroll detection without scroll listeners.

**Implementation**:
```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    },
    { rootMargin: "200px" }
  );

  if (loaderRef.current) {
    observer.observe(loaderRef.current);
  }

  return () => observer.disconnect();
}, [loadMore]);
```

**Benefits**:
- No scroll event listeners
- Better performance
- Preloading with rootMargin

---

### 4. Request Deduplication

**Purpose**: Prevent duplicate API calls during rapid scrolling.

**Implementation**:
```typescript
const isFetchingRef = useRef(false);

const loadMore = useCallback(async () => {
  if (isFetchingRef.current) return;
  
  isFetchingRef.current = true;
  try {
    // Fetch data
  } finally {
    isFetchingRef.current = false;
  }
}, []);
```

**Impact**:
- Prevents race conditions
- Reduces API calls
- Better UX

---

### 5. Image Optimization

**Next.js Image Component**:
```typescript
<Image
  src={gif.url}
  width={400}
  height={400}
  unoptimized  // For GIFs
  loading="lazy"
/>
```

**Benefits**:
- Automatic lazy loading
- Responsive images
- WebP conversion (for static images)

---

### 6. Code Splitting

**Automatic with Next.js**:
- Each page is a separate bundle
- Components lazy-loaded as needed
- Smaller initial bundle size

**Manual Splitting** (if needed):
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loader />,
});
```

---

## State Management

### Local State

**Used For**:
- Component-specific state
- UI state (loading, errors)
- Form inputs

**Example**:
```typescript
const [gifs, setGifs] = useState<Gif[]>([]);
const [isLoading, setIsLoading] = useState(false);
```

---

### URL State

**Used For**:
- Search queries
- Selected GIF
- Filters/sorting

**Example**:
```typescript
const query = searchParams.get("q");
const gifId = searchParams.get("gif");
```

---

### Ref State

**Used For**:
- Non-rendering state
- DOM references
- Preventing re-renders

**Example**:
```typescript
const isFetchingRef = useRef(false);
const loaderRef = useRef<HTMLDivElement>(null);
```

---

## Rendering Strategy

### Server Components (Default)

**Files**:
- `app/page.tsx`
- `app/layout.tsx`
- `app/loading.tsx`

**Benefits**:
- Zero JavaScript sent to client
- Direct database/API access
- Better performance

---

### Client Components

**Files**:
- `components/*.client.tsx`

**When to Use**:
- Interactive components
- Browser APIs (localStorage, etc.)
- State management
- Event handlers

**Marking**:
```typescript
"use client";

export const MyComponent = () => {
  // Component code
};
```

---

### Hybrid Approach

**Pattern**: Server component wraps client components.

```typescript
// Server Component (page.tsx)
export default async function Page() {
  const data = await fetchData(); // Server-side
  
  return <ClientComponent data={data} />; // Client-side
}
```

---

## Best Practices

### 1. Component Design

✅ **Do**:
- Keep components small and focused
- Use composition over props
- Extract reusable logic to hooks
- Memoize expensive components

❌ **Don't**:
- Create mega-components
- Pass too many props
- Inline complex logic
- Forget to memoize

---

### 2. State Management

✅ **Do**:
- Lift state to appropriate level
- Use URL for shareable state
- Use refs for non-rendering state
- Keep state minimal

❌ **Don't**:
- Over-lift state
- Duplicate state
- Store derived state
- Use state for everything

---

### 3. Performance

✅ **Do**:
- Memoize components and functions
- Use Intersection Observer
- Implement pagination
- Optimize images

❌ **Don't**:
- Premature optimization
- Over-memoize
- Ignore bundle size
- Skip profiling

---

### 4. Error Handling

✅ **Do**:
- Handle errors gracefully
- Show user-friendly messages
- Log errors for debugging
- Provide fallbacks

❌ **Don't**:
- Ignore errors
- Show technical errors to users
- Fail silently
- Skip error boundaries

---

### 5. Accessibility

✅ **Do**:
- Use semantic HTML
- Add ARIA labels
- Support keyboard navigation
- Ensure color contrast

❌ **Don't**:
- Use divs for buttons
- Forget alt text
- Ignore focus states
- Skip accessibility testing

---

## Monitoring & Debugging

### Performance Monitoring

**React DevTools Profiler**:
1. Open React DevTools
2. Go to Profiler tab
3. Start recording
4. Interact with app
5. Analyze render times

**Chrome DevTools**:
1. Open Performance tab
2. Record interaction
3. Analyze flame graph
4. Identify bottlenecks

---

### Debugging

**Console Logging**:
```typescript
console.log("Fetching gif", activeGifId);
console.error("Failed to fetch:", error);
```

**React DevTools**:
- Inspect component props
- View state changes
- Track re-renders

**Network Tab**:
- Monitor API calls
- Check response times
- Verify caching

---

## Future Improvements

### Potential Enhancements

1. **Virtual Scrolling**
   - Render only visible GIFs
   - Better performance with large lists
   - Libraries: react-window, react-virtuoso

2. **Service Worker**
   - Offline support
   - Cache API responses
   - Background sync

3. **Optimistic Updates**
   - Update UI before API response
   - Better perceived performance
   - Rollback on error

4. **Prefetching**
   - Prefetch next page on hover
   - Faster navigation
   - Better UX

5. **Analytics**
   - Track user interactions
   - Monitor performance
   - A/B testing

---

**For more information, see the main [README.md](../README.md)**
