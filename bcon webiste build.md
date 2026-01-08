# BCON 2.0 Build & Project Guide

Authoritative notes for building and running the project, plus the high-level structure.

## Overview
- **Framework**: Next.js 15.0.0 (App Router)
- **Language**: TypeScript 5
- **Runtime**: React 19.2.0, React DOM 19.2.0
- **Database/Auth**: Supabase (with @supabase/ssr for Next.js integration)
- **Effects/animation**: GSAP 3.13.0, @gsap/react 2.1.2, motion 12.23.24, three 0.180.0, ogl 1.0.11
- **Testing**: React Testing Library 16.3.0, Jest DOM 6.9.1, @testing-library/user-event 13.5.0
- **UI Components**: @radix-ui/react-accordion 1.2.12
- **Utilities**: mathjs 15.0.0, web-vitals 2.1.4
- **Project Version**: 1.0.2
- **Entry point**: `app/layout.tsx` → `app/page.tsx`

## Prerequisites
- **Node.js**: 18+ (recommended: 20+)
- **npm**: 9+ (Yarn not configured)
- **Supabase**: Active project with environment variables configured
- **Git**: For version control (if deploying)

## Environment Variables

### Required (Local Development - `.env.local`)
```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook Configuration (Optional)
NEXT_PUBLIC_WEBHOOK_URL=https://build.goproxe.com/webhook/bconclub-website
NEXT_PUBLIC_WEBHOOK_SECRET=your-webhook-secret-token  # Optional: for webhook authentication
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=true  # Set to true to enable tracking in development
WEBHOOK_SECRET=your-webhook-secret-token  # Server-side webhook secret (for /api/webhook endpoint)
```

### Environment Variable Notes
- Variables prefixed with `NEXT_PUBLIC_` are available on the client-side
- `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed to client-side code (server-only)
- `WEBHOOK_SECRET` is server-only and used for webhook authentication
- Create `.env.local` in the project root (this file is gitignored)

## Installation

### Initial Setup
```bash
# Clone repository (if applicable)
git clone <repository-url>
cd BCON2

