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

# Webhook Configuration
NEXT_PUBLIC_WEBHOOK_URL=https://build.goproxe.com/webhook/bconclub-website
NEXT_PUBLIC_WEBHOOK_SECRET=your-webhook-secret-token  # Optional: for webhook authentication
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=true  # Set to true to enable tracking in development
WEBHOOK_SECRET=your-webhook-secret-token  # Server-side webhook secret (for /api/webhook endpoint)
```

### Production (Vercel)
Set in Vercel Dashboard → Settings → Environment Variables

---

## Webhook Configuration

### Build Webhook
The application includes a webhook endpoint for receiving build/deployment notifications from external services.

**Webhook URL**: `https://build.goproxe.com/webhook/bconclub-website`

**Local Endpoint**: `http://localhost:3000/api/webhook`  
**Production Endpoint**: `https://your-domain.com/api/webhook`

### Setting Up the Webhook

1. **Configure the webhook in build.goproxe.com**:
   - Set the webhook URL to: `https://your-domain.com/api/webhook`
   - Configure the webhook to send POST requests
   - Add authentication header if using `WEBHOOK_SECRET`:
     - Header: `Authorization: Bearer {WEBHOOK_SECRET}`

2. **Environment Variable** (Optional):
   - Add `WEBHOOK_SECRET` to your environment variables for webhook authentication
   - If not set, the webhook will accept requests without authentication (less secure)

3. **Test the Webhook**:
   - Send a GET request to `/api/webhook` to verify the endpoint is active
   - Send a POST request with a JSON payload to test webhook processing

### Webhook Payload Format
The webhook handler expects JSON payloads. Example:
```json
{
  "event": "build.complete",
  "type": "deployment.success",
  "data": {
    "buildId": "123",
    "status": "success"
  }
}
```

Supported event types:
- `build.complete` / `deployment.success` - Successful build/deployment
- `build.failed` / `deployment.failed` - Failed build/deployment
- Custom events can be added as needed

---

## UTM Tracking & Analytics

### Automatic Tracking
The application automatically tracks:
- **Page Views**: Every page navigation with full path and UTM parameters
- **User Interactions**: Clicks on links, buttons, and interactive elements
- **Scroll Depth**: Tracks when users scroll to 25%, 50%, 75%, and 100%
- **Form Submissions**: All form submissions with form details
- **Time on Page**: Session duration and exit tracking
- **UTM Parameters**: Automatically captures and persists UTM parameters from URLs

### UTM Parameter Tracking
UTM parameters are automatically captured from URL query strings:
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

### Tracking Data Structure
All tracking events include:
```json
{
  "event": "page_view",
  "page": "/work",
  "path": "/work?utm_source=google&utm_campaign=summer",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "utm": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "summer"
  },
  "sessionId": "session_1234567890_abc123",
  "additionalData": {
    "pageTitle": "BCON Club - Work",
    "viewport": { "width": 1920, "height": 1080 }
  }
}
```

### Custom Event Tracking
You can track custom events using the `useTracking` hook:

```typescript
import { useTracking } from '@/lib/tracking';

function MyComponent() {
  const { trackEvent, trackEventImmediate } = useTracking();
  
  const handleAction = () => {
    // Queue event (batched)
    trackEvent('custom_action', {
      actionType: 'button_click',
      buttonId: 'cta-primary'
    });
    
    // Or send immediately
    trackEventImmediate('important_event', {
      eventData: 'value'
    });
  };
}
```

### Webhook Integration
All tracking data is automatically sent to:
- **Webhook URL**: `https://build.goproxe.com/webhook/bconclub-website`
- **Format**: POST requests with JSON payloads
- **Batching**: Events are queued and sent in batches for better performance
- **Retry Logic**: Failed requests are automatically retried up to 3 times

### Disabling Tracking
To disable tracking in development, remove or set:
```bash
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=false
```

Tracking will still log to console but won't send to webhook in development mode.

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




