import { createServerClient as createSSRClient } from "@supabase/ssr";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "normal_admin" | "student";
  status: string;
}

/**
 * Build an SSR Supabase client that reads cookies from:
 *  - A NextRequest (Route Handlers) → request-scoped, correct cookie names
 *  - next/headers (Server Components / Server Actions) → fallback
 */
function buildSSRClient(req?: NextRequest) {
  if (req) {
    return createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );
  }

  const cookieStore = cookies();
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}

/**
 * Get the current authenticated user from the session cookie.
 * Pass `req` when calling from a Route Handler (API route).
 * Returns null if not authenticated.
 */
export async function getSession(req?: NextRequest): Promise<SessionUser | null> {
  try {
    const supabase = buildSSRClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Use service-role client (bypasses RLS)
    const adminClient = createServerClient();

    // Step 1: Get user profile (no FK join — avoid PostgREST relationship issues)
    const { data: profile, error: profileError } = await adminClient
      .from("users")
      .select("id, email, first_name, last_name, role_id, status")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return null;

    // Step 2: Fetch role explicitly by role_id
    let roleName = "student";
    if (profile.role_id) {
      const { data: roleData } = await adminClient
        .from("roles")
        .select("name")
        .eq("id", profile.role_id)
        .single();

      if (roleData?.name) {
        roleName = roleData.name;
      }
    }

    return {
      id: user.id,
      email: user.email!,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: roleName as SessionUser["role"],
      status: profile.status,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication — throws if not logged in.
 */
export async function requireAuth(req?: NextRequest): Promise<SessionUser> {
  const session = await getSession(req);
  if (!session) throw new Error("UNAUTHENTICATED");
  if (session.status === "disabled" || session.status === "suspended") {
    throw new Error("ACCOUNT_DISABLED");
  }
  return session;
}

/**
 * Require admin role (normal_admin or super_admin).
 */
export async function requireAdmin(req?: NextRequest): Promise<SessionUser> {
  const session = await requireAuth(req);
  if (session.role === "student") throw new Error("FORBIDDEN");
  return session;
}

/**
 * Require super admin role only.
 */
export async function requireSuperAdmin(req?: NextRequest): Promise<SessionUser> {
  const session = await requireAuth(req);
  if (session.role !== "super_admin") throw new Error("FORBIDDEN");
  return session;
}

/**
 * Standardized error responses for auth failures.
 */
export function authErrorResponse(error: Error) {
  if (error.message === "UNAUTHENTICATED") {
    return { status: 401, body: { error: "Authentication required" } };
  }
  if (error.message === "FORBIDDEN") {
    return { status: 403, body: { error: "Insufficient permissions" } };
  }
  if (error.message === "ACCOUNT_DISABLED") {
    return { status: 403, body: { error: "Account is disabled" } };
  }
  return { status: 500, body: { error: "Internal server error" } };
}
