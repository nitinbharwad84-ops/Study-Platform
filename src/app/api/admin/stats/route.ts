import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats
 * Aggregates platform-wide metrics for the Admin Dashboard.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Verify admin session
    await requireAdmin(req);

    const supabaseAdmin = createServerClient();

    // 2. Fetch parallel metrics
    const [
      { count: usersCount },
      { count: subjectsCount },
      { count: mcqCount },
      { count: providerCount },
      { count: pendingResetsCount },
      { data: recentLogs }
    ] = await Promise.all([
      // Total registered users
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
      // Active subjects
      supabaseAdmin.from("subjects").select("*", { count: "exact", head: true }).eq("status", "active"),
      // Total questions in bank
      supabaseAdmin.from("mcq_questions").select("*", { count: "exact", head: true }),
      // AI Providers configured
      supabaseAdmin.from("provider_configs").select("*", { count: "exact", head: true }),
      // Pending password resets
      supabaseAdmin.from("password_reset_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      // Latest 5 audit logs
      supabaseAdmin.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(5)
    ]);

    // 3. Get admin counts specifically
    // We join with roles table and filter by role name
    const { count: adminCount } = await supabaseAdmin
      .from("users")
      .select("id, roles!inner(name)", { count: "exact", head: true })
      .in("roles.name", ["super_admin", "normal_admin"]);

    return NextResponse.json({
      stats: {
        totalUsers: usersCount || 0,
        totalAdmins: adminCount || 0,
        totalSubjects: subjectsCount || 0,
        totalQuestions: mcqCount || 0,
        totalProviders: providerCount || 0,
        pendingResets: pendingResetsCount || 0,
      },
      recentLogs: recentLogs || []
    });
  } catch (error: unknown) {
    console.error("[GET /api/admin/stats] Error:", error);
    return authErrorResponse(error as Error);
  }
}