# Install dependencies
npm install
```

### Dependency Versions (from package.json)
```json
{
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.89.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "gsap": "^3.13.0",
    "mathjs": "^15.0.0",
    "motion": "^12.23.24",
    "next": "^15.0.0",
    "ogl": "^1.0.11",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "three": "^0.180.0",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.182.0",
    "eslint": "^9.39.2",
    "eslint-config-next": "^16.1.1",
    "typescript": "^5"
  }
}
```

## Development

### Run Development Server
```bash
npm run dev
```
- Runs Next.js development server
- Serves at **http://localhost:3000**
- Hot reload enabled
- TypeScript checking enabled
- React Strict Mode enabled

### Development Features
- Fast Refresh (HMR)
- TypeScript type checking
- ESLint integration
- Source maps for debugging

## Build (Production)

### Create Production Build
```bash
npm run build
```
- Outputs optimized production build to `.next/` directory
- Next.js handles all optimization automatically:
  - Code splitting
  - Tree shaking
  - Minification
  - Image optimization
  - Static page generation where applicable

### Build Output
- Production build is created in `.next/` directory
- Static assets are optimized and hashed
- Server and client bundles are separated
- Build includes source maps for production debugging

## Start (Production Server)

### Run Production Server
```bash
npm start
```
- Starts production server (must run `npm run build` first)
- Serves the production build
- Default port: 3000 (configurable via `PORT` environment variable)
- Optimized for performance

## Testing

### Run Tests
```bash
npm test
```
- Interactive watch mode (if configured)
- Uses React Testing Library and Jest DOM
- Test files should be named `*.test.ts` or `*.test.tsx`

### Test Configuration
- Testing Library: React Testing Library v16.3.0
- Jest DOM: v6.9.1
- User Event: v13.5.0

## Linting

### Run ESLint
```bash
npm run lint
```
- Runs ESLint on the codebase
- Uses `eslint-config-next` v16.1.1
- ESLint version: 9.39.2
- Configured with Next.js recommended rules

## Scripts Reference (from package.json)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start Next.js development server |
| `build` | `next build` | Create optimized production build |
| `start` | `next start` | Start production server (requires build) |
| `lint` | `next lint` | Run ESLint on codebase |

## Project Structure

```
BCON2/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel routes
│   │   ├── login/                # Admin login page (/admin/login)
│   │   │   └── page.tsx
│   │   ├── work/                 # Admin work management
│   │   │   └── page.tsx
│   │   └── page.tsx              # Admin dashboard (/admin)
│   ├── api/                      # API routes
│   │   ├── portfolio/            # Portfolio CRUD API
│   │   │   ├── [id]/             # Individual portfolio item
│   │   │   │   └── route.ts
│   │   │   └── route.ts          # List/Create portfolio
│   │   ├── status/               # Status endpoint
│   │   │   └── route.ts
│   │   ├── story-highlights/     # Story highlights API
│   │   │   └── route.ts
│   │   ├── upload/               # File upload API
│   │   │   └── route.ts
│   │   ├── webhook/              # Webhook endpoint
│   │   │   └── route.ts          # POST/GET /api/webhook
│   │   └── work/                 # Work CRUD API
│   │       ├── [id]/             # Individual work item
│   │       │   ├── media/        # Work media endpoints
│   │       │   │   └── route.ts
│   │       │   └── route.ts
│   │       ├── media/            # Work media management
│   │       │   └── [mediaId]/    # Individual media item
│   │       │       └── route.ts
│   │       └── route.ts          # List/Create work
│   ├── services/                 # Services page
│   │   └── page.tsx              # /services
│   ├── status/                   # Status page
│   │   ├── page.tsx              # /status
│   │   └── status.css
│   ├── work/                     # Work/portfolio page
│   │   ├── page.tsx              # /work
│   │   └── work.css
│   ├── layout.tsx                # Root layout (includes TrackingProvider)
│   ├── page.tsx                  # Home page (/)
│   └── globals.css               # Global styles
├── components/                    # Reusable UI components
│   ├── admin/
│   │   └── ProtectedRoute.tsx   # Admin route protection
│   ├── ComingSoonModal/          # Coming soon modal component
│   │   ├── ComingSoonModal.tsx
│   │   └── ComingSoonModal.css
│   ├── desktop/                  # Desktop-specific components
│   │   ├── Hero.tsx
│   │   ├── BusinessApps.tsx
│   │   ├── WorkGrid.tsx
│   │   ├── BusinessApps.css
│   │   └── index.ts              # Exports all desktop components
│   ├── mobile/                   # Mobile-specific components
│   │   ├── Hero.tsx
│   │   ├── BusinessApps.tsx
│   │   ├── WorkGrid.tsx
│   │   ├── BusinessApps.css
│   │   └── index.ts              # Exports all mobile components
│   ├── ResponsiveSection.tsx     # Wrapper for device switching
│   ├── shared/                   # Shared components
│   │   └── Icons.tsx             # Icon components
│   ├── StaggeredMenu/            # Navigation menu component
│   │   ├── StaggeredMenu.tsx
│   │   └── StaggeredMenu.css
│   └── Tracking/                 # Tracking components
│       └── TrackingProvider.tsx  # Global tracking provider
├── effects/                       # Visual effects
│   ├── GradualBlur/              # Gradual blur effect
│   │   ├── GradualBlur.tsx
│   │   └── GradualBlur.css
│   ├── LiquidEther/              # Liquid ether effect
│   │   ├── LiquidEther.tsx
│   │   └── LiquidEther.css
│   └── Loader/                   # Loading component
│       ├── Loader.tsx
│       └── Loader.css
├── lib/                          # Utility libraries
│   ├── hooks/
│   │   └── useMediaQuery.ts      # Media query hook for responsive design
│   ├── supabase/                 # Supabase integration
│   │   ├── client.ts             # Client-side Supabase client
│   │   └── server.ts             # Server-side Supabase client
│   └── tracking/                 # Tracking and analytics
│       ├── index.ts              # Tracking exports
│       ├── README.md             # Tracking documentation
│       ├── utm.ts                # UTM parameter handling
│       └── webhook.ts            # Webhook integration
├── sections/                     # Page sections
│   ├── BusinessAppsCarousel/     # Business apps carousel
│   │   ├── BusinessAppsCarousel.tsx
│   │   └── BusinessAppsCarousel.css
│   ├── BusinessAppsSection/     # Business apps section
│   │   ├── BusinessAppsSection.tsx
│   │   └── BusinessAppsSection.css
│   ├── CaseStudyModal/           # Case study modal
│   │   ├── CaseStudyModal.tsx
│   │   └── CaseStudyModal.css
│   ├── CategorySection/          # Category section
│   │   ├── CategorySection.tsx
│   │   └── CategorySection.css
│   ├── CategoryToggle/           # Category toggle component
│   │   ├── CategoryToggle.tsx
│   │   └── CategoryToggle.css
│   ├── ContactSection/           # Contact section
│   │   ├── ContactSection.tsx
│   │   └── ContactSection.css
│   ├── FeaturedWorkGrid/         # Featured work grid
│   │   ├── FeaturedWorkGrid.tsx
│   │   └── FeaturedWorkGrid.css
│   ├── Footer/                   # Footer component
│   │   ├── Footer.tsx
│   │   └── Footer.css
│   ├── LiquidBentoPortfolio/     # Liquid bento portfolio
│   │   ├── LiquidBentoPortfolio.tsx
│   │   └── LiquidBentoPortfolio.css
│   ├── ProjectCard/              # Project card component
│   │   ├── ProjectCard.tsx
│   │   └── ProjectCard.css
│   ├── RotatingText/             # Rotating text component
│   │   └── RotatingText.tsx
│   ├── ScrollReveal/             # Scroll reveal animations
│   │   ├── ScrollReveal.tsx
│   │   └── ScrollReveal.css
│   ├── ServicesDetail/           # Services detail section
│   │   ├── ServicesDetail.tsx
│   │   └── ServicesDetail.css
│   ├── ServicesGrid/             # Services grid
│   │   ├── ServicesGrid.tsx
│   │   └── ServicesGrid.css
│   ├── ShowcaseCard/             # Showcase card component
│   │   ├── ShowcaseCard.tsx
│   │   └── ShowcaseCard.css
│   ├── ShowcaseSection/          # Showcase section
│   │   ├── ShowcaseSection.tsx
│   │   └── ShowcaseSection.css
│   ├── ShowReel/                 # Show reel component
│   │   ├── ShowReel.tsx
│   │   └── ShowReel.css
│   ├── StoryHighlights/          # Story highlights
│   │   ├── StoryHighlights.tsx
│   │   └── StoryHighlights.css
│   ├── WorkCard/                 # Work card component
│   │   ├── WorkCard.tsx
│   │   └── WorkCard.css
│   ├── WorkGrid/                 # Work grid component
│   │   ├── WorkGrid.tsx
│   │   └── WorkGrid.css
│   ├── WorkHeroVideo/            # Work hero video
│   │   ├── WorkHeroVideo.tsx
│   │   └── WorkHeroVideo.css
│   ├── WorkShowcase/             # Work showcase
│   │   ├── WorkShowcase.tsx
│   │   └── WorkShowcase.css
│   └── index.ts                  # Section exports (if exists)
├── public/                       # Static assets
│   ├── assets/
│   │   └── pixel-412.svg
│   ├── portfolio/                # Portfolio media files
│   │   ├── thumbnails/           # Portfolio thumbnails
│   │   │   └── [6 .webp files]
│   │   └── [various .mp4, .jpg, .png files]
│   ├── product thumbnail/        # Product thumbnails
│   │   └── [4 .webp files]
│   ├── technology/               # Technology logos
│   │   └── [5 .png files]
│   ├── BCON White logo.webp
│   ├── BRain.png
│   ├── Business Apps.png
│   ├── favicon.ico
│   ├── Glass bulb.webp
│   ├── Gulb Icon.png
│   ├── logo192.png
│   ├── logo512.png
│   └── robots.txt
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── vercel.json                   # Vercel deployment configuration
├── ecosystem.config.js           # PM2 configuration (for server deployment)
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── ARCHITECTURE.md               # Architecture documentation
├── DEPLOYMENT.md                 # Deployment guide
├── MIGRATION_GUIDE.md            # Migration documentation
├── README.md                     # Project README
└── supabase-schema.sql           # Supabase database schema
```

## API Routes

### Portfolio API
- **GET** `/api/portfolio` - List all portfolio items
- **POST** `/api/portfolio` - Create new portfolio item
- **GET** `/api/portfolio/[id]` - Get individual portfolio item
- **PUT** `/api/portfolio/[id]` - Update portfolio item
- **DELETE** `/api/portfolio/[id]` - Delete portfolio item

### Work API
- **GET** `/api/work` - List all work items
- **POST** `/api/work` - Create new work item
- **GET** `/api/work/[id]` - Get individual work item
- **PUT** `/api/work/[id]` - Update work item
- **DELETE** `/api/work/[id]` - Delete work item
- **GET** `/api/work/[id]/media` - Get work media
- **POST** `/api/work/[id]/media` - Add media to work item
- **GET** `/api/work/media/[mediaId]` - Get individual media item
- **DELETE** `/api/work/media/[mediaId]` - Delete media item

### Upload API
- **POST** `/api/upload` - File upload endpoint (for images/videos)

### Webhook API
- **POST** `/api/webhook` - Receive webhook calls from build.goproxe.com
- **GET** `/api/webhook` - Verify webhook endpoint is active

### Status API
- **GET** `/api/status` - Application status endpoint

### Story Highlights API
- **GET** `/api/story-highlights` - Get story highlights

## Admin Access

### Admin Routes
- **Login URL**: `/admin/login`
- **Dashboard URL**: `/admin` (protected route)
- **Work Management**: `/admin/work`

### Authentication
- **Provider**: Supabase Auth
- **Protection**: `ProtectedRoute` component wraps admin routes
- **Access**: Users must log in with valid Supabase credentials
- **Session**: Managed by Supabase Auth with SSR support

### Admin Features
- Portfolio management
- Work item management
- Media upload and management
- Authentication required for all admin operations

## Responsive Design Architecture

### Component Switching Approach
The project uses a **Component Switching** approach for responsive design:
- **Mobile components**: `components/mobile/` (viewport ≤ 768px)
- **Desktop components**: `components/desktop/` (viewport > 768px)
- **Wrapper**: `ResponsiveSection` component automatically renders the correct version

### Responsive Components
| Component | Mobile | Desktop | Status |
|-----------|--------|---------|--------|
| Hero | `components/mobile/Hero.tsx` | `components/desktop/Hero.tsx` | ✅ Complete |
| Business Apps | `components/mobile/BusinessApps.tsx` | `components/desktop/BusinessApps.tsx` | ✅ Complete |
| Work Grid | `components/mobile/WorkGrid.tsx` | `components/desktop/WorkGrid.tsx` | ✅ Complete |

### Device Detection
- Uses `useMediaQuery` hook from `lib/hooks/useMediaQuery.ts`
- Breakpoint: 768px (customizable per component)
- Client-side detection using `window.matchMedia`

## Tracking & Analytics

### Automatic Tracking
The application includes comprehensive tracking via `TrackingProvider`:
- **Page Views**: Every page navigation with full path and UTM parameters
- **User Interactions**: Clicks on links, buttons, and interactive elements
- **Scroll Depth**: Tracks when users scroll to 25%, 50%, 75%, and 100%
- **Form Submissions**: All form submissions with form details
- **Time on Page**: Session duration and exit tracking
- **UTM Parameters**: Automatically captures and persists UTM parameters from URLs

### UTM Parameter Tracking
UTM parameters are automatically captured:
- `utm_source` - Traffic source
- `utm_medium` - Marketing medium
- `utm_campaign` - Campaign name
- `utm_term` - Campaign term/keyword
- `utm_content` - Content variation

UTM parameters are:
- Parsed from the URL on page load
- Stored in sessionStorage for the entire session
- Included in all tracking events sent to the webhook
- Persisted across page navigations

### Webhook Integration
- **Webhook URL**: `https://build.goproxe.com/webhook/bconclub-website`
- **Format**: POST requests with JSON payloads
- **Batching**: Events are queued and sent in batches for better performance
- **Retry Logic**: Failed requests are automatically retried up to 3 times
- **Authentication**: Optional `WEBHOOK_SECRET` for secure webhook calls

