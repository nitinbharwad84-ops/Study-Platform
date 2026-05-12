import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// DEV: hardcoded user ID until Phase 4 auth
const DEV_USER_ID = "00000000-0000-0000-0000-000000000099";

/**
 * GET /api/mcq/history
 * Query params: ?page=1&limit=10&subjectId=&status=
 * Returns paginated attempt history for the current user.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const subjectId = searchParams.get("subjectId");
    const status = searchParams.get("status");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = createServerClient();

    let query = supabase
      .from("mcq_attempts")
      .select("id, subject_id, total_questions, timer_mode, status, score, percentage, correct_count, wrong_count, unanswered_count, started_at, completed_at, subjects(name)", { count: "exact" })
      .eq("user_id", DEV_USER_ID)
      .order("started_at", { ascending: false })
      .range(from, to);

    if (subjectId) query = query.eq("subject_id", subjectId);
    if (status) query = query.eq("status", status);

    const { data, error, count } = await query;

    if (error) throw error;

    const attempts = (data || []).map((a) => ({
      id: a.id,
      subjectName: (a.subjects as unknown as { name: string })?.name,
      totalQuestions: a.total_questions,
      timerMode: a.timer_mode,
      status: a.status,
      score: a.score,
      percentage: a.percentage ? parseFloat(a.percentage) : null,
      correctCount: a.correct_count,
      wrongCount: a.wrong_count,
      unansweredCount: a.unanswered_count,
      startedAt: a.started_at,
      completedAt: a.completed_at,
    }));

    return NextResponse.json({
      attempts,
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    });
  } catch (error) {
    console.error("[GET /api/mcq/history]", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
