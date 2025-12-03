-- Add song fields to comments table
alter table public.comments
  add column if not exists song_title text,
  add column if not exists song_artist text,
  add column if not exists song_album text,
  add column if not exists album_art text,
  add column if not exists preview_url text,
  add column if not exists spotify_url text;
