-- Visitor Counter Schema
-- Run this in Supabase SQL Editor

-- Create site_analytics table
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_site_analytics_updated_at
  BEFORE UPDATE ON site_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - allow public read, but only service role can write
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read
CREATE POLICY "Allow public read access"
  ON site_analytics
  FOR SELECT
  USING (true);

-- Policy: Only service role can update (this will be handled server-side)
-- Note: Updates will be done via service role key in API route