### Disabling Tracking
To disable tracking in development:
```bash
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=false
```

## Next.js Configuration

### Image Optimization
Configured in `next.config.js`:
- **Supabase Storage**: `**.supabase.co` (storage bucket images)
- **Vimeo**: `player.vimeo.com`, `i.vimeocdn.com` (video thumbnails)
- **Local Images**: Optimized automatically
- **Format**: WebP, AVIF when supported

### Webpack Configuration
Custom webpack configuration for:
- **Three.js Support**: Fallbacks for `fs`, `path`, `crypto` (client-side)
- **GLSL Shader Support**: `.glsl`, `.vs`, `.fs`, `.vert`, `.frag` files
- **GSAP**: Full support for GSAP animations

### React Strict Mode
Enabled for development:
- Helps identify potential problems
- Detects unexpected side effects
- Warns about deprecated APIs

### TypeScript Configuration
- **Target**: ES2020
- **Module**: ESNext
- **Module Resolution**: Bundler
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` maps to project root

## Build Truths / Operational Notes

### Core Technologies
- **Next.js**: 15.0.0 with App Router (not Pages Router, not Create React App)
- **TypeScript**: 5.x for type safety
- **React**: 19.2.0 (React DOM 19.2.0) - Latest stable version
- **Supabase**: @supabase/ssr v0.8.0 and @supabase/supabase-js v2.89.0 for proper Next.js SSR support

### Environment Variables
- Must be prefixed with `NEXT_PUBLIC_` to be available on the client
- Server-only variables (like `SUPABASE_SERVICE_ROLE_KEY`) should NOT have `NEXT_PUBLIC_` prefix
- Set in `.env.local` for local development (gitignored)
- Set in deployment platform (Vercel, etc.) for production

### Static Assets
- Static assets in `public/` are served from the root path
- Example: `public/logo.png` → accessible at `/logo.png`
- Images are automatically optimized by Next.js Image component

### Routing
- App Router uses file-based routing in the `app/` directory
- `page.tsx` files define routes
- `layout.tsx` files define shared layouts
- `route.ts` files define API routes

### Supabase Integration
- Client-side: `lib/supabase/client.ts` (browser)
- Server-side: `lib/supabase/server.ts` (SSR, API routes)
- Uses `@supabase/ssr` for proper Next.js integration
- Row Level Security (RLS) policies should be configured in Supabase

### Animation Libraries
- **GSAP**: 3.13.0 with React integration (@gsap/react 2.1.2)
- **Motion**: 12.23.24 for animations
- **Three.js**: 0.180.0 for 3D graphics
- **OGL**: 1.0.11 for WebGL utilities

### Testing
- **React Testing Library**: v16.3.0
- **Jest DOM**: v6.9.1
- **User Event**: v13.5.0
- Test files: `*.test.ts` or `*.test.tsx`

### Linting
- **ESLint**: 9.39.2
- **Config**: eslint-config-next v16.1.1
- Next.js recommended rules enabled

### Browser Support
Configured in `package.json` browserslist:
- **Production**: >0.2%, not dead, not op_mini all
- **Development**: Last 1 version of Chrome, Firefox, Safari

### Package Overrides
Security overrides in `package.json`:
- `terser`: ^5.15.1
- `css-what`: ^6.1.0
- `nth-check`: ^2.1.1

## Deployment

### Vercel Deployment (Recommended)

#### Configuration
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Regions**: `iad1` (configured in `vercel.json`)

#### Environment Variables (Vercel)
Set in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_WEBHOOK_URL=https://build.goproxe.com/webhook/bconclub-website
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=true
WEBHOOK_SECRET=your-webhook-secret-token
```

