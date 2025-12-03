-- Create comments table for future use
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

-- Allow anyone to read comments
create policy "comments_select_all"
  on public.comments for select
  using (true);

-- Authenticated users can create comments
create policy "comments_insert_authenticated"
  on public.comments for insert
  with check (true);

-- Users can delete their own comments
create policy "comments_delete_own"
  on public.comments for delete
  using (user_id = (select id from public.users where email = auth.jwt()->>'email'));
