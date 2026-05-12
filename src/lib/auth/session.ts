import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import { createServerClient } from "@/lib/supabase/server";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "normal_admin" | "student";
  status: string;
}

/**
 * Get the current authenticated user from the session cookie.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Fetch user profile + role from our users table
    const adminClient = createServerClient();
    const { data: profile } = await adminClient
      .from("users")
      .select("*, roles(name)")
      .eq("id", user.id)
      .single();

    if (!profile) return null;

    const roleName = (profile.roles as unknown as { name: string })?.name ?? "student";

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
 * Use in API routes that need a valid session.
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  if (session.status === "disabled" || session.status === "suspended") {
    throw new Error("ACCOUNT_DISABLED");
  }
  return session;
}

/**
 * Require admin role — throws if not admin.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role === "student") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

/**
 * Require super admin role — throws if not super admin.
 */
export async function requireSuperAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== "super_admin") {
    throw new Error("FORBIDDEN");
  }
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