#### Deployment Steps
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy (automatic on push to main branch)
4. Custom domain configuration (optional)

### PM2 Deployment (Server)

#### Configuration
PM2 configuration in `ecosystem.config.js`:
- **App Name**: `bconclub`
- **Script**: `npm start`
- **Working Directory**: `/var/www/bconclub`
- **Instances**: 1
- **Memory Limit**: 1GB
- **Port**: 3003 (configurable via `PORT` env var)
- **Auto Restart**: Enabled
- **Logs**: `/var/www/bconclub/logs/`

#### PM2 Commands
```bash
# Start application
pm2 start ecosystem.config.js

# Stop application
pm2 stop bconclub

# Restart application
pm2 restart bconclub

# View logs
pm2 logs bconclub

# Monitor
pm2 monit
```

### Supabase Configuration

#### Storage Buckets
Required buckets:
- **portfolio-images**: Public bucket for portfolio images
- **admin-uploads**: Private bucket for admin-only uploads (optional)

#### Row Level Security (RLS)
- Public can read published portfolio/work items
- Only authenticated admins can create/update/delete
- Configure RLS policies in Supabase Dashboard

#### Authentication
- Admin users created in Supabase Dashboard → Authentication → Users
- Email/password authentication
- Session management via Supabase Auth

## Troubleshooting

