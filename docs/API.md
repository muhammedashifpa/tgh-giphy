# API Documentation

Complete API reference for the Giphy Explorer application.

## Table of Contents

- [REST API Endpoints](#rest-api-endpoints)
  - [GET /api/gifs](#get-apigifs)
  - [GET /api/gifs/:id](#get-apigifsid)
- [Service Layer](#service-layer)
  - [giphyService](#giphyservice)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)

---

## REST API Endpoints

### GET /api/gifs

Fetches trending GIFs or search results based on query parameters.

**Endpoint**: `/api/gifs`

**Method**: `GET`

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | No | - | Search query term |
| `offset` | number | No | 0 | Pagination offset |

**Response**:

```typescript
// Success (200 OK)
Gif[]

// Error (500 Internal Server Error)
{
  error: string
}
```

**Examples**:

```bash
# Fetch trending GIFs
curl http://localhost:3000/api/gifs

# Search for cats
curl http://localhost:3000/api/gifs?q=cats

# Paginated search
curl http://localhost:3000/api/gifs?q=cats&offset=20
```

**Response Example**:
```json
[
  {
    "id": "3o7TKSjRrfIPjeiVyM",
    "url": "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/200.gif",
    "highResUrl": "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
    "title": "Happy Cat GIF",
    "user": {
      "name": "Giphy Studios",
      "avatar": "https://media.giphy.com/avatars/default.gif"
    }
  }
]
```

**Implementation**:
```typescript
// app/api/gifs/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const data = query 
      ? await giphyService.searchGifs(query, 20, offset)
      : await giphyService.getTrendingGifs(20, offset);
    
    const normalizedGifs = normalizeGifs(data);
    return Response.json(normalizedGifs);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch gifs" },
      { status: 500 }
    );
  }
}
```

---

### GET /api/gifs/:id

Fetches a single GIF by its ID.

**Endpoint**: `/api/gifs/:id`

**Method**: `GET`

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Giphy GIF ID |

**Response**:

```typescript
// Success (200 OK)
Gif

// Error (500 Internal Server Error)
{
  error: string
}
```

**Examples**:

```bash
# Fetch specific GIF
curl http://localhost:3000/api/gifs/3o7TKSjRrfIPjeiVyM
```

**Response Example**:
```json
{
  "id": "3o7TKSjRrfIPjeiVyM",
  "url": "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/200.gif",
  "highResUrl": "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
  "title": "Happy Cat GIF",
  "user": {
    "name": "Giphy Studios",
    "avatar": "https://media.giphy.com/avatars/default.gif"
  }
}
```

**Implementation**:
```typescript
// app/api/gifs/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const data = await giphyService.getGifById(id);
    const normalizedGif = normalizeGif(data);
    return Response.json(normalizedGif);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch gif" },
      { status: 500 }
    );
  }
}
```

---

## Service Layer

### giphyService

Service layer for interacting with the Giphy API.

**Location**: `services/giphyService.ts`

#### getTrendingGifs()

Fetches trending GIFs from Giphy.

**Signature**:
```typescript
getTrendingGifs(limit?: number, offset?: number): Promise<IGif[]>
```

**Parameters**:
- `limit` (optional): Number of GIFs to fetch (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Returns**: Promise resolving to array of Giphy GIF objects

**Example**:
```typescript
const gifs = await giphyService.getTrendingGifs(20, 0);
```

**Error Handling**:
```typescript
try {
  const gifs = await giphyService.getTrendingGifs();
} catch (error) {
  console.error("Failed to fetch trending gifs:", error);
}
```

---

#### searchGifs()

Searches for GIFs matching a query.

**Signature**:
```typescript
searchGifs(query: string, limit?: number, offset?: number): Promise<IGif[]>
```

**Parameters**:
- `query`: Search term (required)
- `limit` (optional): Number of GIFs to fetch (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Returns**: Promise resolving to array of Giphy GIF objects

**Example**:
```typescript
const gifs = await giphyService.searchGifs("cats", 20, 0);
```

**Error Handling**:
```typescript
try {
  const gifs = await giphyService.searchGifs("cats");
} catch (error) {
  console.error("Failed to search gifs:", error);
}
```

---

#### getGifById()

Fetches a single GIF by its ID.

**Signature**:
```typescript
getGifById(id: string): Promise<IGif>
```

**Parameters**:
- `id`: Giphy GIF ID (required)

**Returns**: Promise resolving to a single Giphy GIF object

**Example**:
```typescript
const gif = await giphyService.getGifById("3o7TKSjRrfIPjeiVyM");
```

**Error Handling**:
```typescript
try {
  const gif = await giphyService.getGifById("abc123");
} catch (error) {
  console.error("Failed to fetch gif:", error);
}
```

---

## Type Definitions

### Gif

Normalized GIF type used throughout the application.

```typescript
interface Gif {
  id: string;           // Unique GIF identifier
  url: string;          // Low-res GIF URL (for grid)
  highResUrl: string;   // High-res GIF URL (for modal)
  title: string;        // GIF title
  user: {
    name: string;       // Creator name
    avatar?: string;    // Creator avatar URL (optional)
  };
}
```

---

### GiphyGif

Raw GIF type from Giphy API.

```typescript
interface GiphyGif {
  id: string;
  title: string;
  username: string;
  images: {
    fixed_width: {
      url: string;      // Used for grid display
    };
    original: {
      url: string;      // Used for modal display
    };
  };
  user?: GiphyUser;
}
```

---

### GiphyUser

User information from Giphy API.

```typescript
interface GiphyUser {
  display_name?: string;  // User's display name
  username?: string;      // User's username
  avatar_url?: string;    // User's avatar URL
}
```

---

## Data Normalization

The `normalizeGifs()` utility converts Giphy API responses to our internal `Gif` type.

**Location**: `lib/gifUtils.ts`

**Function**:
```typescript
export function normalizeGifs(giphyGifs: IGif[]): Gif[] {
  return giphyGifs.map(normalizeGif);
}

export function normalizeGif(gif: IGif): Gif {
  return {
    id: gif.id,
    url: gif.images.fixed_width.url,
    highResUrl: gif.images.original.url,
    title: gif.title || "Untitled",
    user: {
      name: gif.user?.display_name || 
            gif.user?.username || 
            gif.username || 
            "Unknown",
      avatar: gif.user?.avatar_url,
    },
  };
}
```

**Why Normalize?**
- Simplifies component props
- Provides consistent data structure
- Handles missing fields gracefully
- Easier to test and maintain

---

## Error Handling

### API Route Errors

All API routes follow this error handling pattern:

```typescript
try {
  // API call
  const data = await giphyService.getTrendingGifs();
  return Response.json(data);
} catch (error) {
  console.error("Error:", error);
  return Response.json(
    { error: "Failed to fetch gifs" },
    { status: 500 }
  );
}
```

### Service Layer Errors

Service methods log errors and re-throw:

```typescript
try {
  const result = await gf.trending({ limit, offset });
  return result.data;
} catch (error) {
  console.error("Error fetching trending gifs:", error);
  throw error; // Re-throw for caller to handle
}
```

### Client-Side Error Handling

Components handle errors gracefully:

```typescript
try {
  const res = await fetch(`/api/gifs/${id}`);
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  const gif = await res.json();
  setSelectedGif(gif);
} catch (error) {
  console.error("Failed to fetch gif:", error);
  // Show error UI or fallback
}
```

---

## Rate Limiting

Giphy API has rate limits:

- **Free Tier**: 42 requests per hour, 1000 requests per day
- **Production**: Requires API key upgrade

**Best Practices**:
1. Cache responses with ISR
2. Implement request deduplication
3. Use pagination efficiently
4. Monitor API usage

---

## Caching Strategy

### ISR (Incremental Static Regeneration)

Pages are cached and revalidated:

```typescript
// app/page.tsx
export const revalidate = 1800; // 30 minutes
```

**Benefits**:
- Faster page loads
- Reduced API calls
- Better user experience

### Client-Side Caching

Browser caches API responses:
- Next.js automatic fetch caching
- Browser HTTP cache headers
- Service worker (if implemented)

---

## Testing APIs

### Manual Testing

```bash
# Test trending endpoint
curl http://localhost:3000/api/gifs

# Test search endpoint
curl http://localhost:3000/api/gifs?q=cats&offset=0

# Test single GIF endpoint
curl http://localhost:3000/api/gifs/3o7TKSjRrfIPjeiVyM
```

### Automated Testing

```typescript
// Example test
import { GET } from '@/app/api/gifs/route';

describe('GET /api/gifs', () => {
  it('returns trending gifs', async () => {
    const request = new Request('http://localhost:3000/api/gifs');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
```

---

## Environment Configuration

### Required Variables

```env
GIPHY_API_KEY=your_api_key_here
```

### API Client Setup

```typescript
// lib/giphy.ts
import { GiphyFetch } from "@giphy/js-fetch-api";

const apiKey = process.env.GIPHY_API_KEY || "";

if (!apiKey) {
  console.warn("Giphy API Key is missing");
}

export const gf = new GiphyFetch(apiKey);
```

---

## API Versioning

Current API version: **v1** (implicit)

Future versions should:
1. Use versioned routes (`/api/v2/gifs`)
2. Maintain backward compatibility
3. Document breaking changes
4. Provide migration guides

---

**For more information, see the main [README.md](../README.md)**
