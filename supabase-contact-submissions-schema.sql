-- Contact Submissions Schema
-- Run this in Supabase SQL Editor

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_service ON contact_submissions(service);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Public insert access (anyone can submit contact forms)
CREATE POLICY "Public insert" 
  ON contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Note: Admin policies for reading/managing submissions will be added after auth setup
-- CREATE POLICY "Admins can read contact submissions"
--   ON contact_submissions
--   FOR SELECT
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');

-- CREATE POLICY "Admins can delete contact submissions"
--   ON contact_submissions
--   FOR DELETE
--   USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'is_admin' = 'true');
