-- MedQ Database Schema
-- Run this in the Supabase SQL editor to recreate the schema from scratch.

-- ============================================================
-- questions
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id            BIGSERIAL PRIMARY KEY,
  statement     TEXT NOT NULL,
  options       JSONB NOT NULL,          -- array of 4-6 strings
  correct_answer CHAR(1) NOT NULL,       -- 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
  explanation   TEXT NOT NULL,
  subject       TEXT NOT NULL,
  system        TEXT NOT NULL,
  topic         TEXT NOT NULL,
  correct_pct   NUMERIC,                 -- nullable
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- question_images
-- ============================================================
CREATE TABLE IF NOT EXISTS question_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,           -- path inside bucket "question-images"
  caption       TEXT,
  type          TEXT NOT NULL            -- 'exp_image' | 'inQuestion_image' | 'reference_image'
);

-- ============================================================
-- question_videos
-- ============================================================
CREATE TABLE IF NOT EXISTS question_videos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  video_url     TEXT NOT NULL,           -- YouTube URL
  start_time    INT,                     -- seconds
  end_time      INT,                     -- seconds
  caption       TEXT
);

-- ============================================================
-- Storage bucket (run in Supabase dashboard Storage tab)
-- ============================================================
-- Bucket name: question-images
-- Public: true (so images can be displayed via public URL)
