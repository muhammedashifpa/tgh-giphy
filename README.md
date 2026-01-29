# 🎬 Giphy Explorer

A modern, high-performance GIF search and discovery application built with Next.js 16, React 19, and the Giphy API. Features infinite scroll, real-time search, shareable GIF links, and a beautiful masonry grid layout.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🔥 **Trending GIFs** - Browse the latest trending GIFs from Giphy
- 🔍 **Real-time Search** - Search millions of GIFs with instant results
- 🏷️ **Quick Tags** - Pre-defined category tags for quick browsing
- ♾️ **Infinite Scroll** - Seamless pagination with automatic loading
- 🎨 **Masonry Layout** - Beautiful responsive 4-column grid
- 🔗 **Shareable Links** - Share specific GIFs via URL parameters
- 🖼️ **Progressive Image Loading** - Low-res preview → High-res transition
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Performance Optimized** - React.memo, ISR, and efficient rendering
- 🌙 **Dark Mode** - Sleek dark theme with glassmorphism effects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm/yarn
- Giphy API Key ([Get one here](https://developers.giphy.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tgh-giphy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GIPHY_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
tgh-giphy/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── gifs/                 # GIF endpoints
│   │       ├── route.ts          # GET /api/gifs (search/trending)
│   │       └── [id]/route.ts     # GET /api/gifs/:id
│   ├── layout.tsx                # Root layout with metadata
│   ├── loading.tsx               # Loading UI (skeleton screens)
│   ├── page.tsx                  # Home page (SSR)
│   └── globals.css               # Global styles
│
├── components/                   # React Components
│   ├── GifGrid.client.tsx        # Main grid with infinite scroll
│   ├── GifModal.client.tsx       # Modal for viewing GIFs
│   ├── SearchBar.client.tsx      # Search input + tags
│   └── ui/                       # Reusable UI components
│       ├── Loader.client.tsx     # Loading spinner
│       ├── Modal.client.tsx      # Base modal component
│       ├── SearchInput.client.tsx # Search input field
│       ├── Skeleton.tsx          # Skeleton loaders
│       └── Tag.client.tsx        # Tag button component
│
├── lib/                          # Utilities
│   ├── giphy.ts                  # Giphy API client
│   └── gifUtils.ts               # GIF data normalization
│
├── services/                     # Business Logic
│   └── giphyService.ts           # Giphy API service layer
│
├── types/                        # TypeScript Types
│   └── gif.ts                    # GIF type definitions
│
└── public/                       # Static assets
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **API**: Giphy JS Fetch API
- **Package Manager**: pnpm

### Key Patterns

#### 1. **Server-Side Rendering (SSR)**
- Initial page load fetches 20 GIFs on the server
- Incremental Static Regeneration (ISR) with 30-minute revalidation
- Faster initial load and better SEO

#### 2. **Client-Side Pagination**
- Infinite scroll using Intersection Observer API
- Loads 20 more GIFs when user scrolls near bottom
- Prevents duplicate requests with ref-based locking

#### 3. **Performance Optimization**
- `React.memo` on all presentational components
- Progressive image loading (low-res → high-res)
- Optimized re-renders with `useCallback` and `useMemo`

#### 4. **URL State Management**
- Search queries stored in URL (`?q=cats`)
- Selected GIF stored in URL (`?gif=abc123`)
- Enables sharing and deep linking

## 🔧 API Reference

### Giphy Service

Located in `services/giphyService.ts`

#### `getTrendingGifs(limit, offset)`
Fetches trending GIFs from Giphy.

**Parameters:**
- `limit` (number): Number of GIFs to fetch (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Returns:** `Promise<IGif[]>`

**Example:**
```typescript
const gifs = await giphyService.getTrendingGifs(20, 0);
```

#### `searchGifs(query, limit, offset)`
Searches for GIFs matching a query.

**Parameters:**
- `query` (string): Search term
- `limit` (number): Number of GIFs to fetch (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Returns:** `Promise<IGif[]>`

**Example:**
```typescript
const gifs = await giphyService.searchGifs('cats', 20, 0);
```

#### `getGifById(id)`
Fetches a single GIF by ID.

**Parameters:**
- `id` (string): Giphy GIF ID

**Returns:** `Promise<IGif>`

**Example:**
```typescript
const gif = await giphyService.getGifById('abc123');
```

### API Routes

#### `GET /api/gifs`
Fetches trending or search results.

**Query Parameters:**
- `q` (optional): Search query
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```bash
# Trending
curl http://localhost:3000/api/gifs

# Search
curl http://localhost:3000/api/gifs?q=cats&offset=20
```

#### `GET /api/gifs/:id`
Fetches a single GIF by ID.

**Example:**
```bash
curl http://localhost:3000/api/gifs/abc123
```

## 🎨 Component Guide

### GifGrid.client.tsx
Main grid component with infinite scroll.

**Props:**
- `initialGifs`: Initial GIF data from server
- `query`: Current search query (optional)

**Features:**
- Masonry layout (4 columns on desktop, 2 on mobile)
- Infinite scroll with Intersection Observer
- URL-based modal state management

### GifModal.client.tsx
Modal for viewing GIFs in detail.

**Props:**
- `gif`: GIF object to display
- `isLoading`: Loading state
- `onClose`: Close handler

**Features:**
- Progressive image loading
- Copy link functionality
- Portal-based rendering

### SearchBar.client.tsx
Search input with quick tag filters.

**Features:**
- Real-time search
- Pre-defined category tags
- URL synchronization

### UI Components

All UI components are memoized with `React.memo` for optimal performance:

- **Loader**: Spinning loader with optional text
- **Modal**: Base modal with backdrop and animations
- **SearchInput**: Styled search input with icon
- **Skeleton**: Loading skeleton components
- **Tag**: Interactive tag buttons

## 🧪 Testing the Loading State

To test the `loading.tsx` skeleton UI:

### Method 1: Network Throttling (Recommended)
1. Open DevTools (F12)
2. Go to **Network** tab
3. Select **Slow 3G** or **Fast 3G**
4. Refresh the page
5. Observe skeleton UI before content loads

### Method 2: Artificial Delay
Add this to `app/page.tsx` after line 17:
```typescript
await new Promise(resolve => setTimeout(resolve, 3000));
```
**Remember to remove after testing!**

## 🎯 Performance Optimizations

### 1. React.memo
All presentational components are wrapped with `React.memo`:
- `Tag` - Prevents re-renders of 12 tag buttons
- `SearchInput` - Only re-renders when props change
- `Loader` - Memoized loading spinner
- `GifModal` - Heavy component with images

### 2. Image Optimization
- Next.js Image component for automatic optimization
- Progressive loading (low-res → high-res)
- Lazy loading with `loading="lazy"`

### 3. Infinite Scroll
- Intersection Observer API (no scroll listeners)
- 200px rootMargin for preloading
- Request deduplication with refs

### 4. ISR (Incremental Static Regeneration)
- 30-minute revalidation (`revalidate = 1800`)
- Cached pages served instantly
- Background regeneration

## 🔗 URL Patterns

### Search
```
/?q=cats
```
Displays search results for "cats"

### GIF Modal
```
/?gif=abc123
```
Opens modal with GIF ID "abc123"

### Combined
```
/?q=cats&gif=abc123
```
Search results for "cats" with modal open

## 🛠️ Available Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## 📦 Dependencies

### Core
- `next@16.1.6` - React framework
- `react@19.2.3` - UI library
- `react-dom@19.2.3` - React DOM renderer
- `@giphy/js-fetch-api@5.7.0` - Giphy API client

### Development
- `typescript@5` - Type safety
- `tailwindcss@4` - Utility-first CSS
- `eslint@9` - Code linting
- `@giphy/js-types@5.1.0` - Giphy type definitions

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GIPHY_API_KEY` | Your Giphy API key | Yes |

Get your API key at [Giphy Developers](https://developers.giphy.com/)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `GIPHY_API_KEY` environment variable
4. Deploy!

### Other Platforms

Build the production bundle:
```bash
pnpm build
pnpm start
```

Ensure environment variables are set in your hosting platform.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Giphy](https://giphy.com) for the amazing GIF API
- [Next.js](https://nextjs.org) team for the incredible framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Giphy API**
