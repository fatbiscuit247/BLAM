-- Create votes table to track user votes on posts
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  vote_type text check (vote_type in ('up', 'down')) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
);

-- Enable Row Level Security
alter table votes enable row level security;

-- Allow users to view all votes
create policy "votes_select_all"
  on votes for select
  to authenticated
  using (true);

-- Allow authenticated users to insert their own votes
create policy "votes_insert_own"
  on votes for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow users to update their own votes
create policy "votes_update_own"
  on votes for update
  to authenticated
  using (auth.uid() = user_id);

-- Allow users to delete their own votes
create policy "votes_delete_own"
  on votes for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create index for faster lookups
create index if not exists votes_post_id_idx on votes(post_id);
create index if not exists votes_user_id_idx on votes(user_id);
