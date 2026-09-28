-- =====================================================================
-- Darshan Portfolio — Supabase Database Setup Script
-- =====================================================================
-- Run this in your Supabase Project -> SQL Editor to create the portfolio table
-- and configure instant read/write permissions.

-- 1. Create the portfolio table to store CMS JSON data
create table if not exists public.portfolio_data (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.portfolio_data enable row level security;

-- 3. Policy: Allow public read access to portfolio data
create policy "Allow public read access on portfolio_data"
  on public.portfolio_data
  for select
  using (true);

-- 4. Policy: Allow insert and update
create policy "Allow public write on portfolio_data"
  on public.portfolio_data
  for all
  using (true)
  with check (true);

-- 5. Optional: Enable Realtime on portfolio_data (if desired)
alter publication supabase_realtime add table public.portfolio_data;
