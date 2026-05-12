import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client with anon key + cookie session.
 * Use this in Server Components and Route Handlers to read the current user session.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch { /* Server component context — set handled by middleware */ }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch { /* Server component context */ }
        },
      },
    }
  );
}

/**
 * Admin-level Supabase client (service role key) — bypasses RLS.
 * Use only in trusted server contexts (API routes, never the browser).
 */
export { createServerClient } from "@/lib/supabase/server";
