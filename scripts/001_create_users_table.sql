-- Create users table (separate from Supabase auth.users)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

-- Allow anyone to read user profiles
create policy "users_select_all"
  on public.users for select
  using (true);

-- Users can only insert their own profile
create policy "users_insert_own"
  on public.users for insert
  with check (true);

-- Users can update their own profile  
create policy "users_update_own"
  on public.users for update
  using (id = (select id from public.users where email = auth.jwt()->>'email'));

-- Users can delete their own profile
create policy "users_delete_own"
  on public.users for delete
  using (id = (select id from public.users where email = auth.jwt()->>'email'));
