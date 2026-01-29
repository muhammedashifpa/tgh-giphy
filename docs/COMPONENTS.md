# Component Documentation

This document provides detailed information about all components in the Giphy Explorer application.

## Table of Contents

- [Client Components](#client-components)
  - [GifGrid.client.tsx](#gifgridclienttsx)
  - [GifModal.client.tsx](#gifmodalclienttsx)
  - [SearchBar.client.tsx](#searchbarclienttsx)
- [UI Components](#ui-components)
  - [Loader.client.tsx](#loaderclienttsx)
  - [Modal.client.tsx](#modalclienttsx)
  - [SearchInput.client.tsx](#searchinputclienttsx)
  - [Skeleton.tsx](#skeletontsx)
  - [Tag.client.tsx](#tagclienttsx)

---

## Client Components

### GifGrid.client.tsx

**Purpose**: Main grid component that displays GIFs in a masonry layout with infinite scroll functionality.

**Props**:
```typescript
interface GifGridProps {
  initialGifs: Gif[];  // Initial GIFs from server
  query?: string;      // Current search query
}
```

**State Management**:
- `gifs`: Array of all loaded GIFs
- `offset`: Current pagination offset
- `hasMore`: Whether more GIFs are available
- `isLoading`: Loading state for pagination
- `selectedGif`: Currently selected GIF for modal
- `isDataLoading`: Loading state for fetching single GIF

**Key Features**:

1. **Masonry Layout**
   - 4 columns on desktop (`lg:grid-cols-4`)
   - 2 columns on mobile (`grid-cols-2`)
   - GIFs distributed evenly across columns

2. **Infinite Scroll**
   - Uses Intersection Observer API
   - Triggers when user scrolls within 200px of bottom
   - Prevents duplicate requests with `isFetchingRef`

3. **URL State Management**
   - Reads `?gif=id` from URL for modal state
   - Updates URL when GIF is clicked
   - Enables sharing and deep linking

4. **Performance**
   - Uses `useCallback` for `loadMore` function
   - Memoizes `updateModalUrl` function
   - Efficient re-rendering with proper dependencies

**Usage**:
```tsx
<GifGridClient 
  initialGifs={gifs} 
  query="cats" 
/>
```

---

### GifModal.client.tsx

**Purpose**: Modal component for viewing GIFs in full detail with progressive image loading.

**Props**:
```typescript
interface GifModalProps {
  gif: Gif | null;      // GIF to display
  isLoading?: boolean;  // Loading state
  onClose: () => void;  // Close handler
}
```

**State Management**:
- `imgLoading`: Tracks high-res image loading state

**Key Features**:

1. **Progressive Image Loading**
   - Shows low-res image immediately
   - Loads high-res image in background
   - Smooth fade transition when high-res loads

2. **Copy Link Functionality**
   - Copies high-res GIF URL to clipboard
   - Shows alert confirmation

3. **User Information**
   - Displays GIF creator's name and avatar
   - Falls back gracefully if user data missing

4. **Performance**
   - Wrapped with `React.memo`
   - Only re-renders when props change

**Usage**:
```tsx
<GifModal 
  gif={selectedGif} 
  isLoading={isDataLoading}
  onClose={() => setSelectedGif(null)} 
/>
```

---

### SearchBar.client.tsx

**Purpose**: Search input with pre-defined category tags for quick filtering.

**State Management**:
- `query`: Current search input value
- Syncs with URL search params

**Key Features**:

1. **Real-time Search**
   - Updates URL on form submit
   - Syncs input with URL params

2. **Quick Tags**
   - Pre-defined categories (Trending, AJP, Kerala, etc.)
   - Active state based on current query
   - One-click filtering

3. **URL Synchronization**
   - Reads from `?q=query` parameter
   - Updates URL on search/tag click
   - Enables sharing search results

**Tag Configuration**:
```typescript
const TAGS = [
  { id: "trending", label: "🔥 Trending", value: "" },
  { id: "ajp", label: "🕺🏻 AJP", value: "ajp" },
  // ... more tags
];
```

**Usage**:
```tsx
<SearchBar />
```

---

## UI Components

### Loader.client.tsx

**Purpose**: Reusable loading spinner component.

**Props**:
```typescript
interface LoaderProps {
  size?: "sm" | "md" | "lg";  // Spinner size
  text?: string;               // Optional loading text
  className?: string;          // Additional classes
}
```

**Sizes**:
- `sm`: 6x6 with 2px border
- `md`: 8x8 with 2px border (default)
- `lg`: 12x12 with 2px border

**Performance**:
- Wrapped with `React.memo`
- Only re-renders when props change

**Usage**:
```tsx
<Loader size="lg" text="Loading GIFs..." />
```

---

### Modal.client.tsx

**Purpose**: Base modal component with backdrop and animations.

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;           // Modal visibility
  onClose: () => void;       // Close handler
  children: React.ReactNode; // Modal content
  maxWidth?: string;         // Max width class
  maxHeight?: string;        // Max height class
  className?: string;        // Additional classes
}
```

**Key Features**:

1. **Portal Rendering**
   - Renders to `document.body`
   - Prevents z-index issues

2. **Body Scroll Lock**
   - Disables body scroll when open
   - Restores on close

3. **Click Outside to Close**
   - Backdrop click closes modal
   - Content click is stopped

4. **Animations**
   - Fade-in backdrop
   - Zoom-in content
   - Smooth transitions

**Usage**:
```tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <div>Modal content</div>
</Modal>
```

---

### SearchInput.client.tsx

**Purpose**: Styled search input field with icon and submit button.

**Props**:
```typescript
interface SearchInputProps {
  value: string;                      // Input value
  onChange: (value: string) => void;  // Change handler
  onSubmit: (e: FormEvent) => void;   // Submit handler
  placeholder?: string;               // Placeholder text
  className?: string;                 // Additional classes
}
```

**Key Features**:

1. **Icon Integration**
   - Search icon on left
   - Submit button on right

2. **Responsive Design**
   - Adjusts padding for mobile/desktop
   - Responsive font sizes

3. **Focus States**
   - Purple ring on focus
   - Border color transition

**Performance**:
- Wrapped with `React.memo`
- Only re-renders when props change

**Usage**:
```tsx
<SearchInput 
  value={query}
  onChange={setQuery}
  onSubmit={handleSubmit}
  placeholder="Search for GIFs..."
/>
```

---

### Skeleton.tsx

**Purpose**: Loading skeleton components for better perceived performance.

**Components**:

1. **Skeleton**
   - Base skeleton component
   - Animated pulse effect
   - Customizable via className

2. **GifSkeleton**
   - Full grid skeleton
   - Matches masonry layout
   - Varying heights for realism

**Usage**:
```tsx
// Base skeleton
<Skeleton className="w-full h-48" />

// Full grid skeleton
<GifSkeleton />
```

**Features**:
- Matches actual grid layout
- Varying heights (h-48, h-64, h-40, h-72, h-56)
- Smooth pulse animation

---

### Tag.client.tsx

**Purpose**: Interactive tag button for category filtering.

**Props**:
```typescript
interface TagProps {
  label: string;        // Tag label
  isActive: boolean;    // Active state
  onClick: () => void;  // Click handler
  className?: string;   // Additional classes
}
```

**States**:

1. **Active**
   - Purple background
   - Purple border
   - White text
   - Shadow effect
   - Lifted appearance

2. **Inactive**
   - Dark background
   - Gray border
   - Gray text
   - Hover effects

**Performance**:
- Wrapped with `React.memo`
- Prevents re-renders of all 12 tags

**Usage**:
```tsx
<Tag 
  label="🔥 Trending"
  isActive={isActive}
  onClick={handleClick}
/>
```

---

## Performance Best Practices

All UI components follow these performance patterns:

1. **React.memo**
   - All presentational components are memoized
   - Prevents unnecessary re-renders
   - Shallow prop comparison

2. **Prop Stability**
   - Functions passed as props use `useCallback`
   - Objects use `useMemo` when needed
   - Prevents memo invalidation

3. **Minimal State**
   - State lifted to appropriate level
   - Avoid prop drilling
   - Use composition over props

4. **Efficient Rendering**
   - Conditional rendering with early returns
   - Avoid inline object/array creation
   - Use keys properly in lists

---

## Styling Conventions

All components use Tailwind CSS with these patterns:

1. **Responsive Design**
   - Mobile-first approach
   - `md:` prefix for tablet/desktop
   - `lg:` prefix for large screens

2. **Dark Theme**
   - Zinc color palette
   - Purple accent colors
   - Consistent opacity values

3. **Animations**
   - Tailwind transitions
   - Hover effects
   - Focus states

4. **Spacing**
   - Consistent padding/margin
   - Gap for flex/grid
   - Responsive spacing

---

## Testing Components

### Unit Testing
```typescript
// Example test for Tag component
import { render, fireEvent } from '@testing-library/react';
import { Tag } from './Tag.client';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <Tag label="Test" isActive={false} onClick={handleClick} />
  );
  
  fireEvent.click(getByText('Test'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Visual Testing
- Use Storybook for component showcase
- Test all prop combinations
- Verify responsive behavior

---

## Accessibility

All components follow accessibility best practices:

1. **Semantic HTML**
   - Proper button elements
   - Form elements with labels
   - Heading hierarchy

2. **Keyboard Navigation**
   - Tab navigation
   - Enter/Space for buttons
   - Escape to close modals

3. **ARIA Attributes**
   - `aria-label` for icon buttons
   - `role` attributes where needed
   - Focus management

4. **Color Contrast**
   - WCAG AA compliant
   - Sufficient contrast ratios
   - Focus indicators

---

**For more information, see the main [README.md](../README.md)**
