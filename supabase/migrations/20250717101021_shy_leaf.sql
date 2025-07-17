/*
  # Create forum posts and content moderation tables

  1. New Tables
    - `forum_posts`
      - `post_id` (uuid, primary key)
      - `author_id` (uuid, foreign key to users)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `tags` (text array)
      - `upvotes` (integer, default 0)
      - `downvotes` (integer, default 0)
      - `moderation_score` (float)
      - `moderation_status` (enum: pending, approved, hidden, flagged)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `forum_comments`
      - `comment_id` (uuid, primary key)
      - `post_id` (uuid, foreign key to forum_posts)
      - `author_id` (uuid, foreign key to users)
      - `content` (text)
      - `upvotes` (integer, default 0)
      - `moderation_score` (float)
      - `moderation_status` (enum)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for content creation and moderation
*/

-- Create custom types
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'hidden', 'flagged', 'promoted');

-- Create forum_posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  post_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  moderation_score float DEFAULT 0.5,
  moderation_status moderation_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum_comments table
CREATE TABLE IF NOT EXISTS forum_comments (
  comment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES forum_posts(post_id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content text NOT NULL,
  upvotes integer DEFAULT 0,
  moderation_score float DEFAULT 0.5,
  moderation_status moderation_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

-- Forum posts policies
CREATE POLICY "Anyone can view approved forum posts"
  ON forum_posts
  FOR SELECT
  TO authenticated
  USING (moderation_status IN ('approved', 'promoted'));

CREATE POLICY "Users can create forum posts"
  ON forum_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON forum_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Forum comments policies
CREATE POLICY "Anyone can view approved comments"
  ON forum_comments
  FOR SELECT
  TO authenticated
  USING (moderation_status = 'approved');

CREATE POLICY "Users can create comments"
  ON forum_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Create triggers for updated_at
CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_moderation_status ON forum_posts(moderation_status);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_author_id ON forum_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_moderation_status ON forum_comments(moderation_status);