-- migration: 20240422165200_initial_schema.sql
-- description: Initial database schema setup with users, snacks, and user_favourites tables
-- author: AI Assistant
-- date: 2024-04-22

-- create custom enum types
create type snack_type_enum as enum ('słodka', 'słona', 'lekka', 'sycąca');
create type location_enum as enum ('praca', 'dom', 'sklep', 'poza domem');
create type goal_enum as enum ('utrzymanie', 'redukcja', 'przyrost');
create type preferred_diet_enum as enum ('standard', 'wegetariańska', 'wegańska', 'bezglutenowa');

-- this table is managed by supabase auth but we still need to enable rls
alter table auth.users enable row level security;

-- create snacks table
create table public.snacks (
    id serial primary key,
    title text not null,
    description text,
    ingredients text,
    instructions text,
    snack_type snack_type_enum not null,
    location location_enum not null,
    goal goal_enum not null,
    preferred_diet preferred_diet_enum not null,
    kcal numeric not null check (kcal >= 0),
    protein numeric not null check (protein >= 0),
    fat numeric not null check (fat >= 0),
    carbohydrates numeric not null check (carbohydrates >= 0),
    fibre numeric not null check (fibre >= 0),
    created_at timestamp not null default current_timestamp
);

-- enable rls on snacks table
alter table public.snacks enable row level security;

-- create rls policies for snacks table
-- allow anyone to view snacks
create policy "snacks_select_policy_anon" 
on public.snacks for select 
to anon
using (true);

create policy "snacks_select_policy_auth" 
on public.snacks for select 
to authenticated
using (true);

-- only allow authenticated users to insert snacks
create policy "snacks_insert_policy" 
on public.snacks for insert 
to authenticated
with check (true);

-- create user_favourites table
create table public.user_favourites (
    user_id uuid not null references auth.users(id) on delete cascade,
    snack_id integer not null references public.snacks(id) on delete cascade,
    added_at timestamp not null default current_timestamp,
    primary key (user_id, snack_id)
);

-- enable rls on user_favourites table
alter table public.user_favourites enable row level security;

-- create rls policies for user_favourites table
-- users can only view their own favourites
create policy "user_favourites_select_policy" 
on public.user_favourites for select 
to authenticated
using (auth.uid() = user_id);

-- users can only add their own favourites
create policy "user_favourites_insert_policy" 
on public.user_favourites for insert 
to authenticated
with check (auth.uid() = user_id);

-- users can only delete their own favourites
create policy "user_favourites_delete_policy" 
on public.user_favourites for delete 
to authenticated
using (auth.uid() = user_id);

-- create indexes to improve query performance
create index idx_snacks_snack_type on public.snacks(snack_type);
create index idx_snacks_location on public.snacks(location);
create index idx_snacks_goal on public.snacks(goal);
create index idx_snacks_preferred_diet on public.snacks(preferred_diet); 