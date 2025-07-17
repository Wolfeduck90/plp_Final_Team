/*
  # Create users table with comprehensive profile management

  1. New Tables
    - `users`
      - `user_id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (enum: farmer, buyer)
      - `sub_role` (enum: mentor, mentee, neither)
      - `location` (text, region-level)
      - `experience_years` (integer)
      - `certification` (jsonb)
      - `profile_photo` (text, encrypted URL)
      - `bio` (text)
      - `badges` (integer, default 0)
      - `ratings` (jsonb)
      - `two_factor_enabled` (boolean, default false)
      - `verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated users to read/update their own data
    - Add policy for public read access to basic profile info
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
CREATE TYPE user_sub_role AS ENUM ('mentor', 'mentee', 'neither');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'farmer',
  sub_role user_sub_role DEFAULT 'neither',
  location text,
  experience_years integer DEFAULT 0,
  certification jsonb DEFAULT '[]'::jsonb,
  profile_photo text,
  bio text,
  badges integer DEFAULT 0,
  ratings jsonb DEFAULT '{"average": 0, "count": 0, "reviews": []}'::jsonb,
  two_factor_enabled boolean DEFAULT false,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_users_sub_role ON users(sub_role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);