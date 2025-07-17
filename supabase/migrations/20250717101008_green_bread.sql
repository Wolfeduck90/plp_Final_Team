/*
  # Create messages table for communication

  1. New Tables
    - `messages`
      - `message_id` (uuid, primary key)
      - `sender_id` (uuid, foreign key to users)
      - `receiver_id` (uuid, foreign key to users)
      - `content` (text)
      - `type` (enum: buyer_farmer, mentorship, general)
      - `read_status` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for users to read/send their own messages
*/

-- Create custom types
CREATE TYPE message_type AS ENUM ('buyer_farmer', 'mentorship', 'general');

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  message_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content text NOT NULL,
  type message_type DEFAULT 'general',
  read_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (sender_id != receiver_id)
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status of received messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_read_status ON messages(read_status);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);