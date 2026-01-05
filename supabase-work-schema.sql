-- Work Items and Case Studies Schema
-- Run this in Supabase SQL Editor after the main schema

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_work_items_category ON work_items(category);
CREATE INDEX IF NOT EXISTS idx_work_items_status ON work_items(status);
CREATE INDEX IF NOT EXISTS idx_work_items_featured ON work_items(featured);
CREATE INDEX IF NOT EXISTS idx_work_items_created ON work_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_work_media_work_item ON work_media(work_item_id);
CREATE INDEX IF NOT EXISTS idx_work_media_section ON work_media(section);
CREATE INDEX IF NOT EXISTS idx_story_highlights_status ON story_highlights(status);
CREATE INDEX IF NOT EXISTS idx_story_highlights_order ON story_highlights(order_index);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_work_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_work_items_updated_at
  BEFORE UPDATE ON work_items
  FOR EACH ROW
  EXECUTE FUNCTION update_work_updated_at();

CREATE TRIGGER update_story_highlights_updated_at
  BEFORE UPDATE ON story_highlights
  FOR EACH ROW
  EXECUTE FUNCTION update_work_updated_at();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_highlights ENABLE ROW LEVEL SECURITY;

-- Work items: Public read access for published items
CREATE POLICY "Published work items are viewable by everyone"
  ON work_items FOR SELECT
  USING (status = 'published');

-- Work media: Public read access (linked to published work items)
CREATE POLICY "Work media is viewable by everyone"
  ON work_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM work_items 
      WHERE work_items.id = work_media.work_item_id 
      AND work_items.status = 'published'
    )
  );

-- Story highlights: Public read access for active items
CREATE POLICY "Active story highlights are viewable by everyone"
  ON story_highlights FOR SELECT
  USING (status = 'active');

-- Admin access policies (to be created after auth setup)
-- These will allow authenticated admin users to manage all data
-- CREATE POLICY "Admins can manage work items"
--   ON work_items
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');

-- CREATE POLICY "Admins can manage work media"
--   ON work_media
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');

-- CREATE POLICY "Admins can manage story highlights"
--   ON story_highlights
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');



