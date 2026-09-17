-- Tighten anonymous access to `sessions` and `user_phrases`.
--
-- Problem: the anonymous SELECT policies on these two tables (added so game.html
-- can look up a session's host and that host's phrases without requiring players
-- to sign in) are unconditional. Postgres RLS has no concept of "allow reading
-- this row only if the caller already knows its ID" — a policy either allows a
-- row or it doesn't, regardless of what filter the request used. So anyone
-- holding the public anon key (embedded in config.js, sent by every visitor's
-- browser) can call the raw REST endpoints with NO filter at all and dump every
-- row in both tables: every host's 24 phrases, every host's user id, and every
-- session ever created.
--
-- Fix: remove anonymous SELECT entirely, and replace it with one narrow
-- SECURITY DEFINER function that takes a single session id and returns only
-- that session's phrases. A function call can't be used to ask for "everything"
-- the way an unfiltered table request can — its parameter list is fixed by
-- Postgres itself.
--
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).
-- Safe to run even if you're not sure of your current policy names — it drops
-- every existing policy on these two tables first and rebuilds them explicitly,
-- so the end state is deterministic regardless of what's there now.

-- 1. Drop every existing RLS policy on both tables.
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('sessions', 'user_phrases')
  loop
    execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

-- 2. Re-create the policies signed-in hosts still need for their own dashboard.
--    (unchanged in spirit from before — a host can only touch their own rows)

create policy "hosts_select_own_phrases"
  on public.user_phrases for select
  to authenticated
  using (user_id = auth.uid());

create policy "hosts_insert_own_phrases"
  on public.user_phrases for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "hosts_update_own_phrases"
  on public.user_phrases for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "hosts_insert_own_sessions"
  on public.sessions for insert
  to authenticated
  with check (host_id = auth.uid());

-- Required so dashboard.html's `.insert(...).select().single()` after Start
-- Session can read back the row it just created (PostgREST applies the SELECT
-- policy, not the INSERT policy, when returning the inserted row).
create policy "hosts_select_own_sessions"
  on public.sessions for select
  to authenticated
  using (host_id = auth.uid());

-- Deliberately no anon SELECT policy on either table anymore. Anonymous
-- players get access only through the function below.

-- 3. The narrow lookup function: given a session id, return that session's
--    board — nothing else is reachable through this interface.
create or replace function public.get_session_phrases(p_session_id uuid)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'session_found', exists(select 1 from public.sessions where id = p_session_id),
    'phrases', (
      select up.phrases
      from public.sessions s
      join public.user_phrases up on up.user_id = s.host_id
      where s.id = p_session_id
      limit 1
    )
  );
$$;

grant execute on function public.get_session_phrases(uuid) to anon, authenticated;
