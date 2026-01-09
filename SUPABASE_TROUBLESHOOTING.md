# Supabase Schema Troubleshooting Guide

## Common Errors and Solutions

### 1. **Error: "trigger already exists"**
**Error Message:**
```
ERROR: 42710: trigger "update_work_items_updated_at" for relation "work_items" already exists
```

**Solution:**
- The schema file now includes `DROP TRIGGER IF EXISTS` statements
- If you still get this error, manually drop the trigger first:
```sql
DROP TRIGGER IF EXISTS update_work_items_updated_at ON work_items;
-- Repeat for other triggers that error
```

**Or:** Run the complete schema file which now handles this automatically.

---

### 2. **Error: "policy already exists"**
**Error Message:**
```
ERROR: duplicate key value violates unique constraint "policies_pkey"
```

**Solution:**
- The schema file now includes `DROP POLICY IF EXISTS` statements
- If you still get this error, manually drop the policy first:
```sql
DROP POLICY IF EXISTS "Published work items are viewable by everyone" ON work_items;
-- Repeat for other policies that error
```

---

### 3. **Error: "function already exists"**
**Error Message:**
```
ERROR: function "update_updated_at_column()" already exists
```

**Solution:**
- Functions use `CREATE OR REPLACE FUNCTION` which should handle this
- If you get this error, it means the function signature changed
- Drop and recreate:
```sql
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
-- Then re-run the CREATE OR REPLACE FUNCTION statement
```

---

### 4. **Error: "relation does not exist"**
**Error Message:**
```
ERROR: relation "categories" does not exist
```

**Possible Causes:**
- Tables weren't created successfully
- Running schema out of order
- Foreign key references before table creation

**Solution:**
1. Check if tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

2. If tables are missing, run the schema file again
3. Make sure to run the complete schema file in order (it's designed to be run all at once)

---

### 5. **Error: "permission denied"**
**Error Message:**
```
ERROR: permission denied for table "portfolio_items"
```

**Possible Causes:**
- RLS policies not set up correctly
- Missing policies for the operation you're trying to perform

**Solution:**
1. Check if RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

2. Check existing policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'portfolio_items';
```

3. Re-run the RLS section of the schema file

---

### 6. **Error: "extension already exists"**
**Error Message:**
```
ERROR: extension "uuid-ossp" already exists
```

**Solution:**
- This is harmless - the schema uses `CREATE EXTENSION IF NOT EXISTS`
- You can ignore this or it means the extension is already installed (which is fine)

---

### 7. **Error: "constraint already exists"**
**Error Message:**
```
ERROR: constraint "categories_slug_key" already exists
```

**Solution:**
- This happens when running schema multiple times
- The schema uses `CREATE TABLE IF NOT EXISTS` which should prevent this
- If it persists, drop the table and recreate:
```sql
DROP TABLE IF EXISTS categories CASCADE;
-- Then re-run the CREATE TABLE statement
```

**Warning:** Dropping tables will delete all data!

---

### 8. **Error: "index already exists"**
**Error Message:**
```
ERROR: relation "idx_portfolio_category" already exists
```

**Solution:**
- The schema uses `CREATE INDEX IF NOT EXISTS` which should prevent this
- If you get this error, drop the index first:
```sql
DROP INDEX IF EXISTS idx_portfolio_category;
-- Then re-run the CREATE INDEX statement
```

---

## Step-by-Step Fix for Multiple Errors

If you're getting multiple errors, follow these steps:

### Step 1: Clean Up Existing Objects
Run this cleanup script first:

```sql
-- Drop all triggers
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_work_items_updated_at ON work_items;
DROP TRIGGER IF EXISTS update_story_highlights_updated_at ON story_highlights;
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
DROP TRIGGER IF EXISTS update_site_analytics_updated_at ON site_analytics;
DROP TRIGGER IF EXISTS update_site_stats_updated_at ON site_stats;
DROP TRIGGER IF EXISTS update_business_apps_updated_at ON business_apps;

-- Drop all policies (adjust table names as needed)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;
```

### Step 2: Run Complete Schema
After cleanup, run `supabase-complete-schema.sql` in full.

---

## Best Practice: Fresh Start

If you want to start completely fresh (⚠️ **WARNING: This deletes all data**):

```sql
-- ⚠️ DANGER: This will delete ALL tables and data!
-- Only run this if you want to start from scratch

-- Drop all tables in order (respecting foreign keys)
DROP TABLE IF EXISTS work_media CASCADE;
DROP TABLE IF EXISTS work_items CASCADE;
DROP TABLE IF EXISTS story_highlights CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS business_apps CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS site_analytics CASCADE;
DROP TABLE IF EXISTS site_stats CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_work_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_newsletter_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_site_stats_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_business_apps_updated_at() CASCADE;

-- Drop views
DROP VIEW IF EXISTS portfolio_items_view CASCADE;
```

Then run `supabase-complete-schema.sql` fresh.

---

## Verification Queries

After running the schema, verify everything was created:

### Check Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- business_apps
- categories
- contact_submissions
- newsletter_subscribers
- portfolio_items
- site_analytics
- site_stats
- story_highlights
- work_items
- work_media

### Check Functions
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
```

### Check Triggers
```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

### Check Policies
```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

---

## Common Issues by Section

### Portfolio Section Errors
- **Issue:** Foreign key constraint fails
- **Fix:** Make sure `categories` table is created before `portfolio_items`

### Work Items Section Errors
- **Issue:** Check constraint fails
- **Fix:** Verify category values are 'creative' or 'tech' only

### Business Apps Section Errors
- **Issue:** JSONB or array type errors
- **Fix:** Ensure features is JSONB array: `'[]'::jsonb` and tech_stack is TEXT array: `'{}'`

### RLS Policy Errors
- **Issue:** Policies not applying
- **Fix:** Make sure RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

---

## Getting Help

If you're still getting errors:

1. **Copy the exact error message** (including error code)
2. **Note which section** of the schema failed
3. **Check Supabase logs** in Dashboard → Logs → Postgres Logs
4. **Verify your Supabase project** has the necessary permissions

---

## Quick Fix Script

If you just want to fix the most common issues, run this:

```sql
-- Fix triggers
DROP TRIGGER IF EXISTS update_work_items_updated_at ON work_items;
DROP TRIGGER IF EXISTS update_story_highlights_updated_at ON story_highlights;
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
DROP TRIGGER IF EXISTS update_site_analytics_updated_at ON site_analytics;
DROP TRIGGER IF EXISTS update_site_stats_updated_at ON site_stats;
DROP TRIGGER IF EXISTS update_business_apps_updated_at ON business_apps;

-- Recreate triggers (copy from schema file)
-- Then re-run the complete schema file
```
