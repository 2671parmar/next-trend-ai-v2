import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type MBSCommentary = {
  id: string;
  title: string;
  content: string;
  source_url: string | null;
  published_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TrendingTopic = {
  id: string;
  title: string;
  description: string | null;
  source_url: string | null;
  category: string | null;
  published_date: string | null;
  created_at: string;
  updated_at: string;
}; 