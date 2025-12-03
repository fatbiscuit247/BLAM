-- Create posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  content text,
  song_title text not null,
  song_artist text not null,
  song_album text,
  album_art text,
  preview_url text,
  spotify_url text,
  theme text,
  upvotes integer default 0,
  downvotes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

-- Allow anyone to read posts
create policy "posts_select_all"
  on public.posts for select
  using (true);

-- Authenticated users can create posts
create policy "posts_insert_authenticated"
  on public.posts for insert
  with check (true);

-- Users can update their own posts
create policy "posts_update_own"
  on public.posts for update
  using (user_id = (select id from public.users where email = auth.jwt()->>'email'));

-- Users can delete their own posts
create policy "posts_delete_own"
  on public.posts for delete
  using (user_id = (select id from public.users where email = auth.jwt()->>'email'));
