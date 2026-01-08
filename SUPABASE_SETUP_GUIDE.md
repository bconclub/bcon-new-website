# Supabase Schema Setup Guide

This guide lists all the Supabase schemas you need to run to enable different features on the BCON Club website.

## Required Schemas (Run in Order)

### 1. Main Portfolio Schema
**File:** `supabase-schema.sql`
**Purpose:** Portfolio items, categories, and main content management
**Tables Created:**
- `categories` - Portfolio categories (AI in Business, Brand Marketing, Business Apps)
- `portfolio_items` - Portfolio project items
- `portfolio_items_view` - View for easy querying

**Run this first** as it sets up the core portfolio functionality.

---

### 2. Work Items Schema
**File:** `supabase-work-schema.sql`
**Purpose:** Work items, case studies, and media galleries
**Tables Created:**
- `work_items` - Work/case study items
- `work_media` - Media files for work items (images/videos)
- `story_highlights` - Story highlight items

**Run this second** for work/case study functionality.

---

### 3. Visitor Count Schema
**File:** `supabase-visitor-count-schema.sql`
**Purpose:** Track unique visitor count (used in Footer)
**Tables Created:**
- `site_analytics` - Stores visitor count

**API Route:** `/api/visitor-count`
**Usage:** Automatically tracks visitors when Footer component loads

---

### 4. Viewer Count Schema
**File:** `supabase-viewer-count-schema.sql`
**Purpose:** Track concurrent viewer count
**Tables Created:**
- `site_stats` - Stores viewer count

**API Route:** `/api/viewer-count`
**Usage:** Can be used for real-time viewer tracking

---

### 5. Newsletter Subscription Schema ⭐ NEW
**File:** `supabase-newsletter-schema.sql`
**Purpose:** Store newsletter email subscriptions (used in Footer)
**Tables Created:**
- `newsletter_subscribers` - Email subscriptions

**API Route:** `/api/newsletter` (needs to be created)
**Usage:** Footer newsletter subscription form

---

## Quick Setup Steps

1. **Open Supabase Dashboard** → Go to SQL Editor

2. **Run schemas in this order:**
   ```sql
   -- 1. Main portfolio
   -- Copy and paste contents of supabase-schema.sql
   
   -- 2. Work items
   -- Copy and paste contents of supabase-work-schema.sql
   
   -- 3. Visitor count
   -- Copy and paste contents of supabase-visitor-count-schema.sql
   
   -- 4. Viewer count (optional)
   -- Copy and paste contents of supabase-viewer-count-schema.sql
   
   -- 5. Newsletter (NEW - required for Footer)
   -- Copy and paste contents of supabase-newsletter-schema.sql
   ```

3. **Verify tables were created:**
   - Go to Table Editor in Supabase
   - You should see: `categories`, `portfolio_items`, `work_items`, `work_media`, `story_highlights`, `site_analytics`, `site_stats`, `newsletter_subscribers`

4. **Check RLS Policies:**
   - Go to Authentication → Policies
   - Verify that public read/insert policies are active

---

## Features Enabled by Each Schema

| Schema | Feature | Status |
|--------|---------|--------|
| `supabase-schema.sql` | Portfolio management | ✅ Required |
| `supabase-work-schema.sql` | Work/Case studies | ✅ Required |
| `supabase-visitor-count-schema.sql` | Footer visitor counter | ✅ Required |
| `supabase-viewer-count-schema.sql` | Viewer counter | ⚠️ Optional |
| `supabase-newsletter-schema.sql` | Newsletter subscriptions | ✅ Required (NEW) |

---

## Next Steps After Setup

1. **Create Newsletter API Route:**
   - Create `app/api/newsletter/route.ts`
   - Handle POST requests to insert email into `newsletter_subscribers` table

2. **Test Functionality:**
   - Test visitor count in Footer
   - Test newsletter subscription form
   - Test portfolio/work item fetching

3. **Set up Admin Access (Optional):**
   - Configure authentication
   - Add admin policies for managing content

---

## Troubleshooting

**Error: "relation does not exist"**
- Make sure you ran the schemas in order
- Check that tables were created in Table Editor

**Error: "permission denied"**
- Check RLS policies are enabled and public policies exist
- Verify service role key is set in environment variables

**Visitor count not working:**
- Ensure `site_analytics` table exists
- Check API route has correct table name
- Verify service role key has write permissions
