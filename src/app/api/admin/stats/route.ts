import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const supabaseAdmin = createServerClient();

    // Parallel counts
    const [
      { count: usersCount },
      { count: subjectsCount },
      { count: mcqCount },
      { count: providerCount },
      { data: recentLogs }
    ] = await Promise.all([
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("subjects").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("mcq_questions").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("provider_configs").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(5)
    ]);

    // Get admin counts separately
    const { count: adminCount } = await supabaseAdmin
      .from("users")
      .select("*, roles!inner(*)", { count: "exact", head: true })
      .in("roles.name", ["super_admin", "normal_admin"]);

    return NextResponse.json({
      stats: {
        totalUsers: usersCount || 0,
        totalAdmins: adminCount || 0,
        totalSubjects: subjectsCount || 0,
        totalQuestions: mcqCount || 0,
        totalProviders: providerCount || 0,
        pendingResets: 0, // Placeholder
      },
      recentLogs: recentLogs || []
    });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
