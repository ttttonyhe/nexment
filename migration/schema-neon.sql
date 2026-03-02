-- Nexment: Neon database table schema
-- Run this in the Neon SQL Editor to create the comments table

CREATE TABLE IF NOT EXISTS nexment_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id BIGINT NOT NULL,
  identifier TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  tag TEXT,
  reply BIGINT,
  has_replies BOOLEAN DEFAULT FALSE,
  email_when_replied BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nexment_comments_identifier ON nexment_comments(identifier);
CREATE INDEX IF NOT EXISTS idx_nexment_comments_reply ON nexment_comments(reply);
CREATE INDEX IF NOT EXISTS idx_nexment_comments_created_at ON nexment_comments(created_at DESC);

-- Row-Level Security: enable and allow public access for the comment system
ALTER TABLE nexment_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON nexment_comments
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON nexment_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON nexment_comments
  FOR UPDATE USING (true);

GRANT USAGE ON SCHEMA public TO authenticated, anonymous;
GRANT SELECT, INSERT, UPDATE ON nexment_comments TO authenticated, anonymous;
