import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/audit-logs
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission("can_view_audit_logs", req);

    const supabaseAdmin = createServerClient();

    const { data: logs, error } = await supabaseAdmin
      .from("audit_logs")
      .select(`
        *,
        users (first_name, last_name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[GET /api/admin/audit-logs] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch audit logs." }, { status: 500 });
    }

    const formattedLogs = logs?.map((l: any) => ({
      ...l,
      actor_email: l.users?.email || "System",
      severity: l.severity || "info" // Default if missing
    }));

    return NextResponse.json({ logs: formattedLogs });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
