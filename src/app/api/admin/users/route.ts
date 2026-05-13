import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * List all users with their roles.
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission("can_manage_users", req);

    const supabaseAdmin = createServerClient();

    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select(`
        id,
        email,
        first_name,
        last_name,
        roles ( name ),
        status,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/admin/users] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
    }

    const formattedUsers = users?.map((u: any) => ({
      ...u,
      role: u.roles?.name || "unknown",
      roles: undefined
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
