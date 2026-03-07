# Deploy Pariksha Samachar to Vercel + Supabase

This guide walks you through making the app production-ready with Supabase and Vercel.

---

## 1. Supabase Setup

### Create a project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose org, name (e.g. `pariksha-samachar`), database password, region
4. Wait for the project to be created

### Create the database schema

1. In Supabase: **SQL Editor** → **New query**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

### Get your keys

1. **Project Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key (under Project API keys) → `SUPABASE_SERVICE_ROLE_KEY`  
     ⚠️ **Never** expose this key in client-side code. Use it only in server-side API routes.

### Initial admin config (optional)

To set up your admin account in Supabase:

```sql
-- Run in Supabase SQL Editor. Generate hash at https://bcrypt-generator.com/ (rounds: 10)
INSERT INTO admin_config (name, email, password_hash)
VALUES ('Admin', 'your-admin@example.com', '$2a$10$YourBcryptHashHere');
```

Or use environment variables (see step 3) for the default admin.

---

## 2. Vercel Setup

### Deploy from GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel will detect Next.js and configure the build

### Or deploy from CLI

```bash
npm i -g vercel
vercel login
vercel
```

---

## 3. Environment Variables

In Vercel: **Project** → **Settings** → **Environment Variables** → add:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | From Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` | From Supabase (secret) |
| `BREVO_API_KEY` | `xkeysib-xxx` | From Brevo (for email OTP & notifications) |
| `BREVO_FROM_EMAIL` | `noreply@yourdomain.com` | Sender email (optional) |
| `BREVO_FROM_NAME` | `Pariksha Samachar` | Sender name (optional) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | For metadata, sitemap |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `admin@pariksha.local` | Fallback admin (optional) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | `YourSecurePassword` | Fallback admin (optional) |
| `BREVO_API_KEY` | `xkeysib-xxx` | For email OTP & notifications (optional) |
| `BREVO_FROM_EMAIL` | `noreply@yourdomain.com` | Sender email (optional) |
| `BREVO_FROM_NAME` | `Pariksha Samachar` | Sender name (optional) |

For **local development**, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 4. Production Checklist

- [ ] Run `supabase/schema.sql` in Supabase SQL Editor
- [ ] Add all environment variables in Vercel
- [ ] Create admin account (via SQL or env vars)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production URL
- [ ] Redeploy after changing env vars
- [ ] Add custom domain in Vercel (optional)

---

## 5. How It Works

- **Auth**: When `NEXT_PUBLIC_SUPABASE_URL` is set, login and signup use `/api/auth/login` and `/api/auth/signup`, which write to Supabase.
- **Passwords**: Stored only as bcrypt hashes in Supabase.
- **Session**: Stored in `localStorage` on the client (userId, email, role).
- **Data**: With Supabase configured, new signups and logins use the database. Profiles, chat, and notifications for existing flows still use local storage until you complete the full data migration.

---

## 6. Admin & Moderators with Supabase

Admin and moderator accounts must exist in Supabase. Two options:

**Option A – SQL (recommended for first-time setup)**

```sql
-- Admin (generate hash at https://bcrypt-generator.com/)
INSERT INTO admin_config (name, email, password_hash)
VALUES ('Admin', 'admin@example.com', '$2a$10$YourBcryptHashHere');

-- Moderator
INSERT INTO moderators (name, email, password_hash)
VALUES ('Mod Name', 'mod@example.com', '$2a$10$YourBcryptHashHere');
```

**Option B – Environment variables**

Set `NEXT_PUBLIC_ADMIN_EMAIL` and `NEXT_PUBLIC_ADMIN_PASSWORD`. This serves as the fallback admin when the `admin_config` table is empty.

## 7. Migrating Existing Data

If you have data in local storage:

1. Export from the app (e.g. via Admin CSV export)
2. Use Supabase SQL Editor or a script to insert into the new tables
3. Ensure `password_hash` is bcrypt hashed for any existing users

---

## 8. Optional: Custom Domain

1. Vercel → Project → Settings → Domains
2. Add your domain (e.g. `parikshasamachar.com`)
3. Update DNS as instructed
4. Set `NEXT_PUBLIC_SITE_URL` to your domain
