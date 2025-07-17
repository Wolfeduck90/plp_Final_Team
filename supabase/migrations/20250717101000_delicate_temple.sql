/*
  # Create mentorship connections table

  1. New Tables
    - `mentorship_connections`
      - `connection_id` (uuid, primary key)
      - `mentor_id` (uuid, foreign key to users)
      - `mentee_id` (uuid, foreign key to users)
      - `status` (enum: pending, accepted, declined, completed)
      - `reviews` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `mentorship_connections` table
    - Add policies for mentors and mentees to manage their connections
*/

-- Create custom types
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'completed');

-- Create mentorship_connections table
CREATE TABLE IF NOT EXISTS mentorship_connections (
  connection_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  mentee_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  status connection_status DEFAULT 'pending',
  reviews jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (mentor_id != mentee_id)
);

-- Enable RLS
ALTER TABLE mentorship_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own connections"
  ON mentorship_connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Mentees can create connection requests"
  ON mentorship_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Mentors and mentees can update their connections"
  ON mentorship_connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Create trigger for updated_at
CREATE TRIGGER update_mentorship_connections_updated_at
  BEFORE UPDATE ON mentorship_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mentorship_mentor_id ON mentorship_connections(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_mentee_id ON mentorship_connections(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_status ON mentorship_connections(status);
CREATE INDEX IF NOT EXISTS idx_mentorship_created_at ON mentorship_connections(created_at);

-- Create unique constraint to prevent duplicate connections
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_mentorship_pair 
  ON mentorship_connections(mentor_id, mentee_id) 
  WHERE status IN ('pending', 'accepted');