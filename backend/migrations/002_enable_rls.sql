-- MedQ RLS Security Policies
-- Run this in the Supabase SQL Editor AFTER running 001_initial_schema.sql
--
-- These policies lock down all 3 tables so that ONLY authenticated
-- users (your admin accounts) can read or write any data.
-- Unauthenticated requests (even with the anon key) are blocked.

-- ============================================================
-- questions
-- ============================================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated admins have full access to questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- question_images
-- ============================================================
ALTER TABLE question_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated admins have full access to question_images"
  ON question_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- question_videos
-- ============================================================
ALTER TABLE question_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated admins have full access to question_videos"
  ON question_videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
