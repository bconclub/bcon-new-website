-- ============================================================================
-- BCON CLUB - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This file contains ALL database tables, functions, triggers, and policies
-- needed for the BCON Club website.
--
-- Run this entire file in Supabase SQL Editor to set up the complete database.
-- ============================================================================

-- ============================================================================
-- SECTION 1: EXTENSIONS
-- ============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION 2: PORTFOLIO MANAGEMENT
-- ============================================================================

-- Categories table for organizing portfolio items
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Project details
  client_name VARCHAR(255),
  industry VARCHAR(100),
  project_type VARCHAR(100),
  description TEXT,
  one_line_result VARCHAR(255),
  
  -- Media
  featured_image_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  video_thumbnail_url TEXT,
  
  -- Metrics and results
  metrics JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"label": "ROI", "value": "300%", "sublabel": "Increase"}]
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  featured BOOLEAN DEFAULT FALSE,
  
  -- Dates
  project_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT
);

-- Portfolio indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio_items(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio_items(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_items(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_created ON portfolio_items(created_at DESC);

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('AI in Business', 'ai-business', 'AI-powered business solutions and automation', 1),
  ('Brand Marketing', 'brand-marketing', 'Brand strategy and marketing campaigns', 2),
  ('Business Apps', 'business-apps', 'Digital platforms and applications', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SECTION 3: WORK ITEMS & CASE STUDIES
-- ============================================================================

-- Work Items table
CREATE TABLE IF NOT EXISTS work_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  client_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_type TEXT, -- 'Brand Identity', 'Web Platform', etc.
  category TEXT NOT NULL CHECK (category IN ('creative', 'tech')),
  featured BOOLEAN DEFAULT FALSE,
  
  -- Media
  thumbnail_url TEXT,
  thumbnail_aspect_ratio TEXT CHECK (thumbnail_aspect_ratio IN ('square', 'tall', 'story', 'wide', 'auto')),
  hero_media_url TEXT,
  hero_media_type TEXT CHECK (hero_media_type IN ('image', 'video')),
  
  -- Content
  description TEXT,
  challenge TEXT,
  solution TEXT,
  approach TEXT,
  
  -- Tech & Metrics
  tech_stack TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"label": "5X conversion", "description": "Conversion rate increase"}]
  
  -- Additional
  live_url TEXT,
  industry TEXT,
  project_date DATE,
  tags TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Media table (for case study galleries)
CREATE TABLE IF NOT EXISTS work_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_item_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  aspect_ratio TEXT,
  section TEXT CHECK (section IN ('creative', 'tech')),
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Story Highlights table
CREATE TABLE IF NOT EXISTS story_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  filter_tag TEXT, -- what to filter when clicked
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work indexes
CREATE INDEX IF NOT EXISTS idx_work_items_category ON work_items(category);
CREATE INDEX IF NOT EXISTS idx_work_items_status ON work_items(status);
CREATE INDEX IF NOT EXISTS idx_work_items_featured ON work_items(featured);
CREATE INDEX IF NOT EXISTS idx_work_items_created ON work_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_work_media_work_item ON work_media(work_item_id);
CREATE INDEX IF NOT EXISTS idx_work_media_section ON work_media(section);
CREATE INDEX IF NOT EXISTS idx_story_highlights_status ON story_highlights(status);
CREATE INDEX IF NOT EXISTS idx_story_highlights_order ON story_highlights(order_index);

-- ============================================================================
-- SECTION 4: BUSINESS APPS
-- ============================================================================

-- Business Apps table
CREATE TABLE IF NOT EXISTS business_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT,
  vimeo_id TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  case_study_url TEXT,
  live_demo_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  tech_stack TEXT[] DEFAULT '{}',
  target_market TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Apps indexes
CREATE INDEX IF NOT EXISTS idx_business_apps_active ON business_apps(is_active);
CREATE INDEX IF NOT EXISTS idx_business_apps_display_order ON business_apps(display_order);
CREATE INDEX IF NOT EXISTS idx_business_apps_created ON business_apps(created_at DESC);

-- ============================================================================
-- SECTION 5: CONTACT & COMMUNICATION
-- ============================================================================

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_service ON contact_submissions(service);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source VARCHAR(50) DEFAULT 'footer', -- 'footer', 'popup', etc.
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional data like IP, user agent, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_subscribers(created_at DESC);

-- ============================================================================
-- SECTION 6: ANALYTICS & TRACKING
-- ============================================================================

-- Site analytics table (for visitor counter)
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row with visitor_count = 0 (only if table is empty)
INSERT INTO site_analytics (visitor_count)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM site_analytics);

-- Site stats table (for viewer count - legacy)
CREATE TABLE IF NOT EXISTS site_stats (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  viewer_count INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial record if it doesn't exist
INSERT INTO site_stats (id, viewer_count)
VALUES ('main', 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SECTION 7: FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp (general purpose)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at for work items
CREATE OR REPLACE FUNCTION update_work_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at for newsletter
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at for site stats
CREATE OR REPLACE FUNCTION update_site_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at for business apps
CREATE OR REPLACE FUNCTION update_business_apps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist (to avoid conflicts)
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_work_items_updated_at ON work_items;
DROP TRIGGER IF EXISTS update_story_highlights_updated_at ON story_highlights;
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
DROP TRIGGER IF EXISTS update_site_analytics_updated_at ON site_analytics;
DROP TRIGGER IF EXISTS update_site_stats_updated_at ON site_stats;
DROP TRIGGER IF EXISTS update_business_apps_updated_at ON business_apps;

-- Triggers for portfolio
CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers for work items
CREATE TRIGGER update_work_items_updated_at
  BEFORE UPDATE ON work_items
  FOR EACH ROW
  EXECUTE FUNCTION update_work_updated_at();

CREATE TRIGGER update_story_highlights_updated_at
  BEFORE UPDATE ON story_highlights
  FOR EACH ROW
  EXECUTE FUNCTION update_work_updated_at();

-- Triggers for newsletter
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();

-- Triggers for analytics
CREATE TRIGGER update_site_analytics_updated_at
  BEFORE UPDATE ON site_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_stats_updated_at
  BEFORE UPDATE ON site_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_site_stats_updated_at();

-- Triggers for business apps
CREATE TRIGGER update_business_apps_updated_at
  BEFORE UPDATE ON business_apps
  FOR EACH ROW
  EXECUTE FUNCTION update_business_apps_updated_at();

-- ============================================================================
-- SECTION 8: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Published portfolio items are viewable by everyone" ON portfolio_items;
DROP POLICY IF EXISTS "Published work items are viewable by everyone" ON work_items;
DROP POLICY IF EXISTS "Work media is viewable by everyone" ON work_media;
DROP POLICY IF EXISTS "Active story highlights are viewable by everyone" ON story_highlights;
DROP POLICY IF EXISTS "Public read" ON business_apps;
DROP POLICY IF EXISTS "Public insert" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can read newsletter subscriptions" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can update newsletter subscriptions" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public read access" ON site_analytics;
DROP POLICY IF EXISTS "Site stats are viewable by everyone" ON site_stats;
DROP POLICY IF EXISTS "Anyone can update site stats" ON site_stats;
DROP POLICY IF EXISTS "Anyone can insert site stats" ON site_stats;

-- Portfolio Policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Published portfolio items are viewable by everyone"
  ON portfolio_items FOR SELECT
  USING (status = 'published');

-- Work Items Policies
CREATE POLICY "Published work items are viewable by everyone"
  ON work_items FOR SELECT
  USING (status = 'published');

CREATE POLICY "Work media is viewable by everyone"
  ON work_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM work_items 
      WHERE work_items.id = work_media.work_item_id 
      AND work_items.status = 'published'
    )
  );

CREATE POLICY "Active story highlights are viewable by everyone"
  ON story_highlights FOR SELECT
  USING (status = 'active');

-- Business Apps Policies
CREATE POLICY "Public read" 
  ON business_apps 
  FOR SELECT 
  USING (is_active = true);

-- Contact Submissions Policies
CREATE POLICY "Public insert" 
  ON contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Newsletter Policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read newsletter subscriptions"
  ON newsletter_subscribers
  FOR SELECT
  USING (true);

CREATE POLICY "Public can update newsletter subscriptions"
  ON newsletter_subscribers
  FOR UPDATE
  USING (true);

-- Analytics Policies
CREATE POLICY "Allow public read access"
  ON site_analytics
  FOR SELECT
  USING (true);

CREATE POLICY "Site stats are viewable by everyone"
  ON site_stats FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update site stats"
  ON site_stats FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can insert site stats"
  ON site_stats FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- SECTION 9: VIEWS (OPTIONAL)
-- ============================================================================

-- View for easy portfolio querying
CREATE OR REPLACE VIEW portfolio_items_view AS
SELECT 
  p.*,
  c.name as category_name,
  c.slug as category_slug
FROM portfolio_items p
LEFT JOIN categories c ON p.category_id = c.id;

-- ============================================================================
-- SECTION 10: NOTES & FUTURE ADMIN POLICIES
-- ============================================================================

-- Admin access policies (to be created after auth setup)
-- These will allow authenticated admin users to manage all data
-- 
-- Example admin policies (uncomment and customize after setting up auth):
--
-- CREATE POLICY "Admins can manage portfolio items"
--   ON portfolio_items
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');
--
-- CREATE POLICY "Admins can manage work items"
--   ON work_items
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');
--
-- CREATE POLICY "Admins can manage business apps"
--   ON business_apps
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');
--
-- CREATE POLICY "Admins can read contact submissions"
--   ON contact_submissions
--   FOR SELECT
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');
--
-- CREATE POLICY "Admins can manage newsletter subscriptions"
--   ON newsletter_subscribers
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');

-- ============================================================================
-- SCHEMA SETUP COMPLETE
-- ============================================================================
-- All tables, indexes, functions, triggers, and policies have been created.
-- The database is now ready for use.
-- ============================================================================
