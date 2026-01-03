-- BCON Club Portfolio Management Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
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

-- Create indexes for performance
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories: Public read access
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Portfolio items: Public read access for published items
CREATE POLICY "Published portfolio items are viewable by everyone"
  ON portfolio_items FOR SELECT
  USING (status = 'published');

-- Portfolio items: Admin full access (will be set up after auth)
-- Note: You'll need to create a policy for authenticated admin users
-- This will be done after setting up authentication

-- Admin access policy (to be created after auth setup)
-- CREATE POLICY "Admins can manage portfolio items"
--   ON portfolio_items
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');

-- Sample data for testing (optional)
-- Uncomment to insert sample portfolio items

/*
INSERT INTO portfolio_items (
  title, slug, category_id, client_name, industry, 
  description, one_line_result, status, featured
) VALUES
  (
    'AI-Powered CRM System',
    'ai-crm-system',
    (SELECT id FROM categories WHERE slug = 'ai-business'),
    'TechCorp Inc.',
    'Technology',
    'Implemented AI-driven CRM that automates lead scoring and customer insights.',
    '98% efficiency gain in sales process',
    'published',
    true
  ),
  (
    'Brand Identity Redesign',
    'brand-identity-redesign',
    (SELECT id FROM categories WHERE slug = 'brand-marketing'),
    'Fashion Brand Co.',
    'Fashion',
    'Complete brand overhaul with new visual identity and marketing strategy.',
    '300% ROI increase in campaign performance',
    'published',
    true
  ),
  (
    'E-commerce Platform',
    'ecommerce-platform',
    (SELECT id FROM categories WHERE slug = 'business-apps'),
    'Retail Solutions',
    'Retail',
    'Built scalable e-commerce platform with AI-powered recommendations.',
    '250% conversion rate improvement',
    'published',
    true
  );
*/

-- View for easy querying (optional)
CREATE OR REPLACE VIEW portfolio_items_view AS
SELECT 
  p.*,
  c.name as category_name,
  c.slug as category_slug
FROM portfolio_items p
LEFT JOIN categories c ON p.category_id = c.id;

-- Grant permissions (adjust as needed)
-- GRANT SELECT ON portfolio_items_view TO anon;
-- GRANT SELECT ON portfolio_items_view TO authenticated;




