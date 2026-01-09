# Environment Variables Setup Guide

## Quick Fix for "Supabase environment variables not configured" Error

The error you're seeing means your `.env.local` file is missing or doesn't have the required Supabase credentials.

## Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://app.supabase.com
2. **Select your project** (or create a new one)
3. **Go to Settings** → **API**
4. **Copy these values:**
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (keep this secret!) → This is your `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Create `.env.local` File

In your project root directory (`/home/z/Builds/BCON2/`), create a file named `.env.local`:

```bash
# Create the file
touch .env.local
```

Or create it manually in your editor.

## Step 3: Add Your Supabase Credentials

Open `.env.local` and add:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here

# Webhook Configuration (Optional)
NEXT_PUBLIC_WEBHOOK_URL=https://build.goproxe.com/webhook/bconclub-website
NEXT_PUBLIC_WEBHOOK_SECRET=your-webhook-secret-token
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=true
WEBHOOK_SECRET=your-webhook-secret-token
```

**Replace the placeholder values with your actual Supabase credentials.**

## Step 4: Restart Your Development Server

After creating/updating `.env.local`:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

**Important:** Next.js only reads `.env.local` on server start, so you must restart!

## Step 5: Verify It's Working

1. **Check the status page**: Visit `http://localhost:3000/status`
2. **Look for**: "Connection: CONNECTED" and "Status: SUCCESS" (in green)
3. **If still showing error**: Double-check your credentials are correct

## Example `.env.local` File

Here's what a complete `.env.local` file should look like (with example values):

```bash
# ============================================================================
# SUPABASE CONFIGURATION (REQUIRED)
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.example-service-role-key

# ============================================================================
# WEBHOOK CONFIGURATION (OPTIONAL)
# ============================================================================
NEXT_PUBLIC_WEBHOOK_URL=https://build.goproxe.com/webhook/bconclub-website
NEXT_PUBLIC_WEBHOOK_SECRET=your-webhook-secret-token
NEXT_PUBLIC_ENABLE_WEBHOOK_TRACKING=true
WEBHOOK_SECRET=your-webhook-secret-token
```

## Troubleshooting

### Error: "File not found" or "Permission denied"
- Make sure you're creating `.env.local` in the project root (same directory as `package.json`)
- Check file permissions: `chmod 600 .env.local`

### Error: "Variables still not found after restart"
- Make sure the file is named exactly `.env.local` (not `.env.local.txt` or `env.local`)
- Check for typos in variable names (must be exact: `NEXT_PUBLIC_SUPABASE_URL`)
- Make sure there are no spaces around the `=` sign
- Restart your dev server completely

### Error: "Invalid Supabase URL"
- Make sure your URL starts with `https://` and ends with `.supabase.co`
- Don't include trailing slashes
- Example: `https://abcdefghijklmnop.supabase.co` ✅
- Example: `https://abcdefghijklmnop.supabase.co/` ❌

### Error: "Invalid API key"
- Make sure you copied the entire key (they're very long)
- Don't add quotes around the values
- Check for extra spaces or line breaks

## Security Notes

⚠️ **IMPORTANT:**
- `.env.local` is in `.gitignore` - it won't be committed to git
- **Never commit** your `.env.local` file to version control
- **Never share** your `SUPABASE_SERVICE_ROLE_KEY` publicly
- The `NEXT_PUBLIC_` prefix means those variables are exposed to the browser (safe for anon key, but be careful)

## For Production (Vercel/Deployment)

When deploying, add these environment variables in your hosting platform:

### Vercel:
1. Go to Project Settings → Environment Variables
2. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - (and any webhook variables)

### Other Platforms:
- Add environment variables in your platform's settings
- Use the same variable names as in `.env.local`

## Quick Checklist

- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` with your Supabase project URL
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon/public key
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` with your service role key
- [ ] Restarted development server (`npm run dev`)
- [ ] Verified connection at `/status` page

Once all checked, your database connection should work! ✅
