/*
  # Create crop quality assessments table

  1. New Tables
    - `crop_quality_assessments`
      - `assessment_id` (uuid, primary key)
      - `farmer_id` (uuid, foreign key to users)
      - `crop_type` (text)
      - `image_url` (text, encrypted)
      - `quality_grade` (text)
      - `confidence_score` (float)
      - `visual_indicators` (jsonb)
      - `recommendations` (text array)
      - `market_value` (text)
      - `shelf_life` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `crop_quality_assessments` table
    - Add policies for farmers to manage their assessments
*/

-- Create crop_quality_assessments table
CREATE TABLE IF NOT EXISTS crop_quality_assessments (
  assessment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  image_url text NOT NULL,
  quality_grade text NOT NULL,
  confidence_score float NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  visual_indicators jsonb DEFAULT '{}'::jsonb,
  recommendations text[] DEFAULT '{}',
  market_value text,
  shelf_life text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE crop_quality_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Farmers can view their own assessments"
  ON crop_quality_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can create assessments"
  ON crop_quality_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crop_assessments_farmer_id ON crop_quality_assessments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_assessments_crop_type ON crop_quality_assessments(crop_type);
CREATE INDEX IF NOT EXISTS idx_crop_assessments_quality_grade ON crop_quality_assessments(quality_grade);
CREATE INDEX IF NOT EXISTS idx_crop_assessments_created_at ON crop_quality_assessments(created_at);