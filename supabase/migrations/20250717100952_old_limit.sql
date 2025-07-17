/*
  # Create marketplace listings table

  1. New Tables
    - `marketplace_listings`
      - `listing_id` (uuid, primary key)
      - `farmer_id` (uuid, foreign key to users)
      - `commodity` (text)
      - `quantity` (float)
      - `certification_required` (text)
      - `type` (enum: offer, request)
      - `location` (text)
      - `quality_grade` (text)
      - `price_per_unit` (float)
      - `expected_delivery` (date)
      - `status` (enum: open, matched, closed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `marketplace_listings` table
    - Add policies for authenticated users to read all listings
    - Add policies for users to manage their own listings
*/

-- Create custom types
CREATE TYPE listing_type AS ENUM ('offer', 'request');
CREATE TYPE listing_status AS ENUM ('open', 'matched', 'closed');

-- Create marketplace_listings table
CREATE TABLE IF NOT EXISTS marketplace_listings (
  listing_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  commodity text NOT NULL,
  quantity float NOT NULL,
  certification_required text,
  type listing_type NOT NULL DEFAULT 'offer',
  location text NOT NULL,
  quality_grade text,
  price_per_unit float,
  expected_delivery date,
  status listing_status DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view marketplace listings"
  ON marketplace_listings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own listings"
  ON marketplace_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Users can update their own listings"
  ON marketplace_listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = farmer_id);

CREATE POLICY "Users can delete their own listings"
  ON marketplace_listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = farmer_id);

-- Create trigger for updated_at
CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_commodity ON marketplace_listings(commodity);
CREATE INDEX IF NOT EXISTS idx_marketplace_location ON marketplace_listings(location);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_type ON marketplace_listings(type);
CREATE INDEX IF NOT EXISTS idx_marketplace_farmer_id ON marketplace_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_created_at ON marketplace_listings(created_at);