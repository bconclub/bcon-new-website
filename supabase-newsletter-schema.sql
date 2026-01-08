-- Newsletter Subscription Schema
-- Run this in Supabase SQL Editor

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

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_subscribers(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow public to read their own subscription status (by email)
-- Note: This is optional - you might want to restrict reads to admin only
CREATE POLICY "Public can read newsletter subscriptions"
  ON newsletter_subscribers
  FOR SELECT
  USING (true);

-- Policy: Allow updates (for unsubscribing) - can be restricted later
-- For now, allow public updates (you may want to add email verification)
CREATE POLICY "Public can update newsletter subscriptions"
  ON newsletter_subscribers
  FOR UPDATE
  USING (true);

-- Note: Admin policies for full management will be added after auth setup
-- CREATE POLICY "Admins can manage newsletter subscriptions"
--   ON newsletter_subscribers
--   FOR ALL
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');
