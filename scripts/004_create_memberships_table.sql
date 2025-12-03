-- Create community memberships table
create table if not exists public.community_memberships (
  user_id uuid references public.users(id) on delete cascade,
  community_id text references public.communities(id) on delete cascade,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, community_id)
);

alter table public.community_memberships enable row level security;

-- Allow anyone to read memberships
create policy "memberships_select_all"
  on public.community_memberships for select
  using (true);

-- Authenticated users can join communities
create policy "memberships_insert_authenticated"
  on public.community_memberships for insert
  with check (true);

-- Users can leave communities they're in
create policy "memberships_delete_own"
  on public.community_memberships for delete
  using (user_id = (select id from public.users where email = auth.jwt()->>'email'));
