/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `notification_id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (enum: match_alert, forum_reply, mentorship_request, etc.)
      - `title` (text)
      - `message` (text)
      - `read_status` (boolean, default false)
      - `priority` (enum: low, medium, high)
      - `metadata` (jsonb for additional data)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Add policies for users to manage their own notifications
*/

-- Create custom types
CREATE TYPE notification_type AS ENUM (
  'match_alert', 
  'forum_reply', 
  'mentorship_request', 
  'mentorship_accepted',
  'message_received',
  'listing_expired',
  'market_alert',
  'quality_assessment_complete',
  'system_announcement'
);

CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high');

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  notification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read_status boolean DEFAULT false,
  priority notification_priority DEFAULT 'medium',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON notifications(read_status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);