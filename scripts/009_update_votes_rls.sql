-- Drop existing restrictive RLS policies on votes table
DROP POLICY IF EXISTS votes_insert_own ON votes;
DROP POLICY IF EXISTS votes_delete_own ON votes;
DROP POLICY IF EXISTS votes_update_own ON votes;
DROP POLICY IF EXISTS votes_select_all ON votes;

-- Create permissive RLS policies that allow all operations
-- Since we're using custom username-based auth without Supabase Auth,
-- we can't check auth.uid(), so we allow all authenticated operations

-- Allow anyone to select votes (needed to display vote counts and user vote status)
CREATE POLICY votes_select_all ON votes
  FOR SELECT
  USING (true);

-- Allow anyone to insert votes (application logic handles user validation)
CREATE POLICY votes_insert_all ON votes
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update votes (application logic ensures users can only update their own)
CREATE POLICY votes_update_all ON votes
  FOR UPDATE
  USING (true);

-- Allow anyone to delete votes (application logic ensures users can only delete their own)
CREATE POLICY votes_delete_all ON votes
  FOR DELETE
  USING (true);
