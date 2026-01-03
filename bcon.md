# BCON 2.0 Build & Project Guide

Authoritative notes for building and running the project, plus the high-level structure.

## Overview
- **Framework**: Next.js 15.0.0 (App Router)
- **Language**: TypeScript
- **Runtime**: React 19.2.0, React DOM 19.2.0
- **Database/Auth**: Supabase (with @supabase/ssr for Next.js integration)
- **Effects/animation**: GSAP, @gsap/react, motion, three, ogl
- **Testing**: React Testing Library, Jest DOM
- **Entry point**: `app/layout.tsx` → `app/page.tsx`

## Prerequisites
- Node.js 18+ (recommended) and npm 9+
- npm installed (Yarn not configured)
- Supabase project with environment variables configured

## Environment Variables
Required environment variables (set in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

## Install
```bash
npm install
```

## Run (development)
```bash
npm run dev
```
- Runs Next.js development server
- Serves at http://localhost:3000
- Hot reload enabled
- TypeScript checking enabled

## Build (production)
```bash
npm run build
```
- Outputs optimized production build
- Next.js handles all optimization automatically

## Start (production server)
```bash
npm start
```
- Starts production server (run after `npm run build`)
- Serves the production build

## Test
```bash
npm test
```
- Interactive watch mode (if configured)

## Lint
```bash
npm run lint
```
- Runs ESLint on the codebase

## Scripts (from package.json)
- `dev` – Next.js development server
- `build` – production build
- `start` – production server (requires build first)
- `lint` – ESLint

## Project structure (key paths)
```
app/                    Next.js App Router
  admin/               Admin panel routes
    login/             Admin login page (/admin/login)
    page.tsx           Admin dashboard (/admin)
  api/                 API routes
    portfolio/         Portfolio CRUD API
    upload/            File upload API
  services/            Services page
  work/                Work/portfolio page
  layout.tsx           Root layout
  page.tsx             Home page
  globals.css          Global styles
components/            Reusable UI components
  admin/
    ProtectedRoute.tsx Admin route protection
  StaggeredMenu/       Navigation menu component
effects/               Visual effects
  LiquidEther/
  Loader/
  GradualBlur/
sections/              Page sections
  ShowReel/
  ServicesGrid/
  LiquidBentoPortfolio/
  ContactSection/
  RotatingText/
  ScrollReveal/
  ServicesDetail/
  ShowcaseSection/
  ShowcaseCard/
  WorkShowcase/
lib/
  supabase/
    client.ts          Supabase client (client-side)
    server.ts          Supabase client (server-side)
public/                Static assets
  portfolio/           Portfolio media files
  assets/images/       Images and logos
```

## Admin Access
- **Login URL**: `/admin/login`
- **Dashboard URL**: `/admin` (protected route)
- **Authentication**: Supabase Auth
- The admin dashboard is protected by `ProtectedRoute` component
- Users must log in with valid Supabase credentials
- After login, redirects to `/admin` dashboard
- Logout button available in admin dashboard header

## Build truths / operational notes
- This is a **Next.js 15** project using the **App Router** (not Create React App)
- Uses TypeScript for type safety
- Environment variables must be prefixed with `NEXT_PUBLIC_` to be available on the client
- Static assets in `public/` are served from the root path
- App Router uses file-based routing in the `app/` directory
- Supabase integration uses `@supabase/ssr` for proper Next.js SSR support
- React version: 19.2.0 (latest)
- Webpack configuration includes fallbacks for Three.js and GLSL shader support
- Image optimization configured for Supabase storage and Vimeo

## API Routes
- `/api/portfolio` - GET (list), POST (create)
- `/api/portfolio/[id]` - GET, PUT, DELETE (individual items)
- `/api/upload` - File upload endpoint

## Deployment
- Build with `npm run build`
- Next.js outputs to `.next/` directory
- Deploy to Vercel (recommended) or any Node.js hosting
- Ensure environment variables are set in deployment platform
- See `vercel.json` for deployment configuration

## Troubleshooting
- Ensure Node.js 18+ and npm 9+ are installed
- Set all required environment variables in `.env.local`
- For Windows PowerShell, use commands exactly as shown
- If Supabase connection fails, verify environment variables
- Admin access requires valid Supabase user account
- After dependency changes, re-run `npm install`
