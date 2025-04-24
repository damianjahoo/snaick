-- migration: 20240422165300_disable_policies.sql
-- description: Disable all RLS policies on snacks and user_favourites tables
-- author: AI Assistant
-- date: 2024-04-22

-- disable policies on snacks table
drop policy if exists "snacks_select_policy_anon" on public.snacks;
drop policy if exists "snacks_select_policy_auth" on public.snacks;
drop policy if exists "snacks_insert_policy" on public.snacks;

-- disable policies on user_favourites table
drop policy if exists "user_favourites_select_policy" on public.user_favourites;
drop policy if exists "user_favourites_insert_policy" on public.user_favourites;
drop policy if exists "user_favourites_delete_policy" on public.user_favourites;

-- note: this migration only removes the policies
-- row level security remains enabled on both tables
-- tables remain secure until new policies are defined 