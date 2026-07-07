-- ============================================================
--  Chrysa AI — Supabase schema
--  Run this once in Supabase → SQL Editor → New query → Run.
-- ============================================================

-- 1) Sign-ups table -------------------------------------------------
create table if not exists public.signups (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,
  email       text,
  company     text,
  role        text,
  team_size   text,
  regions     text,
  challenge   text,
  method      text default 'email'
);

-- 2) Row Level Security --------------------------------------------
--    Allow the public (anon) key to INSERT sign-ups, but NOT read
--    them. You read sign-ups from the Supabase dashboard (Table
--    Editor), which uses your privileged service key.
alter table public.signups enable row level security;

create policy "anon can insert signups"
  on public.signups
  for insert
  to anon
  with check (true);

-- (No select policy for anon = the public cannot read the list.)

-- ============================================================
--  Done. Project Settings → API gives you:
--    • Project URL   → paste into SUPABASE_URL in auth.js
--    • anon public   → paste into SUPABASE_ANON in auth.js
-- ============================================================
