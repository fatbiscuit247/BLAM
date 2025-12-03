-- Update all posts with null upvotes/downvotes to 0
UPDATE posts 
SET upvotes = COALESCE(upvotes, 0),
    downvotes = COALESCE(downvotes, 0)
WHERE upvotes IS NULL OR downvotes IS NULL;

-- Add NOT NULL constraints and defaults for future posts
ALTER TABLE posts 
ALTER COLUMN upvotes SET DEFAULT 0,
ALTER COLUMN upvotes SET NOT NULL;

ALTER TABLE posts 
ALTER COLUMN downvotes SET DEFAULT 0,
ALTER COLUMN downvotes SET NOT NULL;
