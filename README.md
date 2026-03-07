# Pariksha Samachar

Minimalist and classic student platform with:

- Landing page with top-right login
- Signup/login with mandatory placeholders
- Admin vs student route split from login
- Exam-based communities
- Forum posts/comments + community chat
- Sidebar with previous exam notifications
- Admin analytics and CSV export

## Run locally

1. Copy `.env.example` to `.env.local` and update values.
2. Install dependencies:
   - `npm install`
3. Start dev server:
   - `npm run dev`

## Default admin login

- Email: `admin@pariksha.local`
- Password: `Admin@12345`

Override with env variables in `.env.local`.

## Supabase migrations

SQL files are available in:

- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_rls.sql`
