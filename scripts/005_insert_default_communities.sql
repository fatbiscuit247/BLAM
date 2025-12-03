-- Insert default music theme communities
insert into public.communities (id, name, description, icon, color, member_count, is_default)
values
  ('happy', 'Happy Vibes', 'Uplifting and joyful music', '😊', '#FCD34D', 1250, true),
  ('sad', 'Sad Songs', 'Melancholic and emotional tracks', '😢', '#60A5FA', 892, true),
  ('energetic', 'High Energy', 'Pump-up and workout music', '⚡', '#F87171', 2103, true),
  ('chill', 'Chill Beats', 'Relaxing and ambient sounds', '🌊', '#34D399', 1567, true),
  ('romantic', 'Love Songs', 'Romantic and heartfelt music', '💕', '#F472B6', 1023, true),
  ('angry', 'Rage & Release', 'Intense and powerful tracks', '🔥', '#EF4444', 678, true),
  ('nostalgic', 'Throwback Tracks', 'Classic hits and memories', '📻', '#A78BFA', 945, true),
  ('party', 'Party Mode', 'Dance and celebration music', '🎉', '#FB923C', 1834, true)
on conflict (id) do nothing;
