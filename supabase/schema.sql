-- Dance Flow: run once in the Supabase SQL editor.
create table if not exists public.dance_flow_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.dance_flow_data enable row level security;
drop policy if exists "dance_flow_select_own" on public.dance_flow_data;
create policy "dance_flow_select_own" on public.dance_flow_data for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "dance_flow_insert_own" on public.dance_flow_data;
create policy "dance_flow_insert_own" on public.dance_flow_data for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "dance_flow_update_own" on public.dance_flow_data;
create policy "dance_flow_update_own" on public.dance_flow_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
