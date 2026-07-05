# MedQ Admin Panel

Internal admin tool for managing the MedQ medical MCQ question bank. Built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

---

## Project Structure

```
MedQ/
├── frontend/          # React + Vite + Tailwind app
│   ├── src/
│   │   ├── components/    # Layout, Sidebar, TopBar, ProtectedRoute
│   │   ├── lib/           # Auth helpers
│   │   ├── pages/         # Login, Questions, QuestionDetail, AddQuestion
│   │   ├── types/         # Shared TypeScript interfaces
│   │   ├── supabase.ts    # Supabase client
│   │   └── App.tsx        # Router root
│   └── .env               # Vite environment variables (not committed)
├── backend/
│   ├── migrations/        # SQL schema for Supabase tables
│   └── README.md          # Supabase setup instructions
└── .env                   # Root env (source of truth)
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19 + TypeScript + Vite 6      |
| Styling    | Tailwind CSS v3                     |
| Routing    | react-router-dom v7                 |
| Backend    | Supabase (PostgreSQL + Auth + Storage) |
| Client     | @supabase/supabase-js               |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project with tables and storage bucket set up (see `backend/README.md`)

### 1. Clone and set up environment

Copy your Supabase credentials into both `.env` files:

**`.env`** (root — source of truth):
```
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

**`frontend/.env`** (copy of the above, needed for Vite):
```
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 2. Set up the database

Run `backend/migrations/001_initial_schema.sql` in the Supabase SQL Editor.

Create a **Storage bucket** named `question-images` and set it to **Public**.

### 3. Install and run

```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`.

---

## Features

- **Login** — Email + password via Supabase Auth
- **Questions List** — Table of all questions with subject, system, topic, correct %
- **Question Detail** — Full view with options, explanation, images, and YouTube video
- **Add Question** — Full form: statement, 4–6 options, explanation, classification, image uploads, video

---

## Auth

No self-signup. Accounts are created manually in the Supabase dashboard under **Authentication → Users → Add user**.