### Common Issues

#### Build Fails
- **Check**: Environment variables are set correctly
- **Verify**: All dependencies are in `package.json`
- **Run**: `npm run build` locally to see TypeScript errors
- **Check**: Node.js version is 18+ (recommended: 20+)

#### Images Not Loading
- **Verify**: Supabase Storage bucket is public
- **Check**: Image URLs in database are correct
- **Verify**: `next.config.js` image domains include Supabase
- **Check**: Image component is used correctly (`next/image`)

#### Authentication Not Working
- **Check**: Supabase URL and keys are correct
- **Verify**: RLS policies are configured
- **Check**: Browser console for errors
- **Verify**: Environment variables are prefixed correctly

#### API Routes Returning 500
- **Check**: Server logs in Vercel/PM2
- **Verify**: Supabase connection is working
- **Check**: Authentication middleware is correct
- **Verify**: Service role key is set (server-only)

#### Webhook Not Receiving Events
- **Verify**: `NEXT_PUBLIC_WEBHOOK_URL` is set correctly
- **Check**: Webhook endpoint is accessible (`GET /api/webhook`)
- **Verify**: `WEBHOOK_SECRET` matches (if using authentication)
- **Check**: Network connectivity to webhook URL

#### TypeScript Errors
- **Run**: `npm run build` to see all TypeScript errors
- **Check**: Type definitions are installed (`@types/*` packages)
- **Verify**: `tsconfig.json` is configured correctly

