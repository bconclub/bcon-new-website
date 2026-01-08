-- Viewer Count Schema for BCON Club
-- Run this in Supabase SQL Editor

-- Site stats table for tracking viewer count
CREATE TABLE IF NOT EXISTS site_stats (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  viewer_count INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial record if it doesn't exist
INSERT INTO site_stats (id, viewer_count)
VALUES ('main', 0)
ON CONFLICT (id) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_site_stats_updated_at
  BEFORE UPDATE ON site_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_site_stats_updated_at();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Site stats are viewable by everyone"
  ON site_stats FOR SELECT
  USING (true);

-- Public update access (for incrementing count)
CREATE POLICY "Anyone can update site stats"
  ON site_stats FOR UPDATE
  USING (true);

-- Public insert access (for initial creation)
CREATE POLICY "Anyone can insert site stats"
  ON site_stats FOR INSERT
  WITH CHECK (true);
