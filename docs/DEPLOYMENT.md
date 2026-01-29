# Deployment Guide

Complete guide for deploying Giphy Explorer to various platforms.

## Table of Contents

- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Production Checklist](#production-checklist)
- [Monitoring](#monitoring)

---

## Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/tgh-giphy)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add GIPHY_API_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### GitHub Integration

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure settings
   - Add environment variables
   - Deploy!

3. **Automatic Deployments**
   - Every push to `main` → Production
   - Every PR → Preview deployment

---

## Netlify Deployment

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/tgh-giphy)

### Manual Deployment

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build the Project**
   ```bash
   pnpm build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Configuration

Create `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

---

## Docker Deployment

### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GIPHY_API_KEY=${GIPHY_API_KEY}
    restart: unless-stopped
```

### Build and Run

```bash
# Build image
docker build -t giphy-explorer .

# Run container
docker run -p 3000:3000 -e GIPHY_API_KEY=your_key giphy-explorer

# Or use docker-compose
docker-compose up -d
```

---

## Environment Variables

### Required Variables

```env
GIPHY_API_KEY=your_giphy_api_key_here
```

### Optional Variables

```env
# Node environment
NODE_ENV=production

# Next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# Custom domain (if applicable)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Setting Variables

**Vercel**:
```bash
vercel env add GIPHY_API_KEY
```

**Netlify**:
```bash
netlify env:set GIPHY_API_KEY your_key
```

**Docker**:
```bash
docker run -e GIPHY_API_KEY=your_key ...
```

---

## Production Checklist

### Before Deployment

- [ ] Test build locally
  ```bash
  pnpm build
  pnpm start
  ```

- [ ] Check for TypeScript errors
  ```bash
  pnpm tsc --noEmit
  ```

- [ ] Run linter
  ```bash
  pnpm lint
  ```

- [ ] Test on different devices
  - [ ] Desktop (Chrome, Firefox, Safari)
  - [ ] Mobile (iOS Safari, Chrome)
  - [ ] Tablet

- [ ] Verify environment variables
  - [ ] GIPHY_API_KEY is set
  - [ ] No hardcoded secrets

- [ ] Check bundle size
  ```bash
  pnpm build
  # Check .next/analyze output
  ```

### After Deployment

- [ ] Verify site is live
- [ ] Test all features
  - [ ] Search functionality
  - [ ] Infinite scroll
  - [ ] Modal opening/closing
  - [ ] Tag filtering
  - [ ] Share links
- [ ] Check performance
  - [ ] Lighthouse score
  - [ ] Core Web Vitals
- [ ] Monitor errors
  - [ ] Check logs
  - [ ] Set up error tracking

---

## Performance Optimization

### Next.js Config

Update `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['media.giphy.com'],
    formats: ['image/webp'],
  },
  
  // Compression
  compress: true,
  
  // Production source maps (optional)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
```

### Bundle Analysis

1. **Install analyzer**
   ```bash
   pnpm add -D @next/bundle-analyzer
   ```

2. **Update config**
   ```typescript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });

   module.exports = withBundleAnalyzer(nextConfig);
   ```

3. **Analyze**
   ```bash
   ANALYZE=true pnpm build
   ```

---

## Monitoring

### Error Tracking

**Sentry Integration**:

1. **Install Sentry**
   ```bash
   pnpm add @sentry/nextjs
   ```

2. **Initialize**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure**
   ```typescript
   // sentry.client.config.ts
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 1.0,
   });
   ```

### Analytics

**Vercel Analytics**:

1. **Install**
   ```bash
   pnpm add @vercel/analytics
   ```

2. **Add to layout**
   ```typescript
   import { Analytics } from '@vercel/analytics/react';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### Performance Monitoring

**Web Vitals**:

```typescript
// app/layout.tsx
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics
}
```

---

## Custom Domain

### Vercel

1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records
5. Wait for verification

### Netlify

1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Configure DNS
5. Enable HTTPS

---

## SSL/HTTPS

Both Vercel and Netlify provide automatic HTTPS with Let's Encrypt certificates.

**Manual SSL** (for custom deployments):
1. Obtain SSL certificate
2. Configure web server
3. Redirect HTTP to HTTPS

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        run: npm i -g pnpm
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm build
        env:
          GIPHY_API_KEY: ${{ secrets.GIPHY_API_KEY }}
          
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Rollback Strategy

### Vercel

1. Go to deployments
2. Find previous deployment
3. Click "Promote to Production"

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

---

## Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors
**Solution**: Run `pnpm tsc --noEmit` locally and fix errors

**Issue**: Out of memory during build
**Solution**: Increase Node memory
```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

### Runtime Errors

**Issue**: API key not found
**Solution**: Verify environment variable is set correctly

**Issue**: Images not loading
**Solution**: Add domain to `next.config.ts` images.domains

---

## Scaling

### Horizontal Scaling

- Vercel/Netlify handle this automatically
- For custom deployments, use load balancer

### Caching

- Enable ISR (already configured)
- Use CDN for static assets
- Implement service worker

### Database (if added)

- Use connection pooling
- Implement read replicas
- Cache frequent queries

---

**For more information, see the main [README.md](../README.md)**
