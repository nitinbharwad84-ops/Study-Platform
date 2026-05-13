import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Only admins with 'can_approve_resets' permission can view the queue
    await requirePermission("can_approve_resets", req);

    const supabaseAdmin = createServerClient();

    const { data: requests, error } = await supabaseAdmin
      .from("password_reset_requests")
      .select(`
        id,
        user_id,
        email,
        reason,
        status,
        requested_at,
        reviewed_at,
        users!password_reset_requests_user_id_fkey (
          first_name,
          last_name
        ),
        reviewer:users!password_reset_requests_reviewed_by_fkey (
          first_name,
          last_name
        )
      `)
      .order("requested_at", { ascending: false });

    if (error) {
      console.error("[GET /api/admin/password-resets] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch requests." }, { status: 500 });
    }

    return NextResponse.json({ requests });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
