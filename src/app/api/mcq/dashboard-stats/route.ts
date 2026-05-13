import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/mcq/dashboard-stats
 * Returns aggregated MCQ stats for the student dashboard.
 * Now uses direct aggregation from attempts for 100% accuracy and sync.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const userId = session?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    // 1. Fetch all completed attempts for this user to calculate stats
    const { data: attempts, error: attemptsError } = await supabase
      .from("mcq_attempts")
      .select("id, subject_id, score, total_questions, correct_count, wrong_count, percentage, started_at, subjects(name)")
      .eq("user_id", userId)
      .eq("status", "completed");

    if (attemptsError) throw attemptsError;

    // 2. Calculate aggregations
    let totalAttempts = attempts?.length || 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    
    const subjectMap: Record<string, { name: string; attempts: number; totalQ: number; correct: number; lastAt: string }> = {};

    for (const a of attempts || []) {
      totalQuestions += a.total_questions || 0;
      totalCorrect += a.correct_count || 0;
      totalWrong += a.wrong_count || 0;

      const sName = (a.subjects as any)?.name || "Unknown";
      if (!subjectMap[a.subject_id]) {
        subjectMap[a.subject_id] = { name: sName, attempts: 0, totalQ: 0, correct: 0, lastAt: a.started_at };
      }
      subjectMap[a.subject_id].attempts += 1;
      subjectMap[a.subject_id].totalQ += a.total_questions || 0;
      subjectMap[a.subject_id].correct += a.correct_count || 0;
      if (new Date(a.started_at) > new Date(subjectMap[a.subject_id].lastAt)) {
        subjectMap[a.subject_id].lastAt = a.started_at;
      }
    }

    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 10000) / 100 : 0;

    const subjectStats = Object.values(subjectMap).map(s => ({
      subjectName: s.name,
      attempts: s.attempts,
      accuracy: s.totalQ > 0 ? Math.round((s.correct / s.totalQ) * 100) : 0,
      lastAttemptAt: s.lastAt
    })).sort((a, b) => b.lastAttemptAt.localeCompare(a.lastAttemptAt));

    // 3. Active (in-progress) attempts
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
          subjectName: (activeAttempts[0].subjects as any)?.name ?? "Unknown",
          currentIndex: activeAttempts[0].current_index,
          totalQuestions: activeAttempts[0].total_questions,
          timerMode: activeAttempts[0].timer_mode,
          expiresAt: activeAttempts[0].expires_at,
          startedAt: activeAttempts[0].started_at,
        }
      : null;

    // 4. Recent 5 completed attempts
    const recentActivity = (attempts ?? [])
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .slice(0, 5)
      .map((a) => ({
        attemptId: a.id,
        subjectName: (a.subjects as any)?.name ?? "Unknown",
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
