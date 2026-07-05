# MedQ — Backend (Supabase)

This folder contains all Supabase-related backend assets: SQL migrations, seed data, and notes on project configuration.

## Project Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy the **Project URL** and **anon public key** from `Settings → API`
3. Paste them into `d:\MedQ\.env` (and `d:\MedQ\frontend\.env`):
   ```
   VITE_SUPABASE_URL=https://<your-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

## Database

Run `migrations/001_initial_schema.sql` in the **Supabase SQL Editor** to create all tables.

### Tables

| Table | Description |
|-------|-------------|
| `questions` | Core MCQ data |
| `question_images` | Images linked to questions (stored in Storage) |
| `question_videos` | YouTube video clips linked to questions |

## Storage

- Bucket name: **`question-images`**
- Create this bucket in **Storage → New bucket**
- Set it to **Public** so images can be displayed via public URL

## Auth

- Auth is handled via **Supabase Auth** (email + password)
- No signup flow — accounts are created manually in **Authentication → Users → Add user**
- Only a login page is provided in the frontend

## Row Level Security (RLS)

If RLS is enabled on your tables, make sure to create appropriate policies. For an internal admin panel with trusted users, you can either:
- Disable RLS on all three tables, or
- Add a policy that allows all operations for authenticated users
