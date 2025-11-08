import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
};

export type Profile = {
  id: string;
  email: string;
  trust_score: number;
  profiles_analyzed: number;
  reports_submitted: number;
  created_at: string;
  updated_at: string;
};

export type WaitlistEntry = {
  id: string;
  email: string;
  name: string | null;
  interest_area: string;
  created_at: string;
};
