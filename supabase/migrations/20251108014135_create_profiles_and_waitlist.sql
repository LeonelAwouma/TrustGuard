/*
  # Create profiles and waitlist tables

  1. New Tables
    - `profiles` - User profile data linked to auth.users
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `trust_score` (integer, 0-100, user's personal safety rating)
      - `profiles_analyzed` (integer, count of profiles checked)
      - `reports_submitted` (integer, count of scams reported)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `waitlist` - Email capture for pre-launch users
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text, optional)
      - `interest_area` (text, e.g., 'general', 'dating', 'investment')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only read/update their own profile
    - Waitlist is public read (for verification), but write-restricted
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  trust_score integer DEFAULT 75 CHECK (trust_score >= 0 AND trust_score <= 100),
  profiles_analyzed integer DEFAULT 0,
  reports_submitted integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  interest_area text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read waitlist for verification"
  ON waitlist FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can add to waitlist"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view waitlist"
  ON waitlist FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);