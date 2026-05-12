import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client (uses anon key, cookie-based session).
 * Use this in "use client" components and pages.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
