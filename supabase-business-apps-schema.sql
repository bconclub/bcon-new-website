-- Business Apps Schema
-- Run this in Supabase SQL Editor

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_apps_active ON business_apps(is_active);
CREATE INDEX IF NOT EXISTS idx_business_apps_display_order ON business_apps(display_order);
CREATE INDEX IF NOT EXISTS idx_business_apps_created ON business_apps(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_business_apps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_business_apps_updated_at
  BEFORE UPDATE ON business_apps
  FOR EACH ROW
  EXECUTE FUNCTION update_business_apps_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE business_apps ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access for active apps
CREATE POLICY "Public read" 
  ON business_apps 
  FOR SELECT 
  USING (is_active = true);

-- Note: Admin policies for full management will be added after auth setup
-- CREATE POLICY "Admins can manage business apps"
--   ON business_apps
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');
