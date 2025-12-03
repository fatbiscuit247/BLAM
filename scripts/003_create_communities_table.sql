-- Create communities table
create table if not exists public.communities (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  color text not null,
  member_count integer default 0,
  is_default boolean default false,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.communities enable row level security;

-- Allow anyone to read communities
create policy "communities_select_all"
  on public.communities for select
  using (true);

-- Authenticated users can create communities
create policy "communities_insert_authenticated"
  on public.communities for insert
  with check (true);

-- Users can update communities they created
create policy "communities_update_own"
  on public.communities for update
  using (created_by = (select id from public.users where email = auth.jwt()->>'email'));

-- Users can delete communities they created (not default ones)
create policy "communities_delete_own"
  on public.communities for delete
  using (created_by = (select id from public.users where email = auth.jwt()->>'email') and is_default = false);
