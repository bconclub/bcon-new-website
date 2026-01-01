# BCON Club: React to Next.js 14 Migration Guide

## Overview
This guide will help you migrate your Create React App website to Next.js 14 with Supabase backend integration.

## Prerequisites
- Node.js 18+ installed
- Supabase account (create at supabase.com)
- Git repository backup
- Current React app running successfully

---

## Phase 1: Pre-Migration Preparation

### 1.1 Backup Current Codebase
```bash
# Create a backup branch
git checkout -b backup-pre-migration
git push origin backup-pre-migration

# Create a new branch for migration
git checkout -b nextjs-migration
```

### 1.2 Document Current Structure
- List all routes: `/`, `/services`, `/work`
- Note all components and their dependencies
- Document GSAP animations and Three.js scenes
- List all static assets

### 1.3 Create Supabase Project
1. Go to supabase.com and create a new project
2. Note your project URL and anon key
3. Enable Storage for image uploads
4. Set up Authentication (Email/Password)

---

## Phase 2: Next.js 14 Setup

### 2.1 Install Next.js
```bash
# In your project root
npx create-next-app@14 . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Or if you want to keep existing structure:
npm install next@14 react@18 react-dom@18
npm install -D @types/node @types/react @types/react-dom typescript
```

### 2.2 Update package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "gsap": "^3.12.2",
    "three": "^0.158.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0"
  }
}
```

### 2.3 Create Next.js Configuration
See `next.config.js` file for configuration.

### 2.4 Folder Structure Migration
```
Current (CRA):
src/
  components/
  sections/
  pages/
  effects/
  App.js
  index.js

New (Next.js 14):
app/
  (routes)/
    page.tsx          # Home page
    services/
      page.tsx         # Services page
    work/
      page.tsx         # Work page
    admin/
      page.tsx         # Admin dashboard
      login/
        page.tsx       # Admin login
  layout.tsx           # Root layout
  globals.css          # Global styles
components/
  (existing components)
lib/
  supabase/
    client.ts          # Supabase client
    server.ts          # Server-side Supabase
sections/
  (existing sections)
effects/
  (existing effects)
public/
  (static assets)
```

---

## Phase 3: Supabase Database Setup

### 3.1 Run Schema SQL
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `supabase-schema.sql`
3. Verify tables are created
4. Set up Row Level Security (RLS) policies

### 3.2 Storage Buckets
1. Go to Storage → Create Bucket
2. Name: `portfolio-images`
3. Make it public for portfolio images
4. Create bucket: `admin-uploads` (private, for admin uploads)

### 3.3 Authentication Setup
1. Go to Authentication → Settings
2. Enable Email/Password authentication
3. Configure email templates (optional)
4. Add admin user manually or via signup

---

## Phase 4: Component Migration

### 4.1 Migrate Pages to App Router
- Convert `src/pages/Home.js` → `app/page.tsx`
- Convert `src/pages/Services.js` → `app/services/page.tsx`
- Convert `src/pages/AllWork.js` → `app/work/page.tsx`

### 4.2 Preserve Components
- Keep all components in `components/` or `sections/`
- Update imports to use Next.js Image component
- Convert relative imports to use `@/` alias

### 4.3 GSAP Animations
- GSAP works the same in Next.js
- Use `useEffect` hooks for animations
- Ensure ScrollTrigger is registered properly

### 4.4 Three.js Integration
- Use `@react-three/fiber` for React Three.js
- Ensure client-side rendering with `'use client'` directive
- Handle SSR properly (check if window exists)

---

## Phase 5: Supabase Integration

### 5.1 Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5.2 Create Supabase Client
See `lib/supabase/client.ts` for client setup.

### 5.3 API Routes
- Create API routes in `app/api/portfolio/route.ts`
- Implement CRUD operations
- Add authentication middleware

---

## Phase 6: Admin Panel

### 6.1 Authentication
- Create login page at `app/admin/login/page.tsx`
- Use Supabase Auth
- Create protected route wrapper

### 6.2 Dashboard
- Portfolio list table
- Add/Edit forms
- Image upload component
- Status toggle

---

## Phase 7: Frontend Integration

### 7.1 Fetch Portfolio Data
- Create server components for data fetching
- Use Supabase client in server components
- Implement loading states

### 7.2 Dynamic Routes
- Create `app/portfolio/[slug]/page.tsx`
- Fetch individual project data
- Display case study layout

---

## Phase 8: Testing & Deployment

### 8.1 Local Testing
```bash
npm run dev
# Test all routes
# Test admin panel
# Test portfolio display
```

### 8.2 Build Test
```bash
npm run build
npm start
```

### 8.3 Vercel Deployment
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

---

## Migration Checklist

### Pre-Migration
- [ ] Backup current codebase
- [ ] Document all routes and components
- [ ] Create Supabase account and project
- [ ] List all hardcoded content to migrate

### Setup
- [ ] Install Next.js 14
- [ ] Update package.json
- [ ] Create Next.js config
- [ ] Set up folder structure

### Database
- [ ] Run Supabase schema SQL
- [ ] Create storage buckets
- [ ] Set up authentication
- [ ] Configure RLS policies

### Migration
- [ ] Migrate pages to App Router
- [ ] Update component imports
- [ ] Set up Supabase client
- [ ] Create API routes

### Admin Panel
- [ ] Create login page
- [ ] Build dashboard
- [ ] Implement CRUD operations
- [ ] Add image upload

### Frontend
- [ ] Fetch portfolio from Supabase
- [ ] Create dynamic routes
- [ ] Update portfolio display
- [ ] Test all animations

### Deployment
- [ ] Configure Vercel
- [ ] Add environment variables
- [ ] Test production build
- [ ] Deploy and verify

---

## Common Issues & Solutions

### Issue: GSAP animations not working
**Solution**: Ensure components using GSAP have `'use client'` directive

### Issue: Three.js errors in SSR
**Solution**: Check for `typeof window !== 'undefined'` before initializing

### Issue: Image optimization errors
**Solution**: Use Next.js Image component or configure domains in next.config.js

### Issue: Supabase auth not working
**Solution**: Check environment variables and ensure RLS policies are correct

---

## Next Steps

After completing this migration:
1. Test all functionality
2. Migrate existing portfolio content to Supabase
3. Set up admin users
4. Configure production environment
5. Monitor performance and optimize

