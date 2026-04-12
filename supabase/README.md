# VeRa — Supabase Setup

## 1. Create project
Go to https://supabase.com → New project.

## 2. Run schema
Dashboard → SQL Editor → New query → paste `schema.sql` → Run.

## 3. Configure Auth
Dashboard → Authentication → Settings:

- **Site URL**: `http://localhost:3000` (dev) / your prod URL
- **Redirect URLs**: add `http://localhost:3000/auth/callback`
- **Email confirmations**: Enable (required — INSEAD emails must be verified)
- **Secure email change**: Enable

## 4. Email domain restriction (server-enforced)
The app enforces `@insead.edu` on both:
- Client: `isInseadEmail()` in `src/lib/utils.ts`
- Server: middleware checks session on every request

For extra hardening, add a Supabase Auth Hook (Dashboard → Auth → Hooks):
```sql
-- Custom access token hook — block non-insead emails at DB level
create or replace function auth.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql as $$
declare
  email text := event->>'email';
begin
  if email not ilike '%@insead.edu' then
    raise exception 'Only @insead.edu emails are allowed';
  end if;
  return event;
end;
$$;
```

## 5. Add env vars
Copy `.env.example` → `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

All values are in Dashboard → Settings → API.
