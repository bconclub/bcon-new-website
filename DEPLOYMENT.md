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

---

## VPS Deployment (bconclub.com)

### Prerequisites
- VPS server with Ubuntu/Debian
- Nginx installed
- Node.js 18+ and PM2 installed
- Domain DNS configured

### Step 1: GitHub Actions Deployment
The project uses GitHub Actions for automated deployment. The workflow file (`.github/workflows/deploy.yml`) is configured to:
- Deploy on push to `production` branch
- Use secrets for VPS connection: `VPS_HOST`, `VPS_USERNAME`, `VPS_DEPLOY_KEY`
- Deploy to `/var/www/bconclub` on the VPS
- Run on port 3003 via PM2

**No domain references in deploy.yml** - all configuration uses secrets.

### Step 2: Nginx Configuration

1. **Create Nginx config file**:
   ```bash
   sudo nano /etc/nginx/sites-available/bconclub.com
   ```

2. **Copy the configuration** (see `nginx-bconclub.com.conf` in project root):
   ```nginx
   server {
       listen 80;
       server_name bconclub.com www.bconclub.com;
       
       location / {
           proxy_pass http://localhost:3003;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/bconclub.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 3: SSL Certificate (Let's Encrypt)

1. **Install Certbot** (if not already installed):
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate**:
   ```bash
   sudo certbot --nginx -d bconclub.com -d www.bconclub.com
   ```

3. **Verify auto-renewal**:
   ```bash
   sudo certbot renew --dry-run
   ```

### Step 4: DNS Configuration

Configure DNS records with your domain provider:

- **A Record**: `bconclub.com` → `82.29.167.17`
- **A Record**: `www.bconclub.com` → `82.29.167.17`

**Note**: DNS propagation can take 24-48 hours. Verify with:
```bash
dig bconclub.com
nslookup bconclub.com
```

### Step 5: PM2 Configuration

The `ecosystem.config.js` is already configured:
- **App Name**: `bconclub`
- **Port**: `3003`
- **Working Directory**: `/var/www/bconclub`
- **Logs**: `/var/www/bconclub/logs/`

PM2 will automatically start/restart on deployment via GitHub Actions.

### Step 6: Environment Variables

Set environment variables on the VPS (or via GitHub Secrets):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WEBHOOK_URL` (optional)

These are automatically set during deployment from GitHub Secrets.

### Post-Deployment Verification

1. **Check PM2 status**:
   ```bash
   pm2 status
   pm2 logs bconclub
   ```

2. **Check Nginx status**:
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

3. **Test the site**:
   - Visit `http://bconclub.com` (should redirect to HTTPS)
   - Visit `https://bconclub.com`
   - Visit `https://www.bconclub.com`

4. **Check SSL certificate**:
   ```bash
   sudo certbot certificates
   ```

### Troubleshooting VPS Deployment

**Site not accessible**:
- Check PM2: `pm2 status` and `pm2 logs bconclub`
- Check Nginx: `sudo nginx -t` and `sudo systemctl status nginx`
- Check firewall: `sudo ufw status`
- Verify port 3003 is accessible: `curl http://localhost:3003`

**SSL certificate issues**:
- Ensure DNS is properly configured
- Check Nginx config: `sudo nginx -t`
- Verify port 80 and 443 are open: `sudo ufw allow 80/tcp` and `sudo ufw allow 443/tcp`

**PM2 not starting**:
- Check logs: `pm2 logs bconclub`
- Verify Node.js version: `node --version`
- Check working directory exists: `ls -la /var/www/bconclub`




