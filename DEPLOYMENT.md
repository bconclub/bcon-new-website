# Deployment Guide for BCON Club Next.js + Supabase

## Vercel Deployment

### Step 1: Prepare Your Repository
1. Ensure all code is committed and pushed to GitHub
2. Verify `.env.local` is in `.gitignore` (should be by default)

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Next.js

### Step 3: Configure Environment Variables
In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Important**: 
- Add these for all environments (Production, Preview, Development)
- Service Role Key should NEVER be exposed to client-side code

### Step 4: Build Settings
Vercel will auto-detect:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at `your-project.vercel.app`

### Step 6: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Supabase Configuration

### Storage Buckets Setup
1. Go to Supabase Dashboard → Storage
2. Create bucket: `portfolio-images`
   - Make it **public** (for portfolio images)
   - Set up CORS if needed
3. Create bucket: `admin-uploads` (optional, for admin-only uploads)
   - Keep it **private**

### Row Level Security (RLS)
Ensure RLS policies are set up correctly:
- Public can read published portfolio items
- Only authenticated admins can create/update/delete

### Authentication Setup
1. Go to Authentication → Settings
2. Configure email templates (optional)
3. Set up admin user:
   - Go to Authentication → Users
   - Create user manually or use signup
   - Note: You may want to add a custom claim for admin role

---

## Environment Variables Reference

### Local Development (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Production (Vercel)
Set in Vercel Dashboard → Settings → Environment Variables

---

## Post-Deployment Checklist

- [ ] Verify site is accessible
- [ ] Test portfolio display
- [ ] Test admin login
- [ ] Verify image uploads work
- [ ] Check API routes are working
- [ ] Test all animations (GSAP, Three.js)
- [ ] Verify mobile responsiveness
- [ ] Check SEO meta tags
- [ ] Test form submissions (if any)
- [ ] Monitor error logs in Vercel

---

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally

### Images Not Loading
- Verify Supabase Storage bucket is public
- Check image URLs in database
- Verify `next.config.js` image domains

### Authentication Not Working
- Check Supabase URL and keys
- Verify RLS policies
- Check browser console for errors

### API Routes Returning 500
- Check server logs in Vercel
- Verify Supabase connection
- Check authentication middleware

---

## Monitoring

### Vercel Analytics
- Enable in Project Settings → Analytics
- Monitor performance and errors

### Supabase Dashboard
- Monitor database usage
- Check API request logs
- Monitor storage usage

---

## Backup Strategy

1. **Database**: Use Supabase backups (automatic daily)
2. **Code**: Git repository is your backup
3. **Images**: Consider periodic exports from Supabase Storage

---

## Scaling Considerations

- Supabase free tier: 500MB database, 1GB storage
- Vercel free tier: 100GB bandwidth
- Consider upgrading if traffic increases
- Monitor usage in both dashboards




