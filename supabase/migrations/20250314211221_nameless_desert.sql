/*
  # Create products and recipes tables

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `barcode` (text, unique)
      - `name` (text)
      - `expiry_date` (date)
      - `added_at` (timestamp)
      - `user_id` (uuid, foreign key)
      - `quantity` (integer)
      - `details` (jsonb)
    - `recipes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `ingredients` (text[])
      - `instructions` (text)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode text UNIQUE NOT NULL,
  name text NOT NULL,
  expiry_date date,
  added_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  quantity integer DEFAULT 1,
  details jsonb DEFAULT '{}'::jsonb
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ingredients text[] NOT NULL,
  instructions text NOT NULL,
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own recipes"
  ON recipes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);