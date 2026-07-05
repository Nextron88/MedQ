# MedQ Admin Panel

Internal admin tool for managing the MedQ medical MCQ question bank. Built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

---

## Project Structure

```
MedQ/
├── frontend/                  # React + Vite + Tailwind app
│   ├── src/
│   │   ├── components/        # Layout, Sidebar, TopBar, ProtectedRoute
│   │   ├── lib/               # Auth helpers
│   │   ├── pages/
│   │   │   ├── Login.tsx          # Auth page
│   │   │   ├── Questions.tsx      # Questions list/table
│   │   │   ├── QuestionDetail.tsx # Full question view
│   │   │   ├── AddQuestion.tsx    # Create new question
│   │   │   └── EditQuestion.tsx   # Edit existing question
│   │   ├── types/             # Shared TypeScript interfaces
│   │   ├── supabase.ts        # Supabase client
│   │   └── App.tsx            # Router root
│   └── .env                   # Vite environment variables (not committed)
├── backend/
│   ├── migrations/            # SQL schema for Supabase tables
│   └── README.md              # Supabase setup instructions
└── .env                       # Root env (source of truth, not committed)
```

---

## Tech Stack

| Layer      | Technology                             |
|------------|----------------------------------------|
| Frontend   | React 19 + TypeScript + Vite 6         |
| Styling    | Tailwind CSS v3                        |
| Routing    | react-router-dom v7                    |
| Backend    | Supabase (PostgreSQL + Auth + Storage) |
| Client     | @supabase/supabase-js                  |

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

Create a **Storage bucket** named `question_images` and set it to **Public**.

### 3. Install and run

```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`.

---

## Features

- **Login** — Email + password via Supabase Auth (no self-signup)
- **Questions List** — Searchable/filterable table of all MCQs with subject, system, topic, and correct %
- **Question Detail** — Full read-only view with answer options, explanation, categorised images, and embedded YouTube video
- **Add Question** — Full form to create a question: statement, 4–6 lettered options, correct answer, explanation, subject/system/topic classification, multiple image uploads (with type & caption), and YouTube video with start/end timestamps
- **Edit Question** — Full edit form pre-populated with existing data; supports updating text, adding/removing/re-captioning images, changing image types, and updating or removing the linked video

---

## Routes

| Path                   | Page            | Protected |
|------------------------|-----------------|-----------|
| `/login`               | Login           | No        |
| `/questions`           | Questions List  | Yes       |
| `/questions/:id`       | Question Detail | Yes       |
| `/questions/:id/edit`  | Edit Question   | Yes       |
| `/add-question`        | Add Question    | Yes       |

---

## Auth

No self-signup. Accounts are created manually in the Supabase dashboard under **Authentication → Users → Add user**.

---

## Database Tables

| Table              | Description                                   |
|--------------------|-----------------------------------------------|
| `questions`        | Core MCQ data (statement, options, answer, classification) |
| `question_images`  | Images linked to a question (type, caption, storage path) |
| `question_videos`  | YouTube video linked to a question (url, start/end time, caption) |

### Image Types

| Value             | Label               |
|-------------------|---------------------|
| `inQuestion_image`| In-Question Image   |
| `exp_image`       | Explanation Image   |
| `reference_image` | Reference Image     |
