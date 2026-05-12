import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/mcq/dashboard-stats
 * Returns aggregated MCQ stats for the student dashboard.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const userId = session.id;

    const supabase = createServerClient();

    // Aggregate stats from mcq_analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from("mcq_analytics")
      .select("*, subjects(name)")
      .eq("user_id", userId);

    if (analyticsError) throw analyticsError;

    // Total stats
    const totalAttempts = analytics?.reduce((s, a) => s + a.total_attempts, 0) ?? 0;
    const totalQuestions = analytics?.reduce((s, a) => s + a.total_questions, 0) ?? 0;
    const totalCorrect = analytics?.reduce((s, a) => s + a.total_correct, 0) ?? 0;
    const totalWrong = analytics?.reduce((s, a) => s + a.total_wrong, 0) ?? 0;
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 10000) / 100 : 0;

    // Subject breakdown
    const subjectStats = (analytics ?? []).map((a) => ({
      subjectName: (a.subjects as unknown as { name: string })?.name ?? "Unknown",
      attempts: a.total_attempts,
      accuracy: a.avg_score_pct ?? 0,
      lastAttemptAt: a.last_attempt_at,
    })).sort((a, b) => (b.lastAttemptAt ?? "").localeCompare(a.lastAttemptAt ?? ""));

    // Active (in-progress) attempts
    const { data: activeAttempts, error: activeError } = await supabase
      .from("mcq_attempts")
      .select("id, subject_id, total_questions, current_index, timer_mode, expires_at, started_at, subjects(name)")
      .eq("user_id", userId)
      .eq("status", "in_progress")
      .order("started_at", { ascending: false })
      .limit(1);

    if (activeError) throw activeError;

    const resumable = activeAttempts?.[0]
      ? {
          attemptId: activeAttempts[0].id,
          subjectName: (Array.isArray(activeAttempts[0].subjects)
            ? (activeAttempts[0].subjects as unknown as { name: string }[])[0]?.name
            : (activeAttempts[0].subjects as unknown as { name: string })?.name) ?? "Unknown",
          currentIndex: activeAttempts[0].current_index,
          totalQuestions: activeAttempts[0].total_questions,
          timerMode: activeAttempts[0].timer_mode,
          expiresAt: activeAttempts[0].expires_at,
          startedAt: activeAttempts[0].started_at,
        }
      : null;

    // Recent 5 completed attempts
    const { data: recentAttempts } = await supabase
      .from("mcq_attempts")
      .select("id, subject_id, score, total_questions, percentage, started_at, subjects(name)")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("started_at", { ascending: false })
      .limit(5);

    const recentActivity = (recentAttempts ?? []).map((a) => ({
      attemptId: a.id,
      subjectName: (Array.isArray(a.subjects)
        ? (a.subjects as unknown as { name: string }[])[0]?.name
        : (a.subjects as unknown as { name: string })?.name) ?? "Unknown",
      score: a.score,
      totalQuestions: a.total_questions,
      percentage: a.percentage ? parseFloat(String(a.percentage)) : null,
      startedAt: a.started_at,
    }));

    return NextResponse.json({
      totalAttempts,
      totalQuestions,
      totalCorrect,
      totalWrong,
      accuracy,
      subjectStats,
      resumable,
      recentActivity,
    });
  } catch (error) {
    console.error("[GET /api/mcq/dashboard-stats]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
