import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client (uses anon key).
 * Safe to use in client components.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
