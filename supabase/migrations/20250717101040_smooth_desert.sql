/*
  # Create market insights and analytics tables

  1. New Tables
    - `market_insights`
      - `insight_id` (uuid, primary key)
      - `region` (text)
      - `crop` (text)
      - `status` (enum: oversupplied, high_demand, stable, growing_demand)
      - `price_change` (float)
      - `volume` (integer)
      - `trend` (enum: up, down, stable)
      - `recommendation` (text)
      - `created_at` (timestamp)

    - `platform_analytics`
      - `analytics_id` (uuid, primary key)
      - `metric_name` (text)
      - `metric_value` (jsonb)
      - `date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read insights
*/

-- Create custom types
CREATE TYPE market_status AS ENUM ('oversupplied', 'high_demand', 'stable', 'growing_demand');
CREATE TYPE market_trend AS ENUM ('up', 'down', 'stable');

-- Create market_insights table
CREATE TABLE IF NOT EXISTS market_insights (
  insight_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL,
  crop text NOT NULL,
  status market_status NOT NULL,
  price_change float DEFAULT 0,
  volume integer DEFAULT 0,
  trend market_trend DEFAULT 'stable',
  recommendation text,
  created_at timestamptz DEFAULT now()
);

-- Create platform_analytics table
CREATE TABLE IF NOT EXISTS platform_analytics (
  analytics_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value jsonb NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;

-- Market insights policies
CREATE POLICY "Authenticated users can view market insights"
  ON market_insights
  FOR SELECT
  TO authenticated
  USING (true);

-- Platform analytics policies (admin only)
CREATE POLICY "Admins can view analytics"
  ON platform_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert analytics"
  ON platform_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_insights_region ON market_insights(region);
CREATE INDEX IF NOT EXISTS idx_market_insights_crop ON market_insights(crop);
CREATE INDEX IF NOT EXISTS idx_market_insights_status ON market_insights(status);
CREATE INDEX IF NOT EXISTS idx_market_insights_created_at ON market_insights(created_at);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_metric_name ON platform_analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON platform_analytics(date);