#### Dependency Issues
- **Run**: `npm install` to reinstall dependencies
- **Clear**: `node_modules` and `package-lock.json` (then reinstall)
- **Check**: Node.js version compatibility
- **Verify**: Package versions in `package.json`

### Development Issues

#### Hot Reload Not Working
- **Restart**: Development server (`npm run dev`)
- **Clear**: `.next` directory
- **Check**: File changes are being saved

#### Port Already in Use
- **Change**: Port in `package.json` scripts: `next dev -p 3001`
- **Kill**: Process using port 3000: `lsof -ti:3000 | xargs kill`

## Monitoring & Maintenance

### Vercel Analytics
- Enable in Project Settings → Analytics
- Monitor performance and errors
- Track page views and user behavior

### Supabase Dashboard
- Monitor database usage
- Check API request logs
- Monitor storage usage
- View authentication logs

### Logs
- **Vercel**: View logs in Vercel Dashboard → Deployments
- **PM2**: View logs with `pm2 logs bconclub`
- **Local**: Check console output during development

### Performance
- Monitor bundle size (Vercel Analytics)
- Check image optimization
- Monitor API response times
- Track Core Web Vitals

## Backup Strategy

1. **Database**: Use Supabase backups (automatic daily)
2. **Code**: Git repository is your backup
3. **Images**: Consider periodic exports from Supabase Storage
4. **Environment Variables**: Document in secure location

## Scaling Considerations

### Free Tier Limits
- **Supabase**: 500MB database, 1GB storage
- **Vercel**: 100GB bandwidth
- Monitor usage in both dashboards

### Upgrade Path
- Upgrade Supabase plan for more storage/database
- Upgrade Vercel plan for more bandwidth
- Consider CDN for static assets
- Implement caching strategies

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **GSAP Docs**: https://greensock.com/docs
- **Three.js Docs**: https://threejs.org/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs

## Version History

- **1.0.2**: Current version
- See `package.json` for dependency versions
- See git history for code changes

---

**Last Updated**: Based on current codebase state
**Maintained By**: BCON Club Development Team
