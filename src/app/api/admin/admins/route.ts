import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/admins
 * List all users with admin roles.
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission("can_manage_admins", req);

    const supabaseAdmin = createServerClient();

    const { data: admins, error } = await supabaseAdmin
      .from("users")
      .select(`
        id,
        email,
        first_name,
        last_name,
        role,
        status,
        created_at
      `)
      .in("role", ["super_admin", "normal_admin"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/admin/admins] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch admins." }, { status: 500 });
    }

    return NextResponse.json({ admins });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
