# BCON Club Website

Modern, responsive website for BCON Club built with Next.js 15, React 19, and Supabase.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+
- Supabase project with environment variables configured

## 🔧 Environment Setup

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_WEBHOOK_URL=https://build.goproxe.com/webhook/bconclub-website
```

See `bcon webiste build.md` for complete setup instructions.

## 🏗️ Tech Stack

- **Framework**: Next.js 15.0.0 (App Router)
- **Language**: TypeScript 5
- **Runtime**: React 19.2.0
- **Database**: Supabase
- **Animations**: GSAP 3.13.0, Motion 12.23.24, Three.js 0.180.0

## 📁 Project Structure

```
app/              # Next.js App Router pages and API routes
components/       # Reusable React components
sections/         # Page sections
lib/              # Utilities and helpers
public/           # Static assets
```

## 📚 Documentation

- **Build Guide**: `bcon webiste build.md` - Complete build and deployment guide
- **Deployment**: `DEPLOYMENT.md` - Deployment instructions
- **Architecture**: `ARCHITECTURE.md` - System architecture overview
- **Database**: `supabase-complete-schema.sql` - Complete database schema

## 🚢 Deployment

### Vercel (Recommended)
- Automatic deployment on push to `main` branch
- See `DEPLOYMENT.md` for configuration

### VPS (PM2)
- Uses `ecosystem.config.js` for PM2 configuration
- Nginx config: `nginx-bconclub.com.conf`
- See `DEPLOYMENT.md` for setup

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔗 Links

- **Status Page**: `/status` - System status and version information
- **Admin Panel**: `/admin` - Content management (requires authentication)

## 📄 License

Private - BCON Club

---

**Version**: 1.11.4  
**Last Updated**: January 2026
