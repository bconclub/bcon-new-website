# BCON Club - Next.js Migration Quick Start

## 🚀 Quick Start

This migration guide will help you move from Create React App to Next.js 14 with Supabase backend.

## 📋 Files Created

1. **MIGRATION_GUIDE.md** - Complete step-by-step migration guide
2. **supabase-schema.sql** - Database schema for portfolio management
3. **next.config.js** - Next.js configuration
4. **lib/supabase/** - Supabase client setup
5. **app/api/** - API routes for CRUD operations
6. **app/admin/** - Admin panel pages
7. **components/admin/** - Admin components
8. **DEPLOYMENT.md** - Vercel deployment guide
9. **PACKAGE_JSON_UPDATE.md** - Package.json update instructions

## ⚡ Quick Steps

### 1. Set Up Supabase
```bash
# 1. Create account at supabase.com
# 2. Create new project
# 3. Run supabase-schema.sql in SQL Editor
# 4. Create storage bucket: portfolio-images (public)
```

### 2. Install Dependencies
```bash
npm install next@14 react@18 react-dom@18
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install -D @types/node @types/react @types/react-dom typescript
```

### 3. Update package.json
See `PACKAGE_JSON_UPDATE.md` for details

### 4. Set Up Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### 5. Migrate Pages
- `src/pages/Home.js` → `app/page.tsx`
- `src/pages/Services.js` → `app/services/page.tsx`
- `src/pages/AllWork.js` → `app/work/page.tsx`

### 6. Test Locally
```bash
npm run dev
```

### 7. Deploy to Vercel
See `DEPLOYMENT.md` for complete guide

## 📁 New Folder Structure

```
app/
  page.tsx              # Home page
  services/
    page.tsx           # Services page
  work/
    page.tsx           # Work page
  admin/
    page.tsx           # Admin dashboard
    login/
      page.tsx         # Admin login
  api/
    portfolio/         # Portfolio API routes
    upload/            # Image upload route

lib/
  supabase/
    client.ts          # Client-side Supabase
    server.ts          # Server-side Supabase

components/
  admin/               # Admin components
  (your existing components)

sections/
  (your existing sections)
```

## 🔐 Admin Access

1. Create admin user in Supabase Dashboard
2. Go to `/admin/login`
3. Sign in with email/password
4. Access dashboard at `/admin`

## 📝 Next Steps

After basic setup:
1. Migrate existing portfolio content to Supabase
2. Update components to fetch from Supabase
3. Test all functionality
4. Deploy to production

## 🆘 Need Help?

- Check `MIGRATION_GUIDE.md` for detailed steps
- Review `DEPLOYMENT.md` for deployment issues
- Check Supabase docs: https://supabase.com/docs
- Check Next.js docs: https://nextjs.org/docs

## ✅ Migration Checklist

- [ ] Supabase project created
- [ ] Database schema run
- [ ] Storage buckets created
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Pages migrated
- [ ] Admin panel tested
- [ ] Portfolio fetching works
- [ ] Deployed to Vercel